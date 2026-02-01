// server/attendance-service/src/services/session.service.ts
import prisma from '../utils/prisma.js';
import { generateQRCode } from '../utils/qr-generator.js';
import axios from 'axios';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

// EXISTING interfaces - keep as is
interface CreateSessionData {
  courseId: string;
  sessionStartTime: string;
  sessionEndTime: string;
  location?: string;
  remarks?: string;
  qrValidityMinutes?: number;
}

// ✅ NEW: Phase 1 interface
interface StartSessionData {
  courseId: string;
  location?: string;
  remarks?: string;
  qrValiditySeconds?: number;
}

// EXISTING helper functions - keep as is
async function getStudentsForCourse(courseId: string, token?: string) {
  try {
    const headers: any = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await axios.get(`${USER_SERVICE_URL}/api/courses/${courseId}/students`, {
      timeout: 5000,
      headers,
    });
    console.log(`[DEBUG] Got students for course ${courseId}:`, response.data.data);
    return response.data.data || [];
  } catch (error: any) {
    console.error('Error fetching students:', error.message);
    throw new Error('Failed to fetch enrolled students from user service');
  }
}

async function verifyTeacherCourse(teacherId: string, courseId: string, token?: string): Promise<boolean> {
  try {
    const headers: any = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await axios.get(`${USER_SERVICE_URL}/api/teachers/${teacherId}/courses`, {
      timeout: 5000,
      headers,
    });
    const courses = response.data.data || [];
    console.log(`[DEBUG] Teacher ${teacherId} teaches these courses:`, courses.map((c:any) => c.id));
    return courses.some((course: any) => course.id === courseId);
  } catch (error: any) {
    console.error('Error verifying teacher course:', error.message);
    throw new Error('Failed to verify teacher authorization from user service');
  }
}

// ✅ NEW: START SESSION - Creates a 1-hour class session
export async function startSession(
  teacherId: string,
  data: StartSessionData,
  token?: string
) {
  try {
    // Verify authorization
    const isAuthorized = await verifyTeacherCourse(teacherId, data.courseId, token);
    if (!isAuthorized) {
      throw new Error('Unauthorized: You do not teach this course');
    }

    const now = new Date();
    const qrValiditySeconds = data.qrValiditySeconds || 30;

    // Fixed 1-hour duration
    const sessionStartTime = now;
    const sessionEndTime = new Date(now.getTime() + 60 * 60 * 1000); // +1 hour

    // Generate unique QR code
    const qrData = `start_${data.courseId}_${teacherId}_${now.getTime()}_${Math.random().toString(36).substring(7)}`;
    const qrCode = generateQRCode(qrData);
    const qrExpiresAt = new Date(now.getTime() + qrValiditySeconds * 1000);

    // Create the session
    const session = await prisma.attendanceSession.create({
      data: {
        teacherId,
        courseId: data.courseId,
        sessionStartTime,
        sessionEndTime,
        qrCode,
        qrGeneratedAt: now,
        qrExpiresAt,
        status: 'ACTIVE',
        location: data.location,
        remarks: data.remarks
      }
    });

    console.log(`✅ Started session ${session.id} for course ${data.courseId} (1-hour window)`);

    // Create attendance records for all enrolled students
    const students = await getStudentsForCourse(data.courseId, token);

    if (students.length === 0) {
      console.warn(`⚠️ No students enrolled in course ${data.courseId}`);
    } else {
      console.log(`[DEBUG] Creating AttendanceRecords for ${students.length} students`);
      
      await prisma.attendanceRecord.createMany({
        data: students.map((student: any) => {
          const usedId = student.id || student.userId;
          return {
            sessionId: session.id,
            studentId: usedId,
            enrollmentNumber: student.enrollmentNumber || null,
            status: 'ABSENT' as const
          };
        })
      });

      console.log(`✅ Created ${students.length} attendance records for session ${session.id}`);
    }

    return session;
  } catch (error: any) {
    console.error('Error in startSession:', error.message);
    throw error;
  }
}

