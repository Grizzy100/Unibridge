
//server/notification-service/src/consumers/attendance-events.consumer.ts
import { consumeEvents } from '../utils/rabbitmq.js';
import { createNotification } from '../services/notification.service.js';
import { sendLowAttendanceEmail, sendWeeklySummaryEmail } from '../services/email.service.js';

export async function startAttendanceEventsConsumer() {
  const queueName = 'notification.attendance.queue';
  const routingKeys = [
    'attendance.alert.low',
    'attendance.summary.weekly'
  ];
  await consumeEvents(queueName, routingKeys, async (routingKey, data) => {
    try {
      if (routingKey === 'attendance.alert.low') {
        await handleLowAttendanceAlert(data);
      } else if (routingKey === 'attendance.summary.weekly') {
        await handleWeeklySummary(data);
      }
    } catch (error) {
      console.error(`Error handling ${routingKey}:`, error);
    }
  });
}

async function handleLowAttendanceAlert(data: any) {
  // console.log('📉 Processing low attendance alert:', data);
  const {
    studentId,
    courseId,
    courseName,
    courseCode,
    percentage,
    totalClasses,
    attendedClasses,
    absentClasses,
    parents
  } = data;

  // Build display name — falls back to courseId for legacy events without course info
  const displayCourseName = courseName && courseCode
    ? `${courseName} (${courseCode})`
    : courseName || courseId;

  await createNotification(
    studentId,
    'ATTENDANCE_LOW',
    '⚠️ Low Attendance Alert',
    `Your attendance in ${displayCourseName} has dropped to ${percentage}%. You have attended ${attendedClasses} out of ${totalClasses} classes.`,
    {
      courseId,
      courseName,
      courseCode,
      percentage,
      totalClasses,
      attendedClasses,
      absentClasses
    }
  );

  // Send email to parents
  if (parents && parents.length > 0) {
    await Promise.allSettled(
      parents.map((parent: any) =>
        sendLowAttendanceEmail(
          parent.email,
          parent.name,
          'Student',
          displayCourseName,
          percentage,
          totalClasses,
          attendedClasses
        )
      )
    );
  }
  // console.log('✅ Low attendance alert processed');
}

async function handleWeeklySummary(data: any) {
  // console.log('📊 Processing weekly summary:', data);
  const {
    studentId,
    overallPercentage,
    totalCourses,
    totalClassesThisWeek,
    attendedThisWeek,
    courseWiseStats,
    weekStart,
    weekEnd,
    parents
  } = data;

  await createNotification(
    studentId,
    'WEEKLY_SUMMARY',
    '📊 Weekly Attendance Summary',
    `Your overall attendance is ${overallPercentage}%. This week you attended ${attendedThisWeek} out of ${totalClassesThisWeek} classes across ${totalCourses} courses.`,
    {
      overallPercentage,
      totalCourses,
      totalClassesThisWeek,
      attendedThisWeek,
      courseWiseStats,
      weekStart,
      weekEnd
    }
  );

  if (parents && parents.length > 0) {
    await Promise.allSettled(
      parents.map((parent: any) =>
        sendWeeklySummaryEmail(
          parent.email,
          parent.name,
          'Student',
          overallPercentage,
          totalCourses,
          totalClassesThisWeek,
          attendedThisWeek,
          courseWiseStats
        )
      )
    );
  }
  // console.log('✅ Weekly summary processed');
}
