
//server/notification-service/src/services/email.service.ts
import nodemailer from 'nodemailer';
import prisma from '../utils/prisma.js';
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
export async function sendLowAttendanceEmail(
  parentEmail: string,
  parentName: string,
  studentName: string,
  courseId: string,
  percentage: number,
  totalClasses: number,
  attendedClasses: number
) {
  const subject = `⚠️ Low Attendance Alert for ${studentName}`;
  const body = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
      <h2 style="color: #d32f2f;">⚠️ Low Attendance Alert</h2>
      <p>Dear ${parentName},</p>
      
      <p>We would like to inform you that <strong>${studentName}</strong>'s attendance has fallen below 60%.</p>
      
      <div style="background-color: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d32f2f;">
        <h3 style="margin-top: 0; color: #c62828;">Attendance Details</h3>
        <p style="margin: 10px 0;"><strong>Course ID:</strong> ${courseId}</p>
        <p style="margin: 10px 0;"><strong>Current Attendance:</strong> <span style="font-size: 24px; color: #d32f2f; font-weight: bold;">${percentage}%</span></p>
        <p style="margin: 10px 0;"><strong>Classes Attended:</strong> ${attendedClasses} out of ${totalClasses}</p>
        <p style="margin: 10px 0;"><strong>Classes Missed:</strong> ${totalClasses - attendedClasses}</p>
      </div>
      
      <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #e65100;"><strong>⚠️ Action Required:</strong> Please ensure regular attendance to meet the minimum requirement of 75%.</p>
      </div>
      
      <p style="color: #666;">If you have any concerns or questions, please contact the academic office.</p>
      
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px;">
        Best regards,<br>
        <strong>UniBridge Academic Team</strong><br>
        This is an automated notification. Please do not reply to this email.
      </p>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"UniBridge" <noreply@unibridge.edu>',
      to: parentEmail,
      subject,
      html: body
    });
    await prisma.emailLog.create({
      data: {
        recipient: parentEmail,
        subject,
        body,
        sent: true,
        sentAt: new Date()
      }
    });
    console.log(`✅ Low attendance email sent to ${parentEmail}`);
  } catch (error: any) {
    console.error('Error sending email:', error);
    
    await prisma.emailLog.create({
      data: {
        recipient: parentEmail,
        subject,
        body,
        sent: false,
        error: error.message
      }
    });
  }
}
export async function sendWeeklySummaryEmail(
  parentEmail: string,
  parentName: string,
  studentName: string,
  overallPercentage: number,
  totalCourses: number,
  totalClasses: number,
  attendedClasses: number,
  courseWiseStats: any[]
) {
  const subject = `📊 Weekly Attendance Summary for ${studentName}`;
  
  const courseRows = courseWiseStats.map(course => `
    <tr>
      <td style="padding: 12px; border: 1px solid #e0e0e0;">${course.courseId}</td>
      <td style="padding: 12px; border: 1px solid #e0e0e0; text-align: center;">${course.attendedClasses} / ${course.totalClasses}</td>
      <td style="padding: 12px; border: 1px solid #e0e0e0; text-align: center; font-weight: bold; color: ${course.percentage < 75 ? '#d32f2f' : '#388e3c'};">
        ${course.percentage}%
      </td>
    </tr>
  `).join('');
  const statusColor = overallPercentage >= 75 ? '#388e3c' : overallPercentage >= 60 ? '#f57c00' : '#d32f2f';
  const statusBg = overallPercentage >= 75 ? '#e8f5e9' : overallPercentage >= 60 ? '#fff3e0' : '#ffebee';
  const body = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
      <h2 style="color: #1976d2;">📊 Weekly Attendance Summary</h2>
      <p>Dear ${parentName},</p>
      
      <p>Here is the weekly attendance summary for <strong>${studentName}</strong>.</p>
      
      <div style="background-color: ${statusBg}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusColor};">
        <h3 style="margin-top: 0; color: ${statusColor};">Overall Statistics</h3>
        <p style="margin: 10px 0;"><strong>Overall Attendance:</strong> <span style="font-size: 28px; color: ${statusColor}; font-weight: bold;">${overallPercentage}%</span></p>
        <p style="margin: 10px 0;"><strong>Total Courses:</strong> ${totalCourses}</p>
        <p style="margin: 10px 0;"><strong>Classes This Week:</strong> ${attendedClasses} / ${totalClasses}</p>
      </div>
      
      <h3 style="color: #424242;">Course-wise Breakdown</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: white;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 12px; border: 1px solid #e0e0e0; text-align: left;">Course</th>
            <th style="padding: 12px; border: 1px solid #e0e0e0; text-align: center;">Attended</th>
            <th style="padding: 12px; border: 1px solid #e0e0e0; text-align: center;">Percentage</th>
          </tr>
        </thead>
        <tbody>
          ${courseRows}
        </tbody>
      </table>
      
      ${overallPercentage < 75 ? `
        <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #e65100;"><strong>⚠️ Attention:</strong> Overall attendance is below the required 75%. Please encourage regular class attendance.</p>
        </div>
      ` : `
        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #2e7d32;"><strong>✅ Great!</strong> Attendance is meeting the required standards. Keep up the good work!</p>
        </div>
      `}
      
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px;">
        Best regards,<br>
        <strong>UniBridge Academic Team</strong><br>
        This is an automated weekly summary. Please do not reply to this email.
      </p>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"UniBridge" <noreply@unibridge.edu>',
      to: parentEmail,
      subject,
      html: body
    });
    await prisma.emailLog.create({
      data: {
        recipient: parentEmail,
        subject,
        body,
        sent: true,
        sentAt: new Date()
      }
    });
    console.log(`✅ Weekly summary email sent to ${parentEmail}`);
  } catch (error: any) {
    console.error('Error sending email:', error);
    
    await prisma.emailLog.create({
      data: {
        recipient: parentEmail,
        subject,
        body,
        sent: false,
        error: error.message
      }
    });
  }
}
