
//server/user-service/src/routes/course.routes.ts
import { Router } from 'express';
import * as courseCtrl from '../controllers/course.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
const router = Router();
// ==================== ADMIN ONLY ROUTES ====================
// Course management
router.post(
  '/courses',
  authenticate,
  authorize('ADMIN'),
  courseCtrl.createCourse
);
router.put(
  '/courses/:id',
  authenticate,
  authorize('ADMIN'),
  courseCtrl.updateCourse
);
router.delete(
  '/courses/:id',
  authenticate,
  authorize('ADMIN'),
  courseCtrl.deleteCourse
);
// Teacher assignment (can also use PUT /courses/:id with teacherId)
router.patch(
  '/courses/:id/assign-teacher',
  authenticate,
  authorize('ADMIN'),
  courseCtrl.assignTeacher
);
// Get all teachers (for dropdown in admin UI)
router.get(
  '/teachers',
  authenticate,
  authorize('ADMIN'),
  courseCtrl.getAvailableTeachers
);
// Enrollment management
router.post(
  '/enrollments',
  authenticate,
  authorize('ADMIN'),
  courseCtrl.enrollStudent
);
router.post(
  '/enrollments/bulk',
  authenticate,
  authorize('ADMIN'),
  courseCtrl.bulkEnrollStudents
);
router.delete(
  '/enrollments/:studentId/:courseId',
  authenticate,
  authorize('ADMIN'),
  courseCtrl.unenrollStudent
);
// ==================== SHARED ROUTES ====================
// Get all courses (any authenticated user)
router.get(
  '/courses',
  authenticate,
  courseCtrl.getAllCourses
);
// Get single course
router.get(
  '/courses/:id',
  authenticate,
  courseCtrl.getCourseById
);
// Get courses for a teacher
router.get(
  '/teachers/:teacherId/courses',
  authenticate,
  courseCtrl.getTeacherCourses
);
// Get students in a course (Teacher and Admin)
router.get(
  '/courses/:courseId/students',
  authenticate,
  authorize('TEACHER', 'ADMIN'),
  courseCtrl.getCourseStudents
);
// Get courses for a student
router.get(
  '/students/:studentId/courses',
  authenticate,
  courseCtrl.getStudentCourses
);

// router.get(
//   '/courses/:courseId/enrollments',
//   courseCtrl.getCourseEnrollments
// );

router.get('/courses/:courseId/enrollments', authenticate, authorize('ADMIN','TEACHER'), courseCtrl.getCourseEnrollments);
export default router;
