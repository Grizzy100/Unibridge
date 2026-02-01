// server/attendance-service/src/routes/session.routes.ts
import { Router } from 'express';
import * as sessionCtrl from '../controllers/session.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = Router();

// PUBLIC: Get active sessions for courses (students check for live QR)
router.get(
  '/active-sessions',
  sessionCtrl.getActiveSessions
);

// TEACHER: Get my sessions
router.get(
  '/my',
  authenticate,
  authorize('TEACHER'),
  sessionCtrl.getTeacherSessions
);

// TEACHER: Get my currently active session for a course
router.get(
  '/my-active-session',
  authenticate,
  authorize('TEACHER'),
  sessionCtrl.getMyActiveSession
);

// ==========================================
// POST ROUTES
// ==========================================

// Start a new 1-hour session
router.post(
  '/start',
  authenticate,
  authorize('TEACHER'),
  sessionCtrl.startSession
);

// Create session (backwards compatibility)
router.post(
  '/',
  authenticate,
  authorize('TEACHER'),
  sessionCtrl.createSession
);

// ==========================================
// PATCH ROUTES (with specific paths first)
// ==========================================

// Refresh QR code within active session
router.patch(
  '/:id/qr/refresh',
  authenticate,
  authorize('TEACHER'),
  sessionCtrl.refreshQr
);

// Expire session
router.patch(
  '/:id/expire',
  authenticate,
  authorize('TEACHER'),
  sessionCtrl.expireSession
);

// ==========================================
// ✅ PARAMETERIZED GET ROUTES LAST
// ==========================================

// Get session stats (specific path before /:id)
router.get(
  '/:id/stats',
  authenticate,
  authorize('TEACHER', 'ADMIN'),
  sessionCtrl.getSessionStats
);

// Get session by ID (MUST BE LAST - catches any /:id)
router.get(
  '/:id',
  authenticate,
  sessionCtrl.getSessionById
);

export default router;





// import { Router } from 'express';
// import * as sessionCtrl from '../controllers/session.controller.js';
// import { authenticate } from '../middleware/auth.middleware.js';
// import { authorize } from '../middleware/role.middleware.js';
// const router = Router();
// router.post(
//   '/',
//   authenticate,
//   authorize('TEACHER'),
//   sessionCtrl.createSession
// );
// router.get(
//   '/my',
//   authenticate,
//   authorize('TEACHER'),
//   sessionCtrl.getTeacherSessions
// );
// router.get(
//   '/:id',
//   authenticate,
//   sessionCtrl.getSessionById
// );
// router.patch(
//   '/:id/expire',
//   authenticate,
//   authorize('TEACHER'),
//   sessionCtrl.expireSession
// );
// export default router;
