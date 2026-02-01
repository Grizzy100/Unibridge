
//server\attendance-service\src\jobs\weekly-summary.job.ts
import cron from 'node-cron';
import prisma from '../utils/prisma.js';
import { publishWeeklyAttendanceSummary } from '../services/analytics-events.service.js';
/**
 * Cron job to send weekly attendance summaries
 * Runs every Monday at 8:00 AM IST
 */
export function startWeeklySummaryCron() {
  // Cron: "0 8 * * 1" = Every Monday at 8:00 AM
  cron.schedule('0 8 * * 1', async () => {
    console.log('Running weekly attendance summary job...');
    try {
      // Get all unique student IDs from attendance records
      const students = await prisma.attendanceRecord.findMany({
        select: { studentId: true },
        distinct: ['studentId']
      });
      console.log(`Found ${students.length} students to process`);
      for (const { studentId } of students) {
        await publishWeeklyAttendanceSummary(studentId);
        // Small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      console.log('✅ Weekly summary job completed');
    } catch (error: any) {
      console.error('Error in weekly summary cron:', error.message);
    }
  }, {
    timezone: 'Asia/Kolkata'
  });
  console.log('✅ Weekly summary cron job scheduled (Every Monday 8:00 AM IST)');
}
