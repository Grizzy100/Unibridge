
//server/notification-service/src/services/outpass-email.service.ts
import nodemailer from 'nodemailer';
import prisma from '../utils/prisma.js';
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
export async function sendOutpassCreatedEmail(
  parentEmail: string,
  parentName: string,
  studentName: string,
  outpassType: string,
  reason: string,
  outgoingDate: string,
  returningDate: string
) {
  const subject = `📋 Outpass Request from ${studentName}`;
  const body = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
      <h2 style="color: #1976d2;">📋 New Outpass Request</h2>
      <p>Dear ${parentName},</p>
      
      <p><strong>${studentName}</strong> has requested an outpass. Please review and approve/reject the request.</p>
      
      <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1976d2;">
        <h3 style="margin-top: 0; color: #0d47a1;">Outpass Details</h3>
        <p style="margin: 10px 0;"><strong>Type:</strong> ${outpassType}</p>
        <p style="margin: 10px 0;"><strong>Reason:</strong> ${reason}</p>
        <p style="margin: 10px 0;"><strong>Outgoing Date:</strong> ${new Date(outgoingDate).toLocaleString('en-IN')}</p>
        <p style="margin: 10px 0;"><strong>Returning Date:</strong> ${new Date(returningDate).toLocaleString('en-IN')}</p>
      </div>
      
      <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #e65100;"><strong>⏰ Action Required:</strong> Please log in to your parent portal to approve or reject this request.</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px;">
        Best regards,<br>
        <strong>UniBridge Outpass Team</strong><br>
        This is an automated notification. Please do not reply to this email.
      </p>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"UniBridge" <noreply@unibridge.edu>',
      to: parentEmail,
      subject,
      html: body,
    });
    await prisma.emailLog.create({
      data: {
        recipient: parentEmail,
        subject,
        body,
        sent: true,
        sentAt: new Date(),
      },
    });
    console.log(`✅ Outpass created email sent to ${parentEmail}`);
  } catch (error: any) {
    console.error('Error sending email:', error);
    await prisma.emailLog.create({
      data: {
        recipient: parentEmail,
        subject,
        body,
        sent: false,
        error: error.message,
      },
    });
  }
}
export async function sendOutpassWardenApprovedEmail(
  parentEmail: string,
  parentName: string,
  studentName: string,
  outpassType: string,
  outgoingDate: string,
  returningDate: string
) {
  const subject = `✅ Outpass Approved for ${studentName}`;
  const body = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
      <h2 style="color: #388e3c;">✅ Outpass Approved</h2>
      <p>Dear ${parentName},</p>
      
      <p>Good news! The outpass for <strong>${studentName}</strong> has been approved by the warden.</p>
      
      <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #388e3c;">
        <h3 style="margin-top: 0; color: #2e7d32;">Approved Outpass Details</h3>
        <p style="margin: 10px 0;"><strong>Type:</strong> ${outpassType}</p>
        <p style="margin: 10px 0;"><strong>Leave Date:</strong> ${new Date(outgoingDate).toLocaleString('en-IN')}</p>
        <p style="margin: 10px 0;"><strong>Return Date:</strong> ${new Date(returningDate).toLocaleString('en-IN')}</p>
      </div>
      
      <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #e65100;"><strong>📌 Important:</strong> Please ensure ${studentName} returns to campus by the specified date and time.</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px;">
        Best regards,<br>
        <strong>UniBridge Outpass Team</strong><br>
        This is an automated notification. Please do not reply to this email.
      </p>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"UniBridge" <noreply@unibridge.edu>',
      to: parentEmail,
      subject,
      html: body,
    });
    await prisma.emailLog.create({
      data: {
        recipient: parentEmail,
        subject,
        body,
        sent: true,
        sentAt: new Date(),
      },
    });
    console.log(`✅ Outpass approved email sent to ${parentEmail}`);
  } catch (error: any) {
    console.error('Error sending email:', error);
    await prisma.emailLog.create({
      data: {
        recipient: parentEmail,
        subject,
        body,
        sent: false,
        error: error.message,
      },
    });
  }
}
export async function sendOutpassWardenRejectedEmail(
  parentEmail: string,
  parentName: string,
  studentName: string,
  outpassType: string,
  comment?: string
) {
  const subject = `❌ Outpass Rejected for ${studentName}`;
  const body = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
      <h2 style="color: #d32f2f;">❌ Outpass Rejected</h2>
      <p>Dear ${parentName},</p>
      
      <p>The outpass request for <strong>${studentName}</strong> has been rejected by the warden.</p>
      
      <div style="background-color: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d32f2f;">
        <h3 style="margin-top: 0; color: #c62828;">Rejection Details</h3>
        <p style="margin: 10px 0;"><strong>Type:</strong> ${outpassType}</p>
        ${comment ? `<p style="margin: 10px 0;"><strong>Warden's Comment:</strong> ${comment}</p>` : ''}
      </div>
      
      <p style="color: #666;">If you have any questions, please contact the warden's office.</p>
      
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px;">
        Best regards,<br>
        <strong>UniBridge Outpass Team</strong><br>
        This is an automated notification. Please do not reply to this email.
      </p>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"UniBridge" <noreply@unibridge.edu>',
      to: parentEmail,
      subject,
      html: body,
    });
    await prisma.emailLog.create({
      data: {
        recipient: parentEmail,
        subject,
        body,
        sent: true,
        sentAt: new Date(),
      },
    });
    console.log(`✅ Outpass rejected email sent to ${parentEmail}`);
  } catch (error: any) {
    console.error('Error sending email:', error);
    await prisma.emailLog.create({
      data: {
        recipient: parentEmail,
        subject,
        body,
        sent: false,
        error: error.message,
      },
    });
  }
}
export async function sendOutpassCancelledEmail(
  parentEmail: string,
  parentName: string,
  studentName: string,
  outpassType: string
) {
  const subject = `🔄 Outpass Cancelled by ${studentName}`;
  const body = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
      <h2 style="color: #f57c00;">🔄 Outpass Cancelled</h2>
      <p>Dear ${parentName},</p>
      
      <p><strong>${studentName}</strong> has cancelled their outpass request.</p>
      
      <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f57c00;">
        <h3 style="margin-top: 0; color: #e65100;">Cancelled Outpass</h3>
        <p style="margin: 10px 0;"><strong>Type:</strong> ${outpassType}</p>
        <p style="margin: 10px 0;"><strong>Status:</strong> Cancelled by student</p>
      </div>
      
      <p style="color: #666;">No further action is required from your end.</p>
      
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px;">
        Best regards,<br>
        <strong>UniBridge Outpass Team</strong><br>
        This is an automated notification. Please do not reply to this email.
      </p>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"UniBridge" <noreply@unibridge.edu>',
      to: parentEmail,
      subject,
      html: body,
    });
    await prisma.emailLog.create({
      data: {
        recipient: parentEmail,
        subject,
        body,
        sent: true,
        sentAt: new Date(),
      },
    });
    console.log(`✅ Outpass cancelled email sent to ${parentEmail}`);
  } catch (error: any) {
    console.error('Error sending email:', error);
    await prisma.emailLog.create({
      data: {
        recipient: parentEmail,
        subject,
        body,
        sent: false,
        error: error.message,
      },
    });
  }
}
