
//server/task-service/src/routes/submission.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import * as submissionCtrl from '../controllers/submission.controller.js';
import { upload } from '../middleware/upload.middleware.js';
const router = Router();

// Student submits task
router.post(
  '/:taskId',
  authenticate,
  authorize('STUDENT'),
  upload.single('answerFile'),
  submissionCtrl.submitTask
);


// TEACHER: get all submissions for a task
router.get(
  '/:taskId',
  authenticate,
  authorize('TEACHER'),
  submissionCtrl.getTaskSubmissions
);

// Teacher extends deadline for one student
router.patch(
  '/:taskId/student/:studentId/extend',
  authenticate,
  authorize('TEACHER'),
  submissionCtrl.extendSubmission
);

// Teacher allows student to resubmit
router.patch(
  '/:taskId/student/:studentId/allow-resubmit',
  authenticate,
  authorize('TEACHER'),
  submissionCtrl.allowResubmission
);


// Teacher grades submission
router.patch(
  '/:taskId/student/:studentId/grade',
  authenticate,
  authorize('TEACHER'),
  submissionCtrl.gradeSubmission
);


export default router;





