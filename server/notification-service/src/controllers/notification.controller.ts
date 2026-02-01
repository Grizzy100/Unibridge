
// //server/notification-service/src/controllers/notification.controller.ts
// import { Request, Response } from 'express';
// import * as notificationService from '../services/notification.service.js';
// export async function getMyNotifications(req: Request, res: Response) {
//   try {
//     if (!req.user || !req.user.userId) {
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }
//     const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
//     const notifications = await notificationService.getUserNotifications(req.user.userId, limit);
//     res.json({ success: true, data: notifications });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// }
// export async function getUnreadCount(req: Request, res: Response) {
//   try {
//     if (!req.user || !req.user.userId) {
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }
//     const count = await notificationService.getUnreadCount(req.user.userId);
//     res.json({ success: true, data: { count } });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// }
// export async function markAsRead(req: Request, res: Response) {
//   try {
//     if (!req.user || !req.user.userId) {
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }
//     const { id } = req.params;
//     await notificationService.markAsRead(id, req.user.userId);
//     res.json({ success: true, message: 'Notification marked as read' });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// }
// export async function markAllAsRead(req: Request, res: Response) {
//   try {
//     if (!req.user || !req.user.userId) {
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }
//     await notificationService.markAllAsRead(req.user.userId);
//     res.json({ success: true, message: 'All notifications marked as read' });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// }
// export async function deleteNotification(req: Request, res: Response) {
//   try {
//     if (!req.user || !req.user.userId) {
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }
//     const { id } = req.params;
//     await notificationService.deleteNotification(id, req.user.userId);
//     res.json({ success: true, message: 'Notification deleted' });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// }


//server\notification-service\src\controllers\notification.controller.ts
import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service.js';

export async function getMyNotifications(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const limitParam = req.query.limit;
    let limit = 50;

    if (limitParam) {
      if (typeof limitParam === 'string') {
        limit = parseInt(limitParam, 10);
      } else if (Array.isArray(limitParam) && typeof limitParam[0] === 'string') {
        limit = parseInt(limitParam[0], 10);
      }
    }

    const notifications = await notificationService.getUserNotifications(req.user.userId, limit);
    res.json({ success: true, data: notifications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getUnreadCount(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const count = await notificationService.getUnreadCount(req.user.userId);
    res.json({ success: true, data: { count } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function markAsRead(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    await notificationService.markAsRead(id, req.user.userId);
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function markAllAsRead(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    await notificationService.markAllAsRead(req.user.userId);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteNotification(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    await notificationService.deleteNotification(id, req.user.userId);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

