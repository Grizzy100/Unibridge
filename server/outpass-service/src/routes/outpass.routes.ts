
//server/outpass-service/src/routes/outpass.routes.ts
import { Router } from 'express';
import * as outpassCtrl from '../controllers/outpass.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
const router = Router();
// Student routes
router.post(
  '/',
  authenticate,
  authorize('STUDENT'),
  upload.single('proof'),
  outpassCtrl.createOutpass
);
router.get(
  '/my',
  authenticate,
  authorize('STUDENT'),
  outpassCtrl.getMyOutpasses
);
router.patch(
  '/:id/cancel',
  authenticate,
  authorize('STUDENT'),
  outpassCtrl.cancelOutpass
);
// Parent routes
router.get(
  '/parent',
  authenticate,
  authorize('PARENT'),
  outpassCtrl.getPendingForParent
);
router.patch(
  '/:id/parent-approval',
  authenticate,
  authorize('PARENT'),
  outpassCtrl.handleParentApproval
);
// Parent routes
router.get(
  '/parent-history',
  authenticate,
  authorize('PARENT'),
  outpassCtrl.getParentOutpassHistory // make sure this controller exists and is imported
);

// Warden routes
router.get(
  '/warden',
  authenticate,
  authorize('WARDEN'),
  outpassCtrl.getWardenOutpasses
);

router.patch(
  '/:id/warden-approval',
  authenticate,
  authorize('WARDEN'),
  outpassCtrl.handleWardenApproval
);

// ✅✅✅ ADD THESE 5 NEW ROUTES BELOW ✅✅✅

// Search students by name/email
router.get(
  '/warden/search-students',
  authenticate,
  authorize('WARDEN'),
  outpassCtrl.searchStudentsController
);

// Get specific student's outpass history
router.get(
  '/warden/history/:studentId',
  authenticate,
  authorize('WARDEN'),
  outpassCtrl.getStudentHistory
);

// Delete outpass (regular)
router.delete(
  '/warden/delete/:id',
  authenticate,
  authorize('WARDEN'),
  outpassCtrl.wardenDeleteOutpass
);

// Force delete active/running outpass
router.delete(
  '/warden/force-delete/:id',
  authenticate,
  authorize('WARDEN'),
  outpassCtrl.forceDeleteActiveOutpass
);

// Admin routes
router.get(
  '/all',
  authenticate,
  authorize('ADMIN'),
  outpassCtrl.getAllOutpasses
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN','WARDEN'),
  outpassCtrl.deleteOutpass
);

// Attendance-service: Check active outpass for a student on a date
router.get(
  '/check-active/:studentId',
  outpassCtrl.checkActiveOutpass // implement this controller next
);



//-------------------------------------------------------------------------------


export default router;
