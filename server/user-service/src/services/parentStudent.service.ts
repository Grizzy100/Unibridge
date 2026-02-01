
//server/user-service/src/services/parentStudent.service.ts
import prisma from '../utils/prisma.js';
// Link parent to student
export async function linkParentToStudent(data: {
  parentId: string;
  studentId: string;
  relationship: string;
  isPrimary?: boolean;
}) {
  try {
    const existing = await prisma.parentStudentLink.findUnique({
      where: {
        parentId_studentId: {
          parentId: data.parentId,
          studentId: data.studentId
        }
      }
    });
    if (existing) {
      throw new Error("Parent is already linked to this student");
    }
    return await prisma.parentStudentLink.create({
      data: {
        parentId: data.parentId,
        studentId: data.studentId,
        relationship: data.relationship,
        isPrimary: data.isPrimary || false
      }
    });
  } catch (error: any) {
    console.error("Error linking parent to student:", error.message);
    throw error;
  }
}
// Get parent's children
export async function getParentChildren(parentId: string) {
  try {
    return await prisma.parentStudentLink.findMany({
      where: { parentId },
      include: {
        student: {
          include: {
            user: {
              select: { email: true }
            }
          }
        }
      }
    });
  } catch (error: any) {
    console.error("Error fetching parent's children:", error.message);
    throw error;
  }
}
// Get student's parents
export async function getStudentParents(studentId: string) {
  try {
    return await prisma.parentStudentLink.findMany({
      where: { studentId },
      include: {
        parent: {
          include: {
            user: {
              select: { email: true }
            }
          }
        }
      }
    });
  } catch (error: any) {
    console.error("Error fetching student's parents:", error.message);
    throw error;
  }
}
