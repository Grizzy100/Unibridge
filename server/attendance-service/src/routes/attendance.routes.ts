
//server/attendance-service/src/routes/attendance.routes.ts
import { Router } from 'express';
import * as attendanceCtrl from '../controllers/attendance.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
const router = Router();

// STUDENT routes
router.post('/mark',  authenticate, authorize('STUDENT'), attendanceCtrl.markAttendance);
router.get('/my',    authenticate, authorize('STUDENT'), attendanceCtrl.getMyAttendance);
router.get('/stats', authenticate, authorize('STUDENT'), attendanceCtrl.getAttendanceStats);

// TEACHER / ADMIN: get attendance for a session
router.get('/session/:sessionId', authenticate, authorize('TEACHER', 'ADMIN'), attendanceCtrl.getSessionAttendance);

// PARENT: view ward's attendance by ward's userId
router.get('/ward/:studentUserId',       authenticate, authorize('PARENT'), attendanceCtrl.getWardAttendance);
router.get('/ward/:studentUserId/stats', authenticate, authorize('PARENT'), attendanceCtrl.getWardAttendanceStats);

export default router;
