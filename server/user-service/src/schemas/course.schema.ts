
//server/user-service/src/schemas/course.schema.ts
import { z } from 'zod';
// Create new course (Admin creates and assigns teacher)
export const createCourseSchema = z.object({
  courseCode: z.string().min(2, 'Course code must be at least 2 characters').max(20),
  courseName: z.string().min(3, 'Course name must be at least 3 characters').max(200),
  teacherId: z.string().min(1, 'Teacher ID is required'),
  semester: z.number().int().min(1).max(8, 'Semester must be between 1 and 8'),
  credits: z.number().min(0).max(10).optional().default(3), 
  description: z.string().max(1000).optional(),
  department: z.string().max(100).optional(),
  school: z.enum(['BTECH', 'BBA', 'BCOM', 'BSC', 'BA', 'MTECH', 'MBA', 'MSC', 'MA'])
  .refine(val => val !== undefined, {
    message: 'Invalid school value',
  }),
});
// Update course (Admin can change any field including teacher)
export const updateCourseSchema = z.object({
  courseCode: z.string().min(2).max(20).optional(),
  courseName: z.string().min(3).max(200).optional(),
  teacherId: z.string().optional(),
  semester: z.number().int().min(1).max(8).optional(),
  credits: z.number().min(0).max(10).optional(),
  description: z.string().max(1000).optional(),
  department: z.string().max(100).optional(),
  school: z.enum(['BTECH', 'BBA', 'BCOM', 'BSC', 'BA', 'MTECH', 'MBA', 'MSC', 'MA']).optional(), // ✅ Added school field
});
// Assign/reassign teacher to course
export const assignTeacherSchema = z.object({
  teacherId: z.string().min(1, 'Teacher ID is required')
});
// Enroll students
export const enrollStudentSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  courseId: z.string().min(1, 'Course ID is required')
});
// Bulk enroll
export const bulkEnrollSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  studentIds: z.array(z.string()).min(1, 'At least one student ID is required')
});
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type AssignTeacherInput = z.infer<typeof assignTeacherSchema>;
export type EnrollStudentInput = z.infer<typeof enrollStudentSchema>;
export type BulkEnrollInput = z.infer<typeof bulkEnrollSchema>;
