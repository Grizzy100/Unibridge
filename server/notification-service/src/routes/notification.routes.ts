
//server/notification-service/src/routes/notification.routes.ts
import { Router } from 'express';
import * as notificationCtrl from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
const router = Router();

// All notification routes are accessible by any authenticated role (STUDENT, TEACHER, WARDEN, PARENT)
const allRoles = ['STUDENT', 'WARDEN', 'TEACHER', 'PARENT'] as const;

// Get user's notifications
router.get('/my',          authenticate, authorize(...allRoles), notificationCtrl.getMyNotifications);
// Get unread count
router.get('/unread-count', authenticate, authorize(...allRoles), notificationCtrl.getUnreadCount);
// Mark single notification as read
router.patch('/:id/read',  authenticate, authorize(...allRoles), notificationCtrl.markAsRead);
// Mark all as read
router.patch('/read-all',  authenticate, authorize(...allRoles), notificationCtrl.markAllAsRead);
// Delete notification
router.delete('/:id',      authenticate, authorize(...allRoles), notificationCtrl.deleteNotification);

export default router;