// ✅ NEW: REFRESH QR - Rotates QR code within the same session
export async function refreshSessionQr(
  sessionId: string,
  teacherId: string,
  qrValiditySeconds: number = 30,
  token?: string
) {
  try {
    const now = new Date();

    // Find the session
    const session = await prisma.attendanceSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      throw new Error('Session not found');
    }

    // Verify ownership
    if (session.teacherId !== teacherId) {
      throw new Error('Unauthorized: This is not your session');
    }

    // Check if session has ended (auto-expire)
    if (now > session.sessionEndTime) {
      // Auto-expire the session
      if (session.status === 'ACTIVE') {
        await prisma.attendanceSession.update({
          where: { id: sessionId },
          data: { status: 'EXPIRED' }
        });
      }
      throw new Error('Session has ended. Cannot refresh QR after class end time.');
    }

    // Check if session is active
    if (session.status !== 'ACTIVE') {
      throw new Error(`Cannot refresh QR: Session is ${session.status}`);
    }

    // Generate new QR code (must be unique)
    const qrData = `refresh_${session.courseId}_${teacherId}_${now.getTime()}_${Math.random().toString(36).substring(7)}`;
    const qrCode = generateQRCode(qrData);
    const qrExpiresAt = new Date(now.getTime() + qrValiditySeconds * 1000);

    // Update SAME session with new QR
    const updatedSession = await prisma.attendanceSession.update({
      where: { id: sessionId },
      data: {
        qrCode,
        qrGeneratedAt: now,
        qrExpiresAt
      }
    });

    console.log(`🔄 Refreshed QR for session ${sessionId} (valid for ${qrValiditySeconds}s)`);

    return updatedSession;
  } catch (error: any) {
    console.error('Error in refreshSessionQr:', error.message);
    throw error;
  }
}

