
//server\attendance-service\src\routes\analytics.routes.ts
import { Router } from 'express';
import * as analyticsCtrl from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
const router = Router();
// Get overall attendance stats across all courses
router.get(
  '/overall',
  authenticate,
  authorize('STUDENT'),
  analyticsCtrl.getOverallStats
);
// Get monthly attendance trends for a course
router.get(
  '/trends',
  authenticate,
  authorize('STUDENT'),
  analyticsCtrl.getMonthlyTrends
);
// Check if student is at risk
router.get(
  '/risk',
  authenticate,
  authorize('STUDENT'),
  analyticsCtrl.checkRisk
);
// Get outpass impact on attendance
router.get(
  '/outpass-impact',
  authenticate,
  authorize('STUDENT'),
  analyticsCtrl.getOutpassImpact
);
export default router;
