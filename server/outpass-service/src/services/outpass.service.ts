// server/outpass-service/src/services/outpass.service.ts
import prisma from '../utils/prisma.js';
import { uploadProofDocument, deleteProofDocument } from './cloudinary.service.js';
import { OutpassStatus, ApprovalStatus, OutpassType } from '../generated/prisma/client.js';  // ✅ ADD OutpassType
import {
  publishOutpassCreated,
  publishOutpassParentApproved,
  publishOutpassParentRejected,
  publishOutpassWardenApproved,
  publishOutpassWardenRejected,
  publishOutpassCancelled,
  publishOutpassWardenDeleted,
  publishOutpassForceDeleted
} from '../events/outpass-events.publisher.js';
import { publishEvent } from '../utils/rabbitmq.js';  // ✅ ADD THIS


// ==================== NEW: Active Creation Window Check ====================
// Statuses that should NOT block creation of new outpasses
const NON_BLOCKING_STATUSES: OutpassStatus[] = [
  OutpassStatus.CANCELLED,
  OutpassStatus.REJECTED,
];

/**
 * Check if student is in an "active creation window" where they cannot create new outpass
 * Rule: Block if any outpass exists where createdAt <= now <= returningDate
 * (excludes CANCELLED and REJECTED outpasses)
 */
export async function hasActiveCreationWindow(studentId: string): Promise<boolean> {
  const now = new Date();

  const existing = await prisma.outpassRequest.findFirst({
    where: {
      studentId,
      status: { notIn: NON_BLOCKING_STATUSES },
      createdAt: { lte: now },
      returningDate: { gte: now },
    },
    select: { id: true, returningDate: true },
  });

  return !!existing;
}

// ==================== Create Outpass Request (Student) ====================
export async function createOutpassRequest(data: any, file?: Express.Multer.File) {
  // ✅ NEW: Block if student is still in active creation window (createdAt -> returningDate)
  const blocked = await hasActiveCreationWindow(data.studentId);
  if (blocked) {
    const err: any = new Error("Outpass active. Can't create new one.");
    err.statusCode = 409; // Conflict
    throw err;
  }

  let proofData = null;
  if (file) proofData = await uploadProofDocument(file);

  const outpass = await prisma.outpassRequest.create({
    data: {
      studentId: data.studentId,
      type: data.type,
      reason: data.reason,
      outgoingDate: new Date(data.outgoingDateTime),
      returningDate: new Date(data.returningDateTime),
      proofUrl: proofData?.url,
      proofPublicId: proofData?.publicId,
      status: OutpassStatus.PENDING,
      parentApproval: ApprovalStatus.PENDING,
      wardenApproval: ApprovalStatus.PENDING,
    },
  });

  // 🆕 Publish outpass.created event
  try {
    await publishOutpassCreated({
      outpassId: outpass.id,
      studentId: outpass.studentId,
      type: outpass.type,
      reason: outpass.reason,
      outgoingDate: outpass.outgoingDate,
      returningDate: outpass.returningDate,
    });
  } catch (error) {
    console.error('Failed to publish outpass.created event:', error);
  }

  return outpass;
}

// ==================== Get Student's Own Outpasses ====================
export async function getStudentOutpasses(studentId: string) {
  return await prisma.outpassRequest.findMany({
    where: { studentId },
    orderBy: { createdAt: 'desc' },
  });
}

