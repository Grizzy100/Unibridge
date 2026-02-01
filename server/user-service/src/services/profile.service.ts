
//server/user-service/src/services/profile.service.ts
import { Role } from "../generated/prisma/client.js";
import bcrypt from "bcrypt";
import prisma from '../utils/prisma.js';

// Create Student with Profile
export async function createStudentWithProfile(data: any) {
  try {
    const existingUser = await prisma.user.findUnique({ 
      where: { email: data.email } 
    });
    if (existingUser) throw new Error("Email already exists");
    const existingEnrollment = await prisma.studentProfile.findUnique({
      where: { enrollmentNumber: data.enrollmentNumber }
    });
    if (existingEnrollment) throw new Error("Enrollment number already exists");
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: Role.STUDENT
        }
      });
      const profile = await tx.studentProfile.create({
        data: {
          userId: user.id,
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: new Date(data.dateOfBirth),
          gender: data.gender,
          phoneNumber: data.phoneNumber,
          bloodGroup: data.bloodGroup,
          enrollmentNumber: data.enrollmentNumber,
          customEmail: data.customEmail,
          school: data.school,
          batch: data.batch,
          year: data.year,
          semester: data.semester,
          specialization: data.specialization,
          currentAddress: data.currentAddress,
          permanentAddress: data.permanentAddress,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          fatherName: data.fatherName,
          motherName: data.motherName,
          guardianName: data.guardianName,
          parentContact: data.parentContact,
          emergencyContact: data.emergencyContact,
          hostelAssigned: data.hostelAssigned || false,
          hostelName: data.hostelName,
          roomNumber: data.roomNumber,
        }
      });
      return { user, profile };
    });
    return {
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
      profile: result.profile
    };
  } catch (error: any) {
    console.error("Error creating student:", error.message);
    throw error;
  }
}

// Create Teacher with Profile
export async function createTeacherWithProfile(data: any) {
  try {
    const existingUser = await prisma.user.findUnique({ 
      where: { email: data.email } 
    });
    if (existingUser) throw new Error("Email already exists");
    const existingEmployee = await prisma.teacherProfile.findUnique({
      where: { employeeId: data.employeeId }
    });
    if (existingEmployee) throw new Error("Employee ID already exists");
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: Role.TEACHER
        }
      });
      // ✅ Handle dateOfBirth - convert empty string to null
      let dateOfBirth = null;
      if (data.dateOfBirth && data.dateOfBirth.trim() !== '') {
        dateOfBirth = new Date(data.dateOfBirth);
        if (isNaN(dateOfBirth.getTime())) {
          throw new Error("Invalid date of birth");
        }
      }
      // ✅ Handle dateOfJoining
      const dateOfJoining = new Date(data.dateOfJoining);
      if (isNaN(dateOfJoining.getTime())) {
        throw new Error("Invalid date of joining");
      }
      const profile = await tx.teacherProfile.create({
        data: {
          userId: user.id,
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: dateOfBirth,  // Will be null if empty
          gender: data.gender,
          phoneNumber: data.phoneNumber || null,
          bloodGroup: data.bloodGroup || null,
          employeeId: data.employeeId,
          department: data.department,
          designation: data.designation,
          dateOfJoining: dateOfJoining,
          specialization: data.specialization || null,
          address: data.address || null,
          city: data.city || null,
          state: data.state || null,
          pincode: data.pincode || null,
          officeRoom: data.officeRoom || null,
        }
      });
      return { user, profile };
    });
    return {
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
      profile: result.profile
    };
  } catch (error: any) {
    console.error("Error creating teacher:", error.message);
    throw error;
  }
}