// EXISTING createAttendanceSession - KEEP AS IS
export async function createAttendanceSession(
  teacherId: string,
  data: CreateSessionData,
  token?: string
) {
  // ... keep your existing code exactly as is ...
  const isAuthorized = await verifyTeacherCourse(teacherId, data.courseId, token);
  if (!isAuthorized) {
    throw new Error('Unauthorized: You do not teach this course');
  }
  const qrData = `${data.courseId}_${teacherId}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const qrCode = generateQRCode(qrData);
  const qrValidityMinutes = data.qrValidityMinutes || 0.5;
  const qrExpiresAt = new Date(Date.now() + qrValidityMinutes * 60 * 1000);
  const session = await prisma.attendanceSession.create({
    data: {
      teacherId,
      courseId: data.courseId,
      sessionStartTime: new Date(data.sessionStartTime),
      sessionEndTime: new Date(data.sessionEndTime),
      qrCode,
      qrExpiresAt,
      location: data.location,
      remarks: data.remarks,
      status: 'ACTIVE'
    }
  });
  console.log(`[DEBUG] Created attendance session ${session.id} for course ${data.courseId}`);
  const students = await getStudentsForCourse(data.courseId, token);
  if (students.length === 0) {
    console.warn(`No students enrolled in course ${data.courseId}`);
  } else {
    console.log(`[DEBUG] Creating AttendanceRecords for these studentIds:`, students.map((s:any) => s.id || s.userId));
  }
  if (students.length > 0) {
    await prisma.attendanceRecord.createMany({
      data: students.map((student: any) => {
        const usedId = student.id || student.userId;
        console.log(`[DEBUG] AttendanceRecord for studentId:`, usedId, 'enrollmentNumber:', student.enrollmentNumber);
        return ({
          sessionId: session.id,
          studentId: usedId,
          enrollmentNumber: student.enrollmentNumber,
          status: 'ABSENT',
        });
      })
    });
  }
  return session;
}

// EXISTING functions - KEEP AS IS
export async function getTeacherSessions(teacherId: string) {
  return await prisma.attendanceSession.findMany({
    where: { teacherId },
    include: {
      _count: {
        select: { attendanceRecords: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getSessionDetails(sessionId: string) {
  const session = await prisma.attendanceSession.findUnique({
    where: { id: sessionId },
    include: {
      attendanceRecords: {
        orderBy: { status: 'asc' }
      }
    }
  });
  if (!session) {
    throw new Error('Session not found');
  }
  return session;
}

export async function expireSession(sessionId: string, teacherId: string) {
  const session = await prisma.attendanceSession.findUnique({
    where: { id: sessionId }
  });
  if (!session) {
    throw new Error('Session not found');
  }
  if (session.teacherId !== teacherId) {
    throw new Error('Unauthorized: This is not your session');
  }
  return await prisma.attendanceSession.update({
    where: { id: sessionId },
    data: { status: 'EXPIRED' }
  });
}









// import prisma from '../utils/prisma.js';
// import { generateQRCode } from '../utils/qr-generator.js';
// import axios from 'axios';
// const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
// interface CreateSessionData {
//   courseId: string;
//   sessionStartTime: string;
//   sessionEndTime: string;
//   location?: string;
//   remarks?: string;
//   qrValidityMinutes?: number;
// }


// // Helper: fetch students with token!
// async function getStudentsForCourse(courseId: string, token?: string) {
//   try {
//     const headers: any = {};
//     if (token) headers.Authorization = `Bearer ${token}`;
//     const response = await axios.get(`${USER_SERVICE_URL}/api/courses/${courseId}/students`, {
//       timeout: 5000,
//       headers,
//     });
//     // DEBUG: Log raw student list
//     console.log(`[DEBUG] Got students for course ${courseId}:`, response.data.data);
//     return response.data.data || [];
//   } catch (error: any) {
//     console.error('Error fetching students:', error.message);
//     throw new Error('Failed to fetch enrolled students from user service');
//   }
// }
// // Helper: verify teaching assignment with token!
// async function verifyTeacherCourse(teacherId: string, courseId: string, token?: string): Promise<boolean> {
//   try {
//     const headers: any = {};
//     if (token) headers.Authorization = `Bearer ${token}`;
//     const response = await axios.get(`${USER_SERVICE_URL}/api/teachers/${teacherId}/courses`, {
//       timeout: 5000,
//       headers,
//     });
//     const courses = response.data.data || [];
//     // DEBUG: Log courses taught by teacher
//     console.log(`[DEBUG] Teacher ${teacherId} teaches these courses:`, courses.map((c:any) => c.id));
//     return courses.some((course: any) => course.id === courseId);
//   } catch (error: any) {
//     console.error('Error verifying teacher course:', error.message);
//     throw new Error('Failed to verify teacher authorization from user service');
//   }
// }
// // Main session creation with token auth
// export async function createAttendanceSession(
//   teacherId: string,
//   data: CreateSessionData,
//   token?: string
// ) {
//   // Verify teacher teaches the course (with token forward)
//   const isAuthorized = await verifyTeacherCourse(teacherId, data.courseId, token);
//   if (!isAuthorized) {
//     throw new Error('Unauthorized: You do not teach this course');
//   }
//   // Generate unique QR code
//   const qrData = `${data.courseId}_${teacherId}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
//   const qrCode = generateQRCode(qrData);
//   // Set QR expiry—allow fractional minutes
//   const qrValidityMinutes = data.qrValidityMinutes || 0.5;
//   const qrExpiresAt = new Date(Date.now() + qrValidityMinutes * 60 * 1000);
//   // Create session
//   const session = await prisma.attendanceSession.create({
//     data: {
//       teacherId,
//       courseId: data.courseId,
//       sessionStartTime: new Date(data.sessionStartTime),
//       sessionEndTime: new Date(data.sessionEndTime),
//       qrCode,
//       qrExpiresAt,
//       location: data.location,
//       remarks: data.remarks,
//       status: 'ACTIVE'
//     }
//   });
//   console.log(`[DEBUG] Created attendance session ${session.id} for course ${data.courseId}`);
//   // Get enrolled students (token forwarded!)
//   const students = await getStudentsForCourse(data.courseId, token);
//   if (students.length === 0) {
//     console.warn(`No students enrolled in course ${data.courseId}`);
//   } else {
//     // DEBUG: Log all IDs that will be used in attendance records
//     console.log(`[DEBUG] Creating AttendanceRecords for these studentIds:`, students.map((s:any) => s.id || s.userId));
//   }
//   // Create attendance record
//   if (students.length > 0) {
//     await prisma.attendanceRecord.createMany({
//       data: students.map((student: any) => {
//         const usedId = student.id || student.userId;
//         // DEBUG: Per-record logging (optional)
//         console.log(`[DEBUG] AttendanceRecord for studentId:`, usedId, 'enrollmentNumber:', student.enrollmentNumber);
//         return ({
//           sessionId: session.id,
//           studentId: usedId,
//           enrollmentNumber: student.enrollmentNumber,
//           status: 'ABSENT',
//         });
//       })
//     });
//   }
//   return session;
// }
// // Other session functions are unchanged
// // Other session functions (unchanged)
// export async function getTeacherSessions(teacherId: string) {
//   return await prisma.attendanceSession.findMany({
//     where: { teacherId },
//     include: {
//       _count: {
//         select: { attendanceRecords: true }
//       }
//     },
//     orderBy: { createdAt: 'desc' }
//   });
// }
// export async function getSessionDetails(sessionId: string) {
//   const session = await prisma.attendanceSession.findUnique({
//     where: { id: sessionId },
//     include: {
//       attendanceRecords: {
//         orderBy: { status: 'asc' }
//       }
//     }
//   });
//   if (!session) {
//     throw new Error('Session not found');
//   }
//   return session;
// }


// export async function expireSession(sessionId: string, teacherId: string) {
//   // Verify teacher owns this session
//   const session = await prisma.attendanceSession.findUnique({
//     where: { id: sessionId }
//   });
//   if (!session) {
//     throw new Error('Session not found');
//   }
//   if (session.teacherId !== teacherId) {
//     throw new Error('Unauthorized: This is not your session');
//   }
//   return await prisma.attendanceSession.update({
//     where: { id: sessionId },
//     data: { status: 'EXPIRED' }
//   });
// }
