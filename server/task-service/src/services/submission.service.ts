
//server/task-service/src/services/submission.service.ts
import { getPrisma } from '../utils/prisma.js';
import { getStudentProfileIdFromUserId, getTeacherCourses, getStudentCourses } from './user.service.js';
import { v2 as cloudinary } from 'cloudinary';
import {
  publishTaskGraded,
  publishDeadlineExtended,
  publishResubmissionGranted,
} from '../events/task-events.publisher.js';
function extractPublicId(url: string): string {
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  const filename = lastPart.split('.')[0];
  return `unibridge/tasks/${filename}`;
}
export async function submitTask(
  studentUserId: string,
  taskId: string,
  fileInfo: { url: string; mimeType: string; comment?: string },
  token?: string
) {
  const prisma = getPrisma();
  const studentProfileId = await getStudentProfileIdFromUserId(studentUserId, token);
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error('Task not found');
  const studentCourses = await getStudentCourses(studentUserId, token);
  const isEnrolled = studentCourses.some(c => c.id === task.courseId);
  if (!isEnrolled) {
    throw new Error('You are not enrolled in this course');
  }
  const now = new Date();
  const existing = await prisma.taskSubmission.findUnique({
    where: { taskId_studentId: { taskId, studentId: studentProfileId } },
  });
  if (existing && existing.status !== 'RESUBMITTING') {
    throw new Error(
      'You have already submitted this task. Contact your teacher if you need to resubmit.'
    );
  }
  if (existing?.answerFileUrl) {
    try {
      const publicId = extractPublicId(existing.answerFileUrl);
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      console.log(`Deleted old file: ${publicId}`);
    } catch (err) {
      console.error('Cloudinary cleanup failed:', err);
    }
  }
  const effectiveDue = existing?.customDueDate ?? task.dueDate;
  const isLate = now > effectiveDue;
  const status = isLate ? 'LATE' : 'SUBMITTED';
  const submission = await prisma.taskSubmission.upsert({
    where: { taskId_studentId: { taskId, studentId: studentProfileId } },
    update: {
      submittedAt: now,
      answerFileUrl: fileInfo.url,
      answerFileType: fileInfo.mimeType,
      comment: fileInfo.comment ?? null,
      status,
      attemptCount: { increment: 1 },
      marks: null,
      feedback: null,
      gradedAt: null,
    },
    create: {
      taskId,
      studentId: studentProfileId,
      submittedAt: now,
      answerFileUrl: fileInfo.url,
      answerFileType: fileInfo.mimeType,
      comment: fileInfo.comment ?? null,
      status,
      attemptCount: 1,
    },
  });
  return submission;
}
export async function extendSubmissionDeadline(
  taskId: string,
  studentProfileId: string,
  newDueDate: Date
) {
  const prisma = getPrisma();
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error('Task not found');
  const existing = await prisma.taskSubmission.findUnique({
    where: { taskId_studentId: { taskId, studentId: studentProfileId } }
  });
  if (existing?.status === 'GRADED') {
    throw new Error('Cannot extend deadline after grading. Use allow-resubmission instead.');
  }
  const oldDueDate = existing?.customDueDate ?? task.dueDate;
  const updated = await prisma.taskSubmission.upsert({
    where: { taskId_studentId: { taskId, studentId: studentProfileId } },
    update: { customDueDate: newDueDate },
    create: { taskId, studentId: studentProfileId, customDueDate: newDueDate },
  });
  try {
    await publishDeadlineExtended({
      taskId: task.id,
      studentId: studentProfileId,
      taskTitle: task.title,
      oldDueDate: oldDueDate,
      newDueDate: newDueDate,
    });
  } catch (error) {
    console.error('Failed to publish deadline.extended event:', error);
  }
  return updated;
}
export async function allowResubmission(
  teacherUserId: string,
  taskId: string,
  studentProfileId: string,
  token?: string
) {
  const prisma = getPrisma();
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error('Task not found');
  const courses = await getTeacherCourses(teacherUserId, token);
  const teaches = courses.some(c => c.id === task.courseId);
  if (!teaches) throw new Error('You are not assigned to this course');
  const submission = await prisma.taskSubmission.findUnique({
    where: { taskId_studentId: { taskId, studentId: studentProfileId } },
  });
  if (!submission) {
    throw new Error('Student has not submitted this task yet');
  }
  const updated = await prisma.taskSubmission.update({
    where: { taskId_studentId: { taskId, studentId: studentProfileId } },
    data: { status: 'RESUBMITTING' },
  });
  try {
    await publishResubmissionGranted({
      taskId: task.id,
      studentId: studentProfileId,
      taskTitle: task.title,
    });
  } catch (error) {
    console.error('Failed to publish resubmission.granted event:', error);
  }
  return updated;
}
export async function gradeSubmission(
  teacherUserId: string,
  taskId: string,
  studentProfileId: string,
  data: { marks: number; feedback?: string },
  token?: string
) {
  const prisma = getPrisma();
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error('Task not found');
  const courses = await getTeacherCourses(teacherUserId, token);
  const teaches = courses.some(c => c.id === task.courseId);
  if (!teaches) throw new Error('You are not assigned to this course');
  if (data.marks < 0 || data.marks > 5) {
    throw new Error('Marks must be between 0 and 5');
  }
  const submission = await prisma.taskSubmission.update({
    where: { taskId_studentId: { taskId, studentId: studentProfileId } },
    data: {
      status: 'GRADED',
      marks: data.marks,
      feedback: data.feedback ?? null,
      gradedAt: new Date(),
    },
  });
  try {
    await publishTaskGraded({
      taskId: task.id,
      submissionId: submission.id,
      studentId: studentProfileId,
      marks: data.marks,
      feedback: data.feedback,
      taskTitle: task.title,
    });
  } catch (error) {
    console.error('Failed to publish task.graded event:', error);
  }
  return submission;
}




export async function getSubmissionsForTask(
  teacherUserId: string,
  taskId: string,
  token?: string
) {
  const prisma = getPrisma();

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error('Task not found');

  const courses = await getTeacherCourses(teacherUserId, token);
  const teaches = courses.some(c => c.id === task.courseId);
  if (!teaches) throw new Error('You are not assigned to this course');

  return prisma.taskSubmission.findMany({
  where: { taskId },
    select: {
      id: true,
      taskId: true,
      studentId: true,
      status: true,
      submittedAt: true,
      attemptCount: true,
      marks: true,
      feedback: true,
      gradedAt: true,
      answerFileUrl: true,
      answerFileType: true,
      comment: true,
      customDueDate: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  })
;
}

