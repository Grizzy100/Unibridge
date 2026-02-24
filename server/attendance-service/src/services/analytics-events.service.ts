
//server/attendance-service/src/services/analytics-events.service.ts
import { publishEvent } from '../utils/rabbitmq.js';
import { getOverallAttendanceStats } from './analytics.service.js';
import { calculateAttendancePercentage } from './attendance.service.js';
import axios from 'axios';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
interface ParentInfo {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  relationship: string;
}
interface CourseDetails {
  id: string;
  courseName: string;
  courseCode: string;
}
/**
 * Fetch course details from user-service using the request token.
 * Returns null on any error so callers can gracefully fall back.
 */
async function getCourseDetails(courseId: string, token?: string): Promise<CourseDetails | null> {
  try {
    const headers: any = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await axios.get(
      `${USER_SERVICE_URL}/api/courses/${courseId}`,
      { timeout: 5000, headers }
    );
    return response.data?.data ?? null;
  } catch (error: any) {
    console.error('Error fetching course details:', error.message);
    return null;
  }
}
/**
 * Fetch parent details for a student from user-service
 */
async function getStudentParents(studentId: string, token?: string): Promise<ParentInfo[]> {
  try {
    const headers: any = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await axios.get(
      `${USER_SERVICE_URL}/api/profiles/students/${studentId}/parents`,
      { timeout: 5000, headers }
    );
    const links = response.data.data || [];

    // Map to parent info with email from User model
    return links.map((link: any) => ({
      userId: link.parent.userId,
      email: link.parent.user.email,
      firstName: link.parent.firstName,
      lastName: link.parent.lastName,
      relationship: link.relationship
    }));
  } catch (error: any) {
    console.error('Error fetching student parents:', error.message);
    return [];
  }
}
/**
 * Check if student attendance is below threshold and publish alert
 */
export async function checkAndPublishLowAttendanceAlert(
  studentId: string,
  courseId: string,
  token?: string
): Promise<void> {
  try {
    const stats = await calculateAttendancePercentage(studentId, courseId, token);
    const LOW_THRESHOLD = 60;
    if (stats.percentage < LOW_THRESHOLD) {
      // Fetch course details and parents concurrently
      const [course, parents] = await Promise.all([
        getCourseDetails(courseId, token),
        getStudentParents(studentId, token),
      ]);

      const eventData = {
        studentId,
        courseId,
        courseName: course?.courseName,
        courseCode: course?.courseCode,
        percentage: stats.percentage,
        totalClasses: stats.total,
        attendedClasses: stats.present,
        absentClasses: stats.absent,
        threshold: LOW_THRESHOLD,
        timestamp: new Date().toISOString(),
        parents: parents.map(p => ({
          email: p.email,
          name: `${p.firstName} ${p.lastName}`,
          relationship: p.relationship
        }))
      };
      await publishEvent('attendance.alert.low', eventData);
      console.log(`🚨 Low attendance alert published for student ${studentId} in course ${course?.courseName ?? courseId}`);
    }
  } catch (error: any) {
    console.error('Error checking low attendance:', error.message);
  }
}
/**
 * Publish weekly attendance summary for a student
 */
export async function publishWeeklyAttendanceSummary(
  studentId: string,
  token?: string
): Promise<void> {
  try {
    const overallStats = await getOverallAttendanceStats(studentId, token);
    const parents = await getStudentParents(studentId, token);
    const eventData = {
      studentId,
      overallPercentage: overallStats.overallPercentage,
      totalCourses: overallStats.totalCourses,
      totalClassesThisWeek: overallStats.totalClassesAcrossAllCourses,
      attendedThisWeek: overallStats.totalAttendedAcrossAllCourses,
      courseWiseStats: overallStats.courseWiseStats,
      timestamp: new Date().toISOString(),
      weekStart: getWeekStart().toISOString(),
      weekEnd: new Date().toISOString(),
      parents: parents.map(p => ({
        email: p.email,
        name: `${p.firstName} ${p.lastName}`,
        relationship: p.relationship
      }))
    };
    await publishEvent('attendance.summary.weekly', eventData);
    console.log(`📊 Weekly attendance summary published for student ${studentId}`);
  } catch (error: any) {
    console.error('Error publishing weekly summary:', error.message);
  }
}
/**
 * Get start of current week (Monday)
 */
function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.setDate(diff));
}
