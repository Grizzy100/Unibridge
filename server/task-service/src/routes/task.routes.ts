
//server/task-service/src/routes/task.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import * as taskCtrl from '../controllers/task.controller.js';
import { upload } from '../middleware/upload.middleware.js';
const router = Router();

// TEACHER: create task (no file)
router.post('/', authenticate, authorize('TEACHER'), taskCtrl.createTask);

// TEACHER: create task with question file
router.post(
  '/with-file',
  authenticate,
  authorize('TEACHER'),
  upload.single('questionFile'),
  taskCtrl.createTaskWithFile
);

// TEACHER: extend due date for all
router.patch('/:id/extend', authenticate, authorize('TEACHER'), taskCtrl.extendTask);

router.get('/my', authenticate, authorize('STUDENT'), taskCtrl.getMyTasks);

// COURSE + MY TASKS
router.get('/course/:courseId', authenticate, taskCtrl.getCourseTasks);


// Get single task
router.get('/:taskId', authenticate, taskCtrl.getTaskById);
export default router;
