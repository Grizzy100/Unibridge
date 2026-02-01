
//server/notification-service/src/routes/notification.routes.ts
import { Router } from 'express';
import * as notificationCtrl from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
const router = Router();
// Get user's notifications
router.get(
  '/my',
  authenticate,
  authorize('STUDENT'),
  notificationCtrl.getMyNotifications
);
// Get unread count
router.get(
  '/unread-count',
  authenticate,
  authorize('STUDENT'),
  notificationCtrl.getUnreadCount
);
// Mark single notification as read
router.patch(
  '/:id/read',
  authenticate,
  authorize('STUDENT'),
  notificationCtrl.markAsRead
);
// Mark all as read
router.patch(
  '/read-all',
  authenticate,
  authorize('STUDENT'),
  notificationCtrl.markAllAsRead
);
// Delete notification
router.delete(
  '/:id',
  authenticate,
  authorize('STUDENT'),
  notificationCtrl.deleteNotification
);
export default router;
