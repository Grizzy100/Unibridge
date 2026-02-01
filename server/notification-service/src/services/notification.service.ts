
//server/notification-service/src/services/notification.service.ts
import prisma from '../utils/prisma.js';
import { NotificationType } from '../generated/prisma/client.js';
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  data?: any
) {
  return await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      data: data || {}
    }
  });
}
export async function getUserNotifications(
  userId: string,
  limit: number = 50
) {
  return await prisma.notification.findMany({
    where: {
      userId,
      status: { not: 'DELETED' }
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
}
export async function getUnreadCount(userId: string) {
  return await prisma.notification.count({
    where: {
      userId,
      status: 'UNREAD'
    }
  });
}
export async function markAsRead(notificationId: string, userId: string) {
  return await prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId
    },
    data: {
      status: 'READ',
      readAt: new Date()
    }
  });
}
export async function markAllAsRead(userId: string) {
  return await prisma.notification.updateMany({
    where: {
      userId,
      status: 'UNREAD'
    },
    data: {
      status: 'READ',
      readAt: new Date()
    }
  });
}
export async function deleteNotification(notificationId: string, userId: string) {
  return await prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId
    },
    data: {
      status: 'DELETED'
    }
  });
}
