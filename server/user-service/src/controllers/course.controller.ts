
//server/user-service/src/controllers/course.controller.ts
import { Request, Response } from 'express';
import * as courseService from '../services/course.service.js';
import {
  createCourseSchema,
  updateCourseSchema,
  assignTeacherSchema,
  enrollStudentSchema,
  bulkEnrollSchema
} from '../schemas/course.schema.js';
/**
 * ADMIN: Create a new course
 */
export async function createCourse(req: Request, res: Response) {
  try {
    const result = createCourseSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        errors: result.error.issues 
      });
    }
    
    const course = await courseService.createCourse(result.data);
    res.status(201).json({ 
      success: true, 
      message: 'Course created and teacher assigned successfully',
      data: course 
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
/**
 * Get all courses (with optional filters)
 */
export async function getAllCourses(req: Request, res: Response) {
  try {
    const { semester, teacherId, department } = req.query;
    
    const filters: any = {};
    if (semester) filters.semester = parseInt(semester as string);
    if (teacherId) filters.teacherId = teacherId as string;
    if (department) filters.department = department as string;
    
    const courses = await courseService.getAllCourses(filters);
    res.json({ success: true, data: courses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
/**
 * Get single course by ID
 */
export async function getCourseById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const course = await courseService.getCourseById(id);
    res.json({ success: true, data: course });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
}
/**
 * ADMIN: Update course (including teacher change)
 */
export async function updateCourse(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = updateCourseSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        errors: result.error.issues 
      });
    }
    
    const course = await courseService.updateCourse(id, result.data);
    res.json({ 
      success: true, 
      message: 'Course updated successfully',
      data: course 
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
/**
 * ADMIN: Assign or change teacher for a course
 */
export async function assignTeacher(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = assignTeacherSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        errors: result.error.issues 
      });
    }
    
    const course = await courseService.assignTeacherToCourse(id, result.data.teacherId);
    res.json({ 
      success: true, 
      message: 'Teacher assigned successfully',
      data: course 
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
/**
 * ADMIN: Delete course
 */
export async function deleteCourse(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await courseService.deleteCourse(id);
    res.json({ success: true, message: result.message });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
/**
 * Get available teachers (for admin dropdown)
 */
export async function getAvailableTeachers(req: Request, res: Response) {
  try {
    const teachers = await courseService.getAvailableTeachers();
    res.json({ success: true, data: teachers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
/**
 * Get courses for a teacher
 */
export async function getTeacherCourses(req: Request, res: Response) {
  try {
    const { teacherId } = req.params;
    const courses = await courseService.getTeacherCourses(teacherId);
    res.json({ success: true, data: courses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
/**
 * Get students in a course
 */
export async function getCourseStudents(req: Request, res: Response) {
  try {
    const { courseId } = req.params;
    const students = await courseService.getCourseStudents(courseId);
    res.json({ success: true, data: students });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
/**
 * ADMIN: Enroll a student
 */
export async function enrollStudent(req: Request, res: Response) {
  try {
    const result = enrollStudentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        errors: result.error.issues 
      });
    }
    
    const enrollment = await courseService.enrollStudent(
      result.data.studentId,
      result.data.courseId
    );
    res.status(201).json({ 
      success: true, 
      message: 'Student enrolled successfully',
      data: enrollment 
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
/**
 * ADMIN: Bulk enroll students
 */
export async function bulkEnrollStudents(req: Request, res: Response) {
  try {
    const result = bulkEnrollSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        errors: result.error.issues 
      });
    }
    
    const enrollmentResult = await courseService.bulkEnrollStudents(
      result.data.courseId,
      result.data.studentIds
    );
    res.status(201).json({ 
      success: true, 
      message: `Enrolled ${enrollmentResult.enrolled} students successfully`,
      data: enrollmentResult 
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
/**
 * ADMIN: Unenroll a student
 */
export async function unenrollStudent(req: Request, res: Response) {
  try {
    const { studentId, courseId } = req.params;
    const result = await courseService.unenrollStudent(studentId, courseId);
    res.json({ success: true, message: result.message });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
/**
 * Get courses for a student
 */
export async function getStudentCourses(req: Request, res: Response) {
  try {
    const { studentId } = req.params;
    const courses = await courseService.getStudentCourses(studentId);
    res.json({ success: true, data: courses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getCourseEnrollments(req: Request, res: Response) {
  try {
    const { courseId } = req.params;
    const enrollments = await courseService.getCourseEnrollments(courseId);
    res.json({ success: true, data: enrollments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
