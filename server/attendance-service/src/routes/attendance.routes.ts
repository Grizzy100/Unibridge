
//server/attendance-service/src/routes/attendance.routes.ts
import { Router } from 'express';
import * as attendanceCtrl from '../controllers/attendance.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
const router = Router();
router.post(
  '/mark',
  authenticate,
  authorize('STUDENT'),
  attendanceCtrl.markAttendance
);
router.get(
  '/my',
  authenticate,
  authorize('STUDENT'),
  attendanceCtrl.getMyAttendance
);
router.get(
  '/stats',
  authenticate,
  authorize('STUDENT'),
  attendanceCtrl.getAttendanceStats
);
router.get(
  '/session/:sessionId',
  authenticate,
  authorize('TEACHER', 'ADMIN'),
  attendanceCtrl.getSessionAttendance
);
export default router;
