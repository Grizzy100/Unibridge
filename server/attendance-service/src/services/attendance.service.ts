//server\attendance-service\src\services\attendance.service.ts

import prisma from '../utils/prisma.js';
import { checkStudentOutpass } from './outpass.service.js';
import { AttendanceRecord } from '@prisma/client';
import { getStudentProfileIdFromUserId } from './user.service.js';
import { publishAttendanceMarked } from '../events/publishers/attendanceMarked.publisher.js';
import { checkAndPublishLowAttendanceAlert } from './analytics-events.service.js';

interface MarkAttendanceData {
  qrCode: string;
  latitude?: number;
  longitude?: number;
}

export async function markStudentAttendance(
  studentId: string,
  data: MarkAttendanceData,
  token?: string
) {
  try {
    const now = new Date();

    // Map User.id -> StudentProfile.id
    const studentProfileId = await getStudentProfileIdFromUserId(studentId, token);
    console.log('JWT userId:', studentId, 'StudentProfile.id:', studentProfileId);

    // Find session by QR code
    const session = await prisma.attendanceSession.findUnique({
      where: { qrCode: data.qrCode }
    });

    if (!session) {
      throw new Error('Invalid QR code');
    }

    // ✅ PHASE 1: Session Time Window Checks

    // 1. Check if session is ACTIVE
    if (session.status !== 'ACTIVE') {
      throw new Error(`Session is ${session.status}. Cannot mark attendance.`);
    }

    // 2. Check if class has started
    if (now < session.sessionStartTime) {
      const minutesUntilStart = Math.ceil((session.sessionStartTime.getTime() - now.getTime()) / 60000);
      throw new Error(`Class has not started yet. Please wait ${minutesUntilStart} minute(s).`);
    }

    // 3. Check if class has ended (auto-expire if needed)
    if (now > session.sessionEndTime) {
      // Auto-expire the session
      await prisma.attendanceSession.update({
        where: { id: session.id },
        data: { status: 'EXPIRED' }
      });
      throw new Error('Class has ended. Attendance window is closed.');
    }

    // 4. Check if QR has expired
    if (now > session.qrExpiresAt) {
      throw new Error('QR code has expired. Please ask your teacher to refresh the QR code.');
    }

    // Find attendance record using StudentProfile.id
    const record = await prisma.attendanceRecord.findUnique({
      where: {
        sessionId_studentId: {
          sessionId: session.id,
          studentId: studentProfileId
        }
      }
    });

    console.log('AttendanceRecord found:', record);

    if (!record) {
      throw new Error('You are not enrolled in this course');
    }

    // Check if already marked
    if (record.status === 'PRESENT') {
      throw new Error('Attendance already marked for this session');
    }

    // ✅ CHECK OUTPASS - Use sessionStartTime
    const hasOutpass = await checkStudentOutpass(
      studentProfileId, 
      session.sessionStartTime,
      token
    );
    
    console.log('[markStudentAttendance] hasOutpass =', hasOutpass, 
      'sessionStartTime =', session.sessionStartTime.toISOString());
    
    // ✅ NEW: Block student from marking if they have active outpass
    if (hasOutpass) {
      throw new Error('You have an active outpass for this time period. Attendance cannot be marked.');
    }

    // ✅ Update attendance record (only reached if no outpass)
    const updatedRecord = await prisma.attendanceRecord.update({
      where: { id: record.id },
      data: {
        status: 'PRESENT',
        markedAt: now,
        hasApprovedOutpass: false,
        outpassCheckAt: now,
        latitude: data.latitude,
        longitude: data.longitude
      }
    });

    console.log(`✅ Attendance marked PRESENT for student ${studentProfileId} in session ${session.id}`);

    // Publish attendance.marked event (fire and forget)
    try {
      await publishAttendanceMarked({
        studentId: studentProfileId,
        sessionId: session.id,
        courseId: session.courseId,
        status: 'PRESENT',
        markedAt: updatedRecord.markedAt!
      });
    } catch (error) {
      console.error('Failed to publish attendance.marked event:', error);
    }

    // Check if attendance is low and publish alert (fire and forget)
    checkAndPublishLowAttendanceAlert(studentId, session.courseId, token)
      .catch(err => console.error('Failed to check low attendance:', err));

    return updatedRecord;
  } catch (error: any) {
    console.error('Error in markStudentAttendance:', error.message);
    throw error;
  }
}

// KEEP all other functions unchanged (getStudentAttendance, getAttendanceBySession, calculateAttendancePercentage)

