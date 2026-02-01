
//server\attendance-service\src\services\analytics.service.ts
import prisma from '../utils/prisma.js';
import { AttendanceRecord } from '@prisma/client';
import { getStudentProfileIdFromUserId } from './user.service.js';
import axios from 'axios';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
interface CourseAttendanceStats {
  courseId: string;
  totalClasses: number;
  attendedClasses: number;
  absentClasses: number;
  percentage: number;
}
interface OverallAttendanceStats {
  totalCourses: number;
  overallPercentage: number;
  totalClassesAcrossAllCourses: number;
  totalAttendedAcrossAllCourses: number;
  courseWiseStats: CourseAttendanceStats[];
}
interface MonthlyTrend {
  month: string;
  year: number;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
}
/**
 * Get overall attendance stats for a student across all enrolled courses
 */
export async function getOverallAttendanceStats(
  studentId: string,
  token?: string
): Promise<OverallAttendanceStats> {
  const studentProfileId = await getStudentProfileIdFromUserId(studentId, token);
  // Get all courses student is enrolled in via user-service
  const headers: any = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await axios.get(
    `${USER_SERVICE_URL}/api/students/${studentId}/courses`,
    { timeout: 5000, headers }
  );
  const enrolledCourses = response.data.data || [];
  
  if (enrolledCourses.length === 0) {
    return {
      totalCourses: 0,
      overallPercentage: 0,
      totalClassesAcrossAllCourses: 0,
      totalAttendedAcrossAllCourses: 0,
      courseWiseStats: []
    };
  }
  // Calculate stats for each course
  const courseWiseStats: CourseAttendanceStats[] = [];
  let totalClassesAcrossAll = 0;
  let totalAttendedAcrossAll = 0;
  for (const course of enrolledCourses) {
    const records = await prisma.attendanceRecord.findMany({
      where: {
        studentId: studentProfileId,
        session: { courseId: course.id }
      }
    });
    const total = records.length;
    const attended = records.filter((r: AttendanceRecord) => r.status === 'PRESENT').length;
    const absent = records.filter((r: AttendanceRecord) => r.status === 'ABSENT').length;
    const percentage = total > 0 ? (attended / total) * 100 : 0;
    courseWiseStats.push({
      courseId: course.id,
      totalClasses: total,
      attendedClasses: attended,
      absentClasses: absent,
      percentage: parseFloat(percentage.toFixed(2))
    });
    totalClassesAcrossAll += total;
    totalAttendedAcrossAll += attended;
  }
  const overallPercentage = totalClassesAcrossAll > 0 
    ? (totalAttendedAcrossAll / totalClassesAcrossAll) * 100 
    : 0;
  return {
    totalCourses: enrolledCourses.length,
    overallPercentage: parseFloat(overallPercentage.toFixed(2)),
    totalClassesAcrossAllCourses: totalClassesAcrossAll,
    totalAttendedAcrossAllCourses: totalAttendedAcrossAll,
    courseWiseStats
  };
}
/**
 * Get monthly attendance trends for a student in a specific course
 */
export async function getMonthlyAttendanceTrends(
  studentId: string,
  courseId: string,
  token?: string
): Promise<MonthlyTrend[]> {
  const studentProfileId = await getStudentProfileIdFromUserId(studentId, token);
  const records = await prisma.attendanceRecord.findMany({
    where: {
      studentId: studentProfileId,
      session: { courseId }
    },
    include: {
      session: {
        select: { sessionDate: true }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
  // Group by month
  const monthlyData: Map<string, { total: number; attended: number }> = new Map();
  records.forEach((record: any) => {
    const date = new Date(record.session.sessionDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, { total: 0, attended: 0 });
    }
    
    const data = monthlyData.get(monthKey)!;
    data.total += 1;
    if (record.status === 'PRESENT') {
      data.attended += 1;
    }
  });
  // Convert to array and format
  const trends: MonthlyTrend[] = [];
  monthlyData.forEach((data, monthKey) => {
    const [year, month] = monthKey.split('-');
    const percentage = data.total > 0 ? (data.attended / data.total) * 100 : 0;
    
    trends.push({
      month: new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' }),
      year: parseInt(year),
      totalClasses: data.total,
      attendedClasses: data.attended,
      percentage: parseFloat(percentage.toFixed(2))
    });
  });
  return trends;
}
/**
 * Check if student is at risk (below threshold)
 */
export async function checkAttendanceRisk(
  studentId: string,
  threshold: number = 75,
  token?: string
): Promise<{
  isAtRisk: boolean;
  overallPercentage: number;
  threshold: number;
  atRiskCourses: Array<{ courseId: string; percentage: number }>;
}> {
  const stats = await getOverallAttendanceStats(studentId, token);
  
  const atRiskCourses = stats.courseWiseStats
    .filter(course => course.percentage < threshold)
    .map(course => ({
      courseId: course.courseId,
      percentage: course.percentage
    }));
  return {
    isAtRisk: stats.overallPercentage < threshold || atRiskCourses.length > 0,
    overallPercentage: stats.overallPercentage,
    threshold,
    atRiskCourses
  };
}
/**
 * Get outpass impact on attendance
 */
export async function getOutpassImpact(
  studentId: string,
  courseId?: string,
  token?: string
): Promise<{
  totalAbsences: number;
  absencesWithOutpass: number;
  absencesWithoutOutpass: number;
  outpassPercentage: number;
}> {
  const studentProfileId = await getStudentProfileIdFromUserId(studentId, token);
  const where: any = { 
    studentId: studentProfileId,
    status: 'ABSENT'
  };
  if (courseId) {
    where.session = { courseId };
  }
  const absentRecords = await prisma.attendanceRecord.findMany({ where });
  const totalAbsences = absentRecords.length;
  const absencesWithOutpass = absentRecords.filter(
    (r: AttendanceRecord) => r.hasApprovedOutpass
  ).length;
  const absencesWithoutOutpass = totalAbsences - absencesWithOutpass;
  const outpassPercentage = totalAbsences > 0 
    ? (absencesWithOutpass / totalAbsences) * 100 
    : 0;
  return {
    totalAbsences,
    absencesWithOutpass,
    absencesWithoutOutpass,
    outpassPercentage: parseFloat(outpassPercentage.toFixed(2))
  };
}
