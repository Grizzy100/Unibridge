
//server/attendance-service/src/controllers/attendance.controller.ts
import { Request, Response } from 'express';
import * as attendanceService from '../services/attendance.service.js';
import { markAttendanceSchema } from '../validators/attendance.validator.js';
export async function markAttendance(req: Request, res: Response) {
  try {
    const result = markAttendanceSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, errors: result.error.issues });
    }
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const studentId = req.user.userId;
    const token = req.headers.authorization?.replace('Bearer ', '');
    const attendance = await attendanceService.markStudentAttendance(
      studentId,
      result.data,
      token
    );
    res.json({ success: true, data: attendance });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function getMyAttendance(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const studentId = req.user.userId;
    const { courseId } = req.query;
    const token = req.headers.authorization?.replace('Bearer ', '');
    const attendance = await attendanceService.getStudentAttendance(
      studentId,
      courseId as string | undefined,
      token
    );
    res.json({ success: true, data: attendance });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getSessionAttendance(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    const attendance = await attendanceService.getAttendanceBySession(sessionId);
    
    res.json({ success: true, data: attendance });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export async function getAttendanceStats(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const studentId = req.user.userId;
    const { courseId } = req.query;
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required' });
    }
    const token = req.headers.authorization?.replace('Bearer ', '');
    const stats = await attendanceService.calculateAttendancePercentage(
      studentId,
      courseId as string,
      token
    );
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export async function getWardAttendance(req: Request, res: Response) {
  try {
    // Parent calls this with the ward's userId as a route param
    const { studentUserId } = req.params;
    const { courseId } = req.query;
    // Forward parent token - user-service /students/:userId only requires authenticate (no role guard)
    const token = req.headers.authorization?.replace('Bearer ', '');
    const attendance = await attendanceService.getStudentAttendance(
      studentUserId,
      courseId as string | undefined,
      token
    );
    res.json({ success: true, data: attendance });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getWardAttendanceStats(req: Request, res: Response) {
  try {
    const { studentUserId } = req.params;
    const { courseId } = req.query;
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required' });
    }
    const token = req.headers.authorization?.replace('Bearer ', '');
    const stats = await attendanceService.calculateAttendancePercentage(
      studentUserId,
      courseId as string,
      token
    );
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

