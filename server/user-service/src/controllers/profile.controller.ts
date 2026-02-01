
//server/user-service/src/controllers/profile.controller.ts
import { Request, Response } from "express";
import * as profileService from "../services/profile.service.js";
import { studentProfileSchema } from "../schemas/studentProfile.schema.js";
import { teacherProfileSchema } from "../schemas/teacherProfile.schema.js";
import { wardenProfileSchema } from "../schemas/wardenProfile.schema.js";
import { parentProfileSchema, linkParentStudentSchema } from "../schemas/parentProfile.schema.js"
// Create Student with Profile
export async function createStudentProfile(req: Request, res: Response) {
  try {
    const result = studentProfileSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map((e: any) => ({  // ✅ Changed to .issues
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }
    const student = await profileService.createStudentWithProfile(result.data);
    
    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create student"
    });
  }
}
// Create Teacher with Profile
export async function createTeacherProfile(req: Request, res: Response) {
  try {
    const result = teacherProfileSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map((e: any) => ({  // ✅ Changed to .issues
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }
    const teacher = await profileService.createTeacherWithProfile(result.data);
    
    return res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: teacher
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create teacher"
    });
  }
}
// Get All Students
export async function getAllStudents(req: Request, res: Response) {
  try {
    const students = await profileService.getAllStudents();
    return res.json({
      success: true,
      data: students,
      count: students.length
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch students"
    });
  }
}
// Get All Teachers
export async function getAllTeachers(req: Request, res: Response) {
  try {
    const teachers = await profileService.getAllTeachers();
    return res.json({
      success: true,
      data: teachers,
      count: teachers.length
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch teachers"
    });
  }
}
// Get Student by ID
export async function getStudentById(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const student = await profileService.getStudentById(userId);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }
    
    return res.json({
      success: true,
      data: student
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
// Get Teacher by ID
export async function getTeacherById(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const teacher = await profileService.getTeacherById(userId);
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }
    
    return res.json({
      success: true,
      data: teacher
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}



// Delete Student
export async function deleteStudent(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    await profileService.deleteStudent(userId);
    
    return res.json({
      success: true,
      message: "Student deleted successfully"
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete student"
    });
  }
}



//DELETE Teacher
export async function deleteTeacher(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    await profileService.deleteTeacher(userId);
    
    return res.json({
      success: true,
      message: "Teacher deleted successfully"
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete teacher"
    });
  }
}


// Create Warden with Profile
export async function createWardenProfile(req: Request, res: Response) {
  try {
    const result = wardenProfileSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }
    const warden = await profileService.createWardenWithProfile(result.data);
    
    return res.status(201).json({
      success: true,
      message: "Warden created successfully",
      data: warden
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create warden"
    });
  }
}
// Get All Wardens
export async function getAllWardens(req: Request, res: Response) {
  try {
    const wardens = await profileService.getAllWardens();
    return res.json({
      success: true,
      data: wardens,
      count: wardens.length
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch wardens"
    });
  }
}
// Get Warden by ID
export async function getWardenById(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const warden = await profileService.getWardenById(userId);
    
    if (!warden) {
      return res.status(404).json({
        success: false,
        message: "Warden not found"
      });
    }
    
    return res.json({
      success: true,
      data: warden
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
// Delete Warden
export async function deleteWarden(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    await profileService.deleteWarden(userId);
    
    return res.json({
      success: true,
      message: "Warden deleted successfully"
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete warden"
    });
  }
}


// Create Parent Profile
export async function createParentProfile(req: Request, res: Response) {
  try {
    const result = parentProfileSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }
    const parent = await profileService.createParentWithProfile(result.data);
    
    return res.status(201).json({
      success: true,
      message: "Parent created successfully",
      data: parent
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create parent"
    });
  }
}
// Get All Parents
export async function getAllParents(req: Request, res: Response) {
  try {
    const parents = await profileService.getAllParents();
    return res.json({
      success: true,
      data: parents,
      count: parents.length
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch parents"
    });
  }
}
// Get Parent by ID
export async function getParentById(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const parent = await profileService.getParentById(userId);
    
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found"
      });
    }
    
    return res.json({
      success: true,
      data: parent
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
// Delete Parent
export async function deleteParent(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    await profileService.deleteParent(userId);
    
    return res.json({
      success: true,
      message: "Parent deleted successfully"
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete parent"
    });
  }
}
// Link Parent to Student
export async function linkParentToStudent(req: Request, res: Response) {
  try {
    const result = linkParentStudentSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }
    const link = await profileService.linkParentToStudent(result.data);
    
    return res.status(201).json({
      success: true,
      message: "Parent linked to student successfully",
      data: link
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to link parent"
    });
  }
}
// Unlink Parent from Student
export async function unlinkParentFromStudent(req: Request, res: Response) {
  try {
    const { parentId, studentId } = req.params;
    await profileService.unlinkParentFromStudent(parentId, studentId);
    
    return res.json({
      success: true,
      message: "Parent unlinked successfully"
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to unlink parent"
    });
  }
}
// Get Student's Parents
export async function getStudentParents(req: Request, res: Response) {
  try {
    const { studentId } = req.params;
    const parents = await profileService.getStudentParents(studentId);
    
    return res.json({
      success: true,
      data: parents
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Get Student by Profile ID (for notification-service)
export async function getStudentByProfileId(req: Request, res: Response) {
  try {
    const { studentId } = req.params;
    const student = await profileService.getStudentByProfileId(studentId);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }
    
    return res.json({
      success: true,
      data: student
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
// Get All Warden User IDs (for notification-service)
export async function getWardenUserIds(req: Request, res: Response) {
  try {
    const userIds = await profileService.getAllWardenUserIds();
    return res.json({
      success: true,
      data: userIds
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch warden user IDs"
    });
  }
}
// Get Parents by StudentProfileId (for notification-service)
export async function getParentsByStudentProfileId(req: Request, res: Response) {
  try {
    const { studentId } = req.params;
    const parents = await profileService.getParentsByStudentProfileId(studentId);
    
    return res.json({
      success: true,
      data: parents
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