// ==================== Get All Outpasses (Admin) ====================
export async function getAllOutpasses(filters?: any) {
  const where: any = {};
  if (filters?.status) where.status = filters.status;
  if (filters?.type) where.type = filters.type;
  if (filters?.studentId) where.studentId = filters.studentId;

  return await prisma.outpassRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

// ==================== Get Pending Outpasses for Parent ====================
export async function getPendingForParent(studentIds: string[]) {
  return await prisma.outpassRequest.findMany({
    where: {
      studentId: { in: studentIds },
      parentApproval: ApprovalStatus.PENDING,
      status: OutpassStatus.PENDING,
    },
    orderBy: { createdAt: 'desc' },
  });
}

// ==================== Get All Outpasses for Warden ====================
export async function getOutpassesForWarden() {
  const outpasses = await prisma.outpassRequest.findMany({
    where: {
      parentApproval: { in: [ApprovalStatus.APPROVED, ApprovalStatus.REJECTED] },
      status: { in: [OutpassStatus.PENDING, OutpassStatus.PARENT_APPROVED] },
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      studentId: true,
      type: true,
      reason: true,
      outgoingDate: true,
      returningDate: true,
      proofUrl: true,
      status: true,
      parentApproval: true,
      parentApprovedAt: true,
      wardenApproval: true,
      wardenApprovedAt: true,
      wardenRejectionComment: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (outpasses.length === 0) return [];

  const studentIds = [...new Set(outpasses.map(o => o.studentId))];

  const students = await prisma.$queryRaw<
    Array<{
      id: string;
      firstName: string;
      lastName: string;
      enrollmentNumber: string | null;
      email: string;
    }>
  >`
    SELECT
      sp.id,
      sp."firstName",
      sp."lastName",
      sp."enrollmentNumber",
      u.email
    FROM public."StudentProfile" sp
    JOIN public."User" u ON u.id = sp."userId"
    WHERE sp.id = ANY(${studentIds})
  `;

  const studentMap = new Map(
    students.map(s => [
      s.id,
      {
        name: `${s.firstName} ${s.lastName}`,
        email: s.email,
        enrollmentNumber: s.enrollmentNumber,
      },
    ])
  );

  return outpasses.map(o => ({
    ...o,
    student: studentMap.get(o.studentId) ?? null,
  }));
}


// ==================== Parent Approval ====================
export async function parentApproval(outpassId: string, action: 'APPROVE' | 'REJECT') {
  const outpass = await prisma.outpassRequest.findUnique({ where: { id: outpassId } });

  if (!outpass) throw new Error('Outpass not found');

  if (outpass.parentApproval !== ApprovalStatus.PENDING) {
    throw new Error('Parent has already processed this request');
  }

  const approval = action === 'APPROVE' ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED;
  const newStatus = action === 'APPROVE' ? OutpassStatus.PARENT_APPROVED : OutpassStatus.REJECTED;

  const updatedOutpass = await prisma.outpassRequest.update({
    where: { id: outpassId },
    data: {
      parentApproval: approval,
      parentApprovedAt: new Date(),
      status: newStatus,
    },
  });

  // 🆕 Publish parent approval/rejection events
  try {
    if (action === 'APPROVE') {
      await publishOutpassParentApproved({
        outpassId: updatedOutpass.id,
        studentId: updatedOutpass.studentId,
        type: updatedOutpass.type,
        outgoingDate: updatedOutpass.outgoingDate,
        returningDate: updatedOutpass.returningDate,
      });
    } else {
      await publishOutpassParentRejected({
        outpassId: updatedOutpass.id,
        studentId: updatedOutpass.studentId,
        type: updatedOutpass.type,
      });
    }
  } catch (error) {
    console.error('Failed to publish parent approval event:', error);
  }

  return updatedOutpass;
}

// ==================== Warden Approval ====================
export async function wardenApproval(
  outpassId: string,
  action: 'APPROVE' | 'REJECT',
  comment?: string
) {
  const outpass = await prisma.outpassRequest.findUnique({ where: { id: outpassId } });

  if (!outpass) throw new Error('Outpass not found');

  if (outpass.parentApproval !== ApprovalStatus.APPROVED) {
    throw new Error('Cannot process: Parent has not approved this request');
  }

  if (outpass.wardenApproval !== ApprovalStatus.PENDING) {
    throw new Error('Warden has already processed this request');
  }

  if (action === 'REJECT' && !comment) {
    throw new Error('Rejection comment is required');
  }

  const approval = action === 'APPROVE' ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED;
  const newStatus = action === 'APPROVE' ? OutpassStatus.APPROVED : OutpassStatus.REJECTED;

  const updatedOutpass = await prisma.outpassRequest.update({
    where: { id: outpassId },
    data: {
      wardenApproval: approval,
      wardenApprovedAt: new Date(),
      wardenRejectionComment: action === 'REJECT' ? comment : null,
      status: newStatus,
    },
  });

  // 🆕 Publish warden approval/rejection events
  try {
    if (action === 'APPROVE') {
      await publishOutpassWardenApproved({
        outpassId: updatedOutpass.id,
        studentId: updatedOutpass.studentId,
        type: updatedOutpass.type,
        outgoingDate: updatedOutpass.outgoingDate,
        returningDate: updatedOutpass.returningDate,
      });
    } else {
      await publishOutpassWardenRejected({
        outpassId: updatedOutpass.id,
        studentId: updatedOutpass.studentId,
        type: updatedOutpass.type,
        comment: comment,
      });
    }
  } catch (error) {
    console.error('Failed to publish warden approval event:', error);
  }

  return updatedOutpass;
}

// ==================== Active Outpass Checks (for attendance service) ====================
export async function hasActiveOutpassOnDate(
  studentId: string,
  queryDate: Date
): Promise<boolean> {
  const activeOutpass = await prisma.outpassRequest.findFirst({
    where: {
      studentId,
      status: OutpassStatus.APPROVED,
      outgoingDate: { lte: queryDate },
      returningDate: { gte: queryDate },
    },
  });

  return !!activeOutpass;
}

export async function checkActiveOutpass(studentId: string): Promise<boolean> {
  const today = new Date();
  return hasActiveOutpassOnDate(studentId, today);
}

export async function getActiveOutpass(studentId: string) {
  const today = new Date();
  return await prisma.outpassRequest.findFirst({
    where: {
      studentId,
      status: OutpassStatus.APPROVED,
      outgoingDate: { lte: today },
      returningDate: { gte: today },
    },
  });
}

// ==================== Cancel Outpass (Student) ====================
export async function cancelOutpass(outpassId: string, studentId: string) {
  const outpass = await prisma.outpassRequest.findUnique({
    where: { id: outpassId },
  });

  if (!outpass) throw new Error('Outpass not found');
  if (outpass.studentId !== studentId) throw new Error('Unauthorized');

  if (!['PENDING', 'PARENT_APPROVED'].includes(outpass.status)) {
    throw new Error('Cannot cancel this outpass');
  }

  const updatedOutpass = await prisma.outpassRequest.update({
    where: { id: outpassId },
    data: { status: OutpassStatus.CANCELLED },
  });

  // 🆕 Publish outpass.cancelled event
  try {
    await publishOutpassCancelled({
      outpassId: updatedOutpass.id,
      studentId: updatedOutpass.studentId,
      type: updatedOutpass.type,
    });
  } catch (error) {
    console.error('Failed to publish outpass.cancelled event:', error);
  }

  return updatedOutpass;
}

// ==================== Delete Outpass (Admin/Warden) ====================
export async function deleteOutpass(outpassId: string) {
  const outpass = await prisma.outpassRequest.findUnique({ where: { id: outpassId } });

  if (!outpass) throw new Error('Outpass not found');

  if (outpass.proofPublicId) {
    const resourceType = outpass.proofUrl?.endsWith('.pdf') ? 'raw' : 'image';
    await deleteProofDocument(outpass.proofPublicId, resourceType);
  }

  await prisma.outpassRequest.delete({ where: { id: outpassId } });

  return { message: 'Outpass deleted successfully' };
}

// ==================== Get Single Outpass by ID ====================
export async function getOutpassById(outpassId: string) {
  const outpass = await prisma.outpassRequest.findUnique({ where: { id: outpassId } });

  if (!outpass) throw new Error('Outpass not found');

  return outpass;
}



// ==================== SEARCH STUDENTS (For Warden) ====================
export async function searchStudents(searchQuery: string) {
  if (!searchQuery || searchQuery.trim().length < 2) {
    return [];
  }

  const searchTerm = `%${searchQuery.trim().toLowerCase()}%`;
  
  const students = await prisma.$queryRaw<Array<{
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    enrollmentNumber: string | null;  // ✅ CHANGED: enrollmentNumber
  }>>`
    SELECT 
      sp.id,
      sp."userId",
      sp."firstName",
      sp."lastName",
      u.email,
      sp."enrollmentNumber"  -- ✅ FIXED: enrollmentNumber, NOT rollNumber
    FROM public."StudentProfile" sp
    INNER JOIN public."User" u ON u.id = sp."userId"
    WHERE 
      LOWER(sp."firstName") LIKE ${searchTerm}
      OR LOWER(sp."lastName") LIKE ${searchTerm}
      OR LOWER(u.email) LIKE ${searchTerm}
      OR LOWER(COALESCE(sp."enrollmentNumber", '')) LIKE ${searchTerm}  -- ✅ FIXED
    ORDER BY sp."firstName", sp."lastName"
    LIMIT 20
  `;

  console.log(`✅ Found ${students.length} students for "${searchQuery}"`);
  return students;
}


// ==================== GET STUDENT OUTPASS HISTORY (Warden) ====================
export async function getStudentOutpassHistory(
  studentId: string,
  filters?: {
    status?: OutpassStatus;
    type?: OutpassType;
    fromDate?: Date;
    toDate?: Date;
  }
) {
  const where: any = { studentId };

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.type) {
    where.type = filters.type;
  }

  if (filters?.fromDate || filters?.toDate) {
    where.createdAt = {};
    if (filters.fromDate) where.createdAt.gte = filters.fromDate;
    if (filters.toDate) where.createdAt.lte = filters.toDate;
  }

  return await prisma.outpassRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      type: true,
      reason: true,
      outgoingDate: true,
      returningDate: true,
      status: true,
      parentApproval: true,
      parentApprovedAt: true,
      wardenApproval: true,
      wardenApprovedAt: true,
      wardenRejectionComment: true,
      proofUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

// ==================== DELETE OUTPASS (Warden-specific) ====================
// ==================== DELETE OUTPASS (Warden-specific) ====================
export async function wardenDeleteOutpass(outpassId: string, reason?: string) {
  const outpass = await prisma.outpassRequest.findUnique({ where: { id: outpassId } });

  if (!outpass) throw new Error('Outpass not found');

  console.log(`🗑️ Warden deleting outpass ${outpassId}. Reason: ${reason || 'Not provided'}`);

  if (outpass.proofPublicId) {
    const resourceType = outpass.proofUrl?.endsWith('.pdf') ? 'raw' : 'image';
    await deleteProofDocument(outpass.proofPublicId, resourceType);
  }

  await prisma.outpassRequest.delete({ where: { id: outpassId } });

  // ✅ USE THE PROPER PUBLISHER FUNCTION
  try {
    await publishOutpassWardenDeleted({
      outpassId: outpass.id,
      studentId: outpass.studentId,
      type: outpass.type,
      status: outpass.status,
      reason: reason,
    });
  } catch (error) {
    console.error('Failed to publish outpass deletion event:', error);
  }

  return { 
    message: 'Outpass deleted successfully by warden',
    deletedOutpass: {
      id: outpass.id,
      studentId: outpass.studentId,
      type: outpass.type,
      status: outpass.status,
    }
  };
}

// ==================== FORCE DELETE ACTIVE OUTPASS ====================
// ==================== FORCE DELETE ACTIVE OUTPASS ====================
export async function forceDeleteActiveOutpass(outpassId: string, wardenReason: string) {
  const outpass = await prisma.outpassRequest.findUnique({ where: { id: outpassId } });

  if (!outpass) throw new Error('Outpass not found');

  const now = new Date();
  const isActive = 
    outpass.status === OutpassStatus.APPROVED &&
    outpass.outgoingDate <= now &&
    outpass.returningDate >= now;

  if (!wardenReason || wardenReason.trim().length < 10) {
    throw new Error('A detailed reason (min 10 characters) is required for deleting outpasses');
  }

  console.warn(`⚠️ FORCE DELETE: Warden deleting ${isActive ? 'ACTIVE' : ''} outpass ${outpassId}`);
  console.warn(`Reason: ${wardenReason}`);

  if (outpass.proofPublicId) {
    const resourceType = outpass.proofUrl?.endsWith('.pdf') ? 'raw' : 'image';
    await deleteProofDocument(outpass.proofPublicId, resourceType);
  }

  await prisma.outpassRequest.delete({ where: { id: outpassId } });

  // ✅ USE THE PROPER PUBLISHER FUNCTION
  try {
    await publishOutpassForceDeleted({
      outpassId: outpass.id,
      studentId: outpass.studentId,
      type: outpass.type,
      status: outpass.status,
      wasActive: isActive,
      wardenReason: wardenReason,
      outgoingDate: outpass.outgoingDate,
      returningDate: outpass.returningDate,
    });
  } catch (error) {
    console.error('Failed to publish force deletion event:', error);
  }

  return { 
    message: `${isActive ? 'Active' : ''} Outpass deleted by warden`,
    deletedOutpass: {
      id: outpass.id,
      studentId: outpass.studentId,
      type: outpass.type,
      status: outpass.status,
      wasActive: isActive,
    }
  };
}