// Get All Students
export async function getAllStudents() {
  try {
    return await prisma.studentProfile.findMany({
      include: { user: { select: { email: true, createdAt: true } } },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error: any) {
    console.error("Error fetching students:", error.message);
    throw error;
  }
}

// Get All Teachers
export async function getAllTeachers() {
  try {
    return await prisma.teacherProfile.findMany({
      include: { user: { select: { email: true, createdAt: true } } },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error: any) {
    console.error("Error fetching teachers:", error.message);
    throw error;
  }
}

// Get Student by ID
export async function getStudentById(userId: string) {
  try {
    return await prisma.studentProfile.findUnique({
      where: { userId },
      include: { 
        user: { select: { email: true, role: true } },
        courseEnrollments: {
          include: {
            course: true
          }
        }
      }
    });
  } catch (error: any) {
    console.error("Error fetching student:", error.message);
    throw error;
  }
}

// Get Teacher by ID
export async function getTeacherById(userId: string) {
  try {
    return await prisma.teacherProfile.findUnique({
      where: { userId },
      include: { 
        user: { select: { email: true, role: true } },
        coursesTaught: true
      }
    });
  } catch (error: any) {
    console.error("Error fetching teacher:", error.message);
    throw error;
  }
}

// Delete Student
export async function deleteStudent(userId: string) {
  try {
    return await prisma.user.delete({
      where: { id: userId }
    });
  } catch (error: any) {
    console.error("Error deleting student:", error.message);
    throw new Error("Failed to delete student");
  }
}

// Delete Teacher
export async function deleteTeacher(userId: string) {
  try {
    return await prisma.user.delete({
      where: { id: userId }
    });
  } catch (error: any) {
    console.error("Error deleting teacher:", error.message);
    throw new Error("Failed to delete teacher");
  }
}



// ─────────────────────────────────────────
// Create Warden with Profile
// ─────────────────────────────────────────
export async function createWardenWithProfile(data: any) {
  try {
    const existingUser = await prisma.user.findUnique({ 
      where: { email: data.email } 
    });
    if (existingUser) throw new Error("Email already exists");
    const existingEmployee = await prisma.wardenProfile.findUnique({
      where: { employeeId: data.employeeId }
    });
    if (existingEmployee) throw new Error("Employee ID already exists");
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: Role.WARDEN
        }
      });
      const dateOfJoining = new Date(data.dateOfJoining);
      if (isNaN(dateOfJoining.getTime())) {
        throw new Error("Invalid date of joining");
      }
      const profile = await tx.wardenProfile.create({
        data: {
          userId: user.id,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          phoneNumber: data.phoneNumber,
          employeeId: data.employeeId,
          hostelAssigned: data.hostelAssigned,
          dateOfJoining: dateOfJoining,
          officeRoom: data.officeRoom || null,
          address: data.address || null,
          city: data.city || null,
          state: data.state || null,
        }
      });
      return { user, profile };
    });
    return {
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
      profile: result.profile
    };
  } catch (error: any) {
    console.error("Error creating warden:", error.message);
    throw error;
  }
}
// ─────────────────────────────────────────
// Get All Wardens
// ─────────────────────────────────────────
export async function getAllWardens() {
  try {
    return await prisma.wardenProfile.findMany({
      include: { user: { select: { email: true, createdAt: true } } },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error: any) {
    console.error("Error fetching wardens:", error.message);
    throw error;
  }
}
// ─────────────────────────────────────────
// Get Warden by ID
// ─────────────────────────────────────────
export async function getWardenById(userId: string) {
  try {
    return await prisma.wardenProfile.findUnique({
      where: { userId },
      include: { 
        user: { select: { email: true, role: true } }
      }
    });
  } catch (error: any) {
    console.error("Error fetching warden:", error.message);
    throw error;
  }
}
// ─────────────────────────────────────────
// Delete Warden
// ─────────────────────────────────────────
export async function deleteWarden(userId: string) {
  try {
    return await prisma.user.delete({
      where: { id: userId }
    });
  } catch (error: any) {
    console.error("Error deleting warden:", error.message);
    throw new Error("Failed to delete warden");
  }
}


// ─────────────────────────────────────────
// Create Parent Profile
// ─────────────────────────────────────────
export async function createParentWithProfile(data: any) {
  try {
    const existingUser = await prisma.user.findUnique({ 
      where: { email: data.email } 
    });
    if (existingUser) throw new Error("Email already exists");
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: Role.PARENT
        }
      });
      const profile = await tx.parentProfile.create({
        data: {
          userId: user.id,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          relationship: data.relationship,
          address: data.address || null,
          city: data.city || null,
          state: data.state || null,
          pincode: data.pincode || null,
        }
      });
      return { user, profile };
    });
    return {
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
      profile: result.profile
    };
  } catch (error: any) {
    console.error("Error creating parent:", error.message);
    throw error;
  }
}
// ─────────────────────────────────────────
// Get All Parents
// ─────────────────────────────────────────
export async function getAllParents() {
  try {
    return await prisma.parentProfile.findMany({
      include: { 
        user: { select: { email: true, createdAt: true } },
        studentLinks: {
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
                enrollmentNumber: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error: any) {
    console.error("Error fetching parents:", error.message);
    throw error;
  }
}
// ─────────────────────────────────────────
// Get Parent by ID
// ─────────────────────────────────────────
export async function getParentById(userId: string) {
  try {
    return await prisma.parentProfile.findUnique({
      where: { userId },
      include: { 
        user: { select: { email: true, role: true } },
        studentLinks: {
          include: {
            student: {
              include: {
                user: { select: { email: true } }
              }
            }
          }
        }
      }
    });
  } catch (error: any) {
    console.error("Error fetching parent:", error.message);
    throw error;
  }
}
// ─────────────────────────────────────────
// Delete Parent
// ─────────────────────────────────────────
export async function deleteParent(userId: string) {
  try {
    return await prisma.user.delete({
      where: { id: userId }
    });
  } catch (error: any) {
    console.error("Error deleting parent:", error.message);
    throw new Error("Failed to delete parent");
  }
}
// ─────────────────────────────────────────
// Link Parent to Student
// ─────────────────────────────────────────
export async function linkParentToStudent(data: {
  parentId: string;
  studentId: string;
  relationship: string;
  isPrimary?: boolean;
}) {
  try {
    const existingLink = await prisma.parentStudentLink.findUnique({
      where: {
        parentId_studentId: {
          parentId: data.parentId,
          studentId: data.studentId
        }
      }
    });
    if (existingLink) {
      throw new Error("Parent is already linked to this student");
    }
    const link = await prisma.parentStudentLink.create({
      data: {
        parentId: data.parentId,
        studentId: data.studentId,
        relationship: data.relationship,
        isPrimary: data.isPrimary || false
      },
      include: {
        parent: {
          include: { user: { select: { email: true } } }
        },
        student: {
          include: { user: { select: { email: true } } }
        }
      }
    });
    return link;
  } catch (error: any) {
    console.error("Error linking parent to student:", error.message);
    throw error;
  }
}
// ─────────────────────────────────────────
// Unlink Parent from Student
// ─────────────────────────────────────────
export async function unlinkParentFromStudent(parentId: string, studentId: string) {
  try {
    await prisma.parentStudentLink.delete({
      where: {
        parentId_studentId: {
          parentId,
          studentId
        }
      }
    });
  } catch (error: any) {
    console.error("Error unlinking parent:", error.message);
    throw new Error("Failed to unlink parent from student");
  }
}
// ─────────────────────────────────────────
// Get Student's Linked Parents
// ─────────────────────────────────────────
export async function getStudentParents(studentId: string) {
  try {
    return await prisma.parentStudentLink.findMany({
      where: { studentId },
      include: {
        parent: {
          include: {
            user: { select: { email: true } }
          }
        }
      }
    });
  } catch (error: any) {
    console.error("Error fetching student parents:", error.message);
    throw error;
  }
}

// ─────────────────────────────────────────
// Get Student by ProfileId (for notification-service)
// ─────────────────────────────────────────
export async function getStudentByProfileId(studentProfileId: string) {
  try {
    return await prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: { 
        user: { select: { id: true, email: true, role: true } }
      }
    });
  } catch (error: any) {
    console.error("Error fetching student by profile ID:", error.message);
    throw error;
  }
}
// ─────────────────────────────────────────
// Get All Warden User IDs (for notification-service)
// ─────────────────────────────────────────
export async function getAllWardenUserIds() {
  try {
    const wardens = await prisma.wardenProfile.findMany({
      select: { userId: true }
    });
    return wardens.map(w => w.userId);
  } catch (error: any) {
    console.error("Error fetching warden user IDs:", error.message);
    throw error;
  }
}
// ─────────────────────────────────────────
// Get Parents by StudentProfileId (for notification-service)
// ─────────────────────────────────────────
export async function getParentsByStudentProfileId(studentProfileId: string) {
  try {
    const links = await prisma.parentStudentLink.findMany({
      where: { studentId: studentProfileId },
      include: {
        parent: {
          include: {
            user: { select: { id: true, email: true } }
          }
        }
      }
    });
    return links.map(link => ({
      parentId: link.parent.id,
      userId: link.parent.userId,
      firstName: link.parent.firstName,
      lastName: link.parent.lastName,
      email: link.parent.user.email,
      phoneNumber: link.parent.phoneNumber,
      relationship: link.relationship,
      isPrimary: link.isPrimary
    }));
  } catch (error: any) {
    console.error("Error fetching parents by student profile ID:", error.message);
    throw error;
  }
}
