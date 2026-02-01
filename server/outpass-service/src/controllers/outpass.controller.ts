//server\outpass-service\src\controllers\outpass.controller.ts
import { Request, Response } from 'express';
import * as outpassService from '../services/outpass.service.js';
import { 
  createOutpassSchema, 
  parentApprovalSchema, 
  wardenApprovalSchema,
  forceDeleteSchema  
} from '../schemas/outpass.schema.js';

import prisma from '../utils/prisma.js';


import { hasActiveOutpassOnDate } from '../services/outpass.service.js';


// server/outpass-service/src/controllers/outpass.controller.ts

export async function createOutpass(req: Request, res: Response) {
  try {
    const result = createOutpassSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, errors: result.error.issues });
    }

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const proofFile = req.file;

    const userId = req.user.userId;
    const studentProfile = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM public."StudentProfile" WHERE "userId" = ${userId}
    `;
    
    if (!studentProfile || studentProfile.length === 0) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const studentId = studentProfile[0].id;
    const outpassData = { ...result.data, studentId };

    const outpass = await outpassService.createOutpassRequest(outpassData, proofFile);
    
    res.status(201).json({ success: true, data: outpass });
  } catch (error: any) {
    // ✅ Handle 409 Conflict from service layer
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: error.message });
  }
}




export async function getMyOutpasses(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const userId = req.user.userId;
    const studentProfile = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM public."StudentProfile" WHERE "userId" = ${userId}
    `;
    
    if (!studentProfile || studentProfile.length === 0) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    const studentId = studentProfile[0].id;
    
    const outpasses = await outpassService.getStudentOutpasses(studentId);
    res.json({ success: true, data: outpasses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export async function cancelOutpass(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { id } = req.params;
    const userId = req.user.userId;
    const studentProfile = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM public."StudentProfile" WHERE "userId" = ${userId}
    `;
    
    if (!studentProfile || studentProfile.length === 0) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    const studentId = studentProfile[0].id;
    const outpass = await outpassService.cancelOutpass(id, studentId);
    res.json({ success: true, data: outpass });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
export async function getPendingForParent(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const userId = req.user.userId;
    const parentProfile = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM public."ParentProfile" WHERE "userId" = ${userId}
    `;
    
    if (!parentProfile || parentProfile.length === 0) {
      return res.status(404).json({ success: false, message: 'Parent profile not found' });
    }
    const parentId = parentProfile[0].id;
    const studentLinks = await prisma.$queryRaw<Array<{ studentId: string }>>`
      SELECT "studentId" FROM public."ParentStudentLink" WHERE "parentId" = ${parentId}
    `;
    
    const studentIds = studentLinks.map(link => link.studentId);
    if (studentIds.length === 0) {
      return res.json({ success: true, data: [] });
    }
    const outpasses = await outpassService.getPendingForParent(studentIds);
    res.json({ success: true, data: outpasses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export async function getParentOutpassHistory(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const userId = req.user.userId;
    const parentProfile = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM public."ParentProfile" WHERE "userId" = ${userId}
    `;
    
    if (!parentProfile || parentProfile.length === 0) {
      return res.status(404).json({ success: false, message: 'Parent profile not found' });
    }
    const parentId = parentProfile[0].id;
    const studentLinks = await prisma.$queryRaw<Array<{ studentId: string }>>`
      SELECT "studentId" FROM public."ParentStudentLink" WHERE "parentId" = ${parentId}
    `;
    
    const studentIds = studentLinks.map(link => link.studentId);
    if (studentIds.length === 0) {
      return res.json({ success: true, data: [] });
    }
    const filter = req.query.filter as string | undefined;
    let whereClause: any = { studentId: { in: studentIds } };
    if (filter === 'approved') {
      whereClause.parentApproval = 'APPROVED';
    } else if (filter === 'cancelled') {
      whereClause.status = 'CANCELLED';
    }
    const outpasses = await prisma.outpassRequest.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: outpasses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export async function handleParentApproval(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = parentApprovalSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, errors: result.error.issues });
    }
    const outpass = await outpassService.parentApproval(id, result.data.action);
    res.json({ success: true, data: outpass });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
// ==================== WARDEN ROUTES ====================
export async function getWardenOutpasses(req: Request, res: Response) {
  try {
    const outpasses = await outpassService.getOutpassesForWarden();
    res.json({ success: true, data: outpasses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export async function handleWardenApproval(req: Request, res: Response) {
  try {
    console.log('=== WARDEN APPROVAL HANDLER ===');
    console.log('req.user:', req.user);
    console.log('req.body:', req.body);
    console.log('req.params:', req.params);
    
    const { id } = req.params;
    
    // Check if body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error('Empty request body');
      return res.status(400).json({ 
        success: false, 
        message: 'Request body is empty',
        debug: {
          receivedBody: req.body,
          contentType: req.headers['content-type']
        }
      });
    }
    
    console.log('Attempting to parse with Zod...');
    const result = wardenApprovalSchema.safeParse(req.body);
    
    if (!result.success) {
      console.error(' Zod validation failed:', result.error.issues);
      return res.status(400).json({ 
        success: false, 
        errors: result.error.issues,
        receivedBody: req.body
      });
    }
    
    console.log('✅ Validation passed:', result.data);
    
    const outpass = await outpassService.wardenApproval(
      id, 
      result.data.action, 
      result.data.comment
    );
    
    console.log('✅ Outpass updated successfully');
    res.json({ success: true, data: outpass });
  } catch (error: any) {
    console.error(' Controller error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
}

//-------------------------------------------------------------------------------------------------
// ==================== WARDEN: Search Students ====================
export async function searchStudentsController(req: Request, res: Response) {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query parameter "q" is required' 
      });
    }

    if (q.trim().length < 2) {
      return res.json({ 
        success: true, 
        data: [],
        message: 'Query too short. Minimum 2 characters required.' 
      });
    }

    const students = await outpassService.searchStudents(q);
    
    res.json({ 
      success: true, 
      data: students,
      count: students.length 
    });
  } catch (error: any) {
    console.error('Search students error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}

// ==================== WARDEN: Get Student Outpass History ====================
export async function getStudentHistory(req: Request, res: Response) {
  try {
    const { studentId } = req.params;
    
    const filters: any = {};
    
    if (req.query.status) {
      filters.status = req.query.status as string;
    }
    
    if (req.query.type) {
      filters.type = req.query.type as string;
    }
    
    if (req.query.fromDate) {
      filters.fromDate = new Date(req.query.fromDate as string);
    }
    
    if (req.query.toDate) {
      filters.toDate = new Date(req.query.toDate as string);
    }

    const history = await outpassService.getStudentOutpassHistory(studentId, filters);
    
    res.json({ 
      success: true, 
      data: history,
      count: history.length 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ==================== WARDEN: Delete Outpass ====================
export async function wardenDeleteOutpass(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    console.log(`🗑️ Warden initiating delete for outpass: ${id}`);
    
    const result = await outpassService.wardenDeleteOutpass(id, reason);
    
    res.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Warden delete error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
}

// ==================== WARDEN: Force Delete Active Outpass ====================
export async function forceDeleteActiveOutpass(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const result = forceDeleteSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        errors: result.error.issues 
      });
    }

    console.warn(`⚠️ Warden force-deleting outpass: ${id}`);
    
    const deleteResult = await outpassService.forceDeleteActiveOutpass(
      id, 
      result.data.reason
    );
    
    res.json({ success: true, ...deleteResult });
  } catch (error: any) {
    console.error('Force delete error:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
}
//---------------------------------------------------------------------------------

// ==================== ADMIN ROUTES ====================
export async function getAllOutpasses(req: Request, res: Response) {
  try {
    const filters = req.query;
    const outpasses = await outpassService.getAllOutpasses(filters);
    res.json({ success: true, data: outpasses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export async function deleteOutpass(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await outpassService.deleteOutpass(id);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}


export async function checkActiveOutpass(req: Request, res: Response) {
  try {
    const { studentId } = req.params;
    const { date } = req.query; // expects ISO string
    if (!date) {
      return res.status(400).json({ success: false, message: 'date query param is required' });
    }
    const queryDate = new Date(date as string);
    if (isNaN(queryDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }
    const hasActiveOutpass = await hasActiveOutpassOnDate(studentId, queryDate);
    return res.json({ hasActiveOutpass });
  } catch (error: any) {
    console.error('checkActiveOutpass error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}