export async function getStudentAttendance(
  studentId: string,
  courseId?: string,
  token?: string
) {
  const studentProfileId = await getStudentProfileIdFromUserId(studentId, token);
  const where: any = { studentId: studentProfileId };
  if (courseId) {
    where.session = { courseId };
  }
  return await prisma.attendanceRecord.findMany({
    where,
    include: {
      session: {
        select: {
          courseId: true,
          sessionStartTime: true,
          sessionEndTime: true,
          location: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getAttendanceBySession(sessionId: string) {
  return await prisma.attendanceRecord.findMany({
    where: { sessionId },
    orderBy: { status: 'asc' }
  });
}

export async function calculateAttendancePercentage(
  studentId: string,
  courseId: string,
  token?: string
) {
  const studentProfileId = await getStudentProfileIdFromUserId(studentId, token);
  const records = await prisma.attendanceRecord.findMany({
    where: {
      studentId: studentProfileId,
      session: { courseId }
    }
  });
  const total = records.length;
  const present = records.filter((r: AttendanceRecord) => r.status === 'PRESENT').length;
  const absent = records.filter((r: AttendanceRecord) => r.status === 'ABSENT').length;
  const percentage = total > 0 ? (present / total) * 100 : 0;
  return {
    total,
    present,
    absent,
    percentage: parseFloat(percentage.toFixed(2))
  };
}














// import prisma from '../utils/prisma.js';
// import { checkStudentOutpass } from './outpass.service.js';
// import { AttendanceRecord } from '@prisma/client';
// import { getStudentProfileIdFromUserId } from './user.service.js';
// import { publishAttendanceMarked } from '../events/publishers/attendanceMarked.publisher.js';
// import { checkAndPublishLowAttendanceAlert } from './analytics-events.service.js';
// interface MarkAttendanceData {
//   qrCode: string;
//   latitude?: number;
//   longitude?: number;
// }
// // studentId here is actually JWT userId
// export async function markStudentAttendance(
//   studentId: string,
//   data: MarkAttendanceData,
//   token?: string
// ) {
//   // Map User.id -> StudentProfile.id
//   const studentProfileId = await getStudentProfileIdFromUserId(studentId, token);
//   console.log('JWT userId:', studentId, 'StudentProfile.id:', studentProfileId);
//   // Find session by QR code
//   const session = await prisma.attendanceSession.findUnique({
//     where: { qrCode: data.qrCode }
//   });
//   if (!session) {
//     throw new Error('Invalid QR code');
//   }
//   // Check if QR has expired
//   if (new Date() > session.qrExpiresAt) {
//     throw new Error('QR code has expired. Please ask your teacher to generate a new one.');
//   }
//   // Check if session is active
//   if (session.status !== 'ACTIVE') {
//     throw new Error('Session is not active');
//   }
//   // Find attendance record using StudentProfile.id
//   const record = await prisma.attendanceRecord.findUnique({
//     where: {
//       sessionId_studentId: {
//         sessionId: session.id,
//         studentId: studentProfileId
//       }
//     }
//   });
//   console.log('AttendanceRecord found:', record);
//   if (!record) {
//     throw new Error('You are not enrolled in this course');
//   }
//   // Check if already marked
//   if (record.status === 'PRESENT') {
//     throw new Error('Attendance already marked for this session');
//   }
//   // CHECK OUTPASS
//   const hasOutpass = await checkStudentOutpass(studentProfileId, session.sessionDate);
  
//   console.log('[markStudentAttendance] hasOutpass =', hasOutpass, 'sessionDate =', session.sessionDate.toISOString());
  
//   const newStatus = hasOutpass ? 'ABSENT' : 'PRESENT';
//   // Update attendance record
//   const updatedRecord = await prisma.attendanceRecord.update({
//     where: { id: record.id },
//     data: {
//       status: newStatus,
//       markedAt: new Date(),
//       hasApprovedOutpass: hasOutpass,
//       outpassCheckAt: new Date(),
//       latitude: data.latitude,
//       longitude: data.longitude
//     }
//   });
//   // Publish attendance.marked event (fire and forget)
//   try {
//     await publishAttendanceMarked({
//       studentId: studentProfileId,
//       sessionId: session.id,
//       courseId: session.courseId,
//       status: newStatus,
//       markedAt: updatedRecord.markedAt!
//     });
//   } catch (error) {
//     console.error('❌ Failed to publish attendance.marked event:', error);
//     // Don't throw - attendance marking should succeed even if event fails
//   }
//   // Check if attendance is low and publish alert (fire and forget)
//   checkAndPublishLowAttendanceAlert(studentId, session.courseId, token)
//     .catch(err => console.error('Failed to check low attendance:', err));
//   return updatedRecord;
// }



// export async function getStudentAttendance(
//   studentId: string,
//   courseId?: string,
//   token?: string
// ) {
//   const studentProfileId = await getStudentProfileIdFromUserId(studentId, token);
//   const where: any = { studentId: studentProfileId };
//   if (courseId) {
//     where.session = { courseId };
//   }
//   return await prisma.attendanceRecord.findMany({
//     where,
//     include: {
//       session: {
//         select: {
//           courseId: true,
//           sessionDate: true,
//           sessionStartTime: true,
//           sessionEndTime: true,
//           location: true
//         }
//       }
//     },
//     orderBy: { createdAt: 'desc' }
//   });
// }
// export async function getAttendanceBySession(sessionId: string) {
//   return await prisma.attendanceRecord.findMany({
//     where: { sessionId },
//     orderBy: { status: 'asc' }
//   });
// }
// export async function calculateAttendancePercentage(
//   studentId: string,
//   courseId: string,
//   token?: string
// ) {
//   const studentProfileId = await getStudentProfileIdFromUserId(studentId, token);
//   const records = await prisma.attendanceRecord.findMany({
//     where: {
//       studentId: studentProfileId,
//       session: { courseId }
//     }
//   });
//   const total = records.length;
//   const present = records.filter((r: AttendanceRecord) => r.status === 'PRESENT').length;
//   const absent = records.filter((r: AttendanceRecord) => r.status === 'ABSENT').length;
//   const percentage = total > 0 ? (present / total) * 100 : 0;
//   return {
//     total,
//     present,
//     absent,
//     percentage: parseFloat(percentage.toFixed(2))
//   };
// }
