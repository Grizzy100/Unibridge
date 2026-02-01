
// //server/attendance-service/src/controllers/session.controller.ts
// import { Request, Response } from 'express';
// import * as sessionService from '../services/session.service.js';
// import { createSessionSchema } from '../validators/session.validator.js';
// export async function createSession(req: Request, res: Response) {
//   try {
//     const result = createSessionSchema.safeParse(req.body);
//     if (!result.success) {
//       return res.status(400).json({ success: false, errors: result.error.issues });
//     }
//     if (!req.user || !req.user.userId) {
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }
//     const teacherId = req.user.userId;
//     const token = req.headers.authorization?.replace('Bearer ', '');
//     const session = await sessionService.createAttendanceSession(teacherId, result.data, token);
//     res.status(201).json({ success: true, data: session });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// }

// export async function getTeacherSessions(req: Request, res: Response) {
//   try {
//     if (!req.user || !req.user.userId) {
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }
    
//     const teacherId = req.user.userId;
//     const sessions = await sessionService.getTeacherSessions(teacherId);
    
//     res.json({ success: true, data: sessions });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// }
// export async function getSessionById(req: Request, res: Response) {
//   try {
//     const { id } = req.params;
//     const session = await sessionService.getSessionDetails(id);
    
//     res.json({ success: true, data: session });
//   } catch (error: any) {
//     res.status(404).json({ success: false, message: error.message });
//   }
// }
// export async function expireSession(req: Request, res: Response) {
//   try {
//     if (!req.user || !req.user.userId) {
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }
    
//     const { id } = req.params;
//     const teacherId = req.user.userId;
//     const session = await sessionService.expireSession(id, teacherId);
    
//     res.json({ success: true, data: session });
//   } catch (error: any) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// }





// server/attendance-service/src/controllers/session.controller.ts
import { Request, Response } from 'express';
import * as sessionService from '../services/session.service.js';
import { 
  createSessionSchema,
  startSessionSchema,    // ✅ NEW
  refreshQrSchema        // ✅ NEW
} from '../validators/session.validator.js';
import prisma from '../utils/prisma.js';

// ✅ NEW: START SESSION - Begin a 1-hour class
export async function startSession(req: Request, res: Response) {
  try {
    const result = startSessionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        errors: result.error.issues 
      });
    }

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    const teacherId = req.user.userId;
    const token = req.headers.authorization?.replace('Bearer ', '');

    const session = await sessionService.startSession(teacherId, result.data, token);

    res.status(201).json({ 
      success: true, 
      data: session,
      message: `Session started successfully. Valid until ${session.sessionEndTime.toLocaleTimeString()}.`
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}

// ✅ NEW: REFRESH QR - Rotate QR code within active session
export async function refreshQr(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = refreshQrSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        errors: result.error.issues 
      });
    }

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    const teacherId = req.user.userId;
    const token = req.headers.authorization?.replace('Bearer ', '');

    const session = await sessionService.refreshSessionQr(
      id,
      teacherId,
      result.data.qrValiditySeconds,
      token
    );

    res.json({ 
      success: true, 
      data: session,
      message: `QR code refreshed. Valid for ${result.data.qrValiditySeconds} seconds.`
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 
                       error.message.includes('Unauthorized') ? 403 : 400;
    res.status(statusCode).json({ 
      success: false, 
      message: error.message 
    });
  }
}

// EXISTING - KEEP AS IS
export async function createSession(req: Request, res: Response) {
  try {
    const result = createSessionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, errors: result.error.issues });
    }
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const teacherId = req.user.userId;
    const token = req.headers.authorization?.replace('Bearer ', '');
    const session = await sessionService.createAttendanceSession(teacherId, result.data, token);
    res.status(201).json({ success: true, data: session });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getTeacherSessions(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const teacherId = req.user.userId;
    const sessions = await sessionService.getTeacherSessions(teacherId);
    res.json({ success: true, data: sessions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getSessionById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const session = await sessionService.getSessionDetails(id);
    res.json({ success: true, data: session });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
}

export async function expireSession(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { id } = req.params;
    const teacherId = req.user.userId;
    const session = await sessionService.expireSession(id, teacherId);
    res.json({ success: true, data: session });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}


//--------------------------------------------------
export async function getActiveSessions(req: Request, res: Response) {
  try {
    const { courseIds } = req.query;
    
    if (!courseIds) {
      return res.status(400).json({ 
        success: false, 
        message: 'courseIds query parameter required' 
      });
    }

    const courseIdArray = (courseIds as string).split(',');
    const now = new Date();

    const activeSessions = await prisma.attendanceSession.findMany({
      where: {
        courseId: { in: courseIdArray },
        status: 'ACTIVE',
        sessionStartTime: { lte: now },
        sessionEndTime: { gte: now },
        qrExpiresAt: { gte: now },
      },
      select: {
        id: true,
        courseId: true,
        qrCode: true,
        qrExpiresAt: true,
        sessionEndTime: true,
        sessionStartTime: true,
        location: true,
      },
    });

    console.log(`[getActiveSessions] Found ${activeSessions.length} active sessions for ${courseIdArray.length} courses`);

    res.json({ success: true, data: activeSessions });
  } catch (error: any) {
    console.error('[getActiveSessions] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Get teacher's currently active session for a specific course
 */
export async function getMyActiveSession(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const teacherId = req.user.userId;
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ 
        success: false, 
        message: 'courseId query parameter required' 
      });
    }

    const now = new Date();

    const activeSession = await prisma.attendanceSession.findFirst({
      where: {
        teacherId,
        courseId: courseId as string,
        status: 'ACTIVE',
        sessionStartTime: { lte: now },
        sessionEndTime: { gte: now },
      },
      include: {
        _count: {
          select: {
            attendanceRecords: {
              where: { status: 'PRESENT' }
            }
          }
        }
      }
    });

    res.json({ 
      success: true, 
      data: activeSession,
      hasActiveSession: !!activeSession
    });
  } catch (error: any) {
    console.error('[getMyActiveSession] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Get real-time attendance statistics for a session
 */
export async function getSessionStats(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const stats = await prisma.attendanceRecord.groupBy({
      by: ['status'],
      where: { sessionId: id },
      _count: true,
    });

    const total = await prisma.attendanceRecord.count({
      where: { sessionId: id }
    });

    const present = stats.find(s => s.status === 'PRESENT')?._count || 0;
    const absent = stats.find(s => s.status === 'ABSENT')?._count || 0;

    res.json({
      success: true,
      data: {
        total,
        present,
        absent,
        percentage: total > 0 ? ((present / total) * 100).toFixed(2) : 0
      }
    });
  } catch (error: any) {
    console.error('[getSessionStats] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}
