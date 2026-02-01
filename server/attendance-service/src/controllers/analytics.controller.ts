
//server/attendance-service/src/controllers/analytics.controller.ts
import { Request, Response } from 'express';
import * as analyticsService from '../services/analytics.service.js';
export async function getOverallStats(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const studentId = req.user.userId;
    const token = req.headers.authorization?.replace('Bearer ', '');
    const stats = await analyticsService.getOverallAttendanceStats(studentId, token);
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export async function getMonthlyTrends(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { courseId } = req.query;
    
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required' });
    }
    const studentId = req.user.userId;
    const token = req.headers.authorization?.replace('Bearer ', '');
    const trends = await analyticsService.getMonthlyAttendanceTrends(
      studentId,
      courseId as string,
      token
    );
    res.json({ success: true, data: trends });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export async function checkRisk(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const studentId = req.user.userId;
    const threshold = req.query.threshold ? parseFloat(req.query.threshold as string) : 75;
    const token = req.headers.authorization?.replace('Bearer ', '');
    const riskData = await analyticsService.checkAttendanceRisk(
      studentId,
      threshold,
      token
    );
    res.json({ success: true, data: riskData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export async function getOutpassImpact(req: Request, res: Response) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const studentId = req.user.userId;
    const { courseId } = req.query;
    const token = req.headers.authorization?.replace('Bearer ', '');
    const impact = await analyticsService.getOutpassImpact(
      studentId,
      courseId as string | undefined,
      token
    );
    res.json({ success: true, data: impact });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}



