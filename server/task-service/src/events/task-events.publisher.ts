
//server/task-service/src/events/task-events.publisher.ts
import { publishEvent } from "../utils/rabbitmq";
export async function publishTaskCreated(data: {
  taskId: string;
  courseId: string;
  teacherId: string;
  title: string;
  description?: string;
  dueDate: Date;
  maxMarks: number;
}) {
  await publishEvent('task.created', {
    taskId: data.taskId,
    courseId: data.courseId,
    teacherId: data.teacherId,
    title: data.title,
    description: data.description,
    dueDate: data.dueDate.toISOString(),
    maxMarks: data.maxMarks,
    timestamp: new Date().toISOString(),
  });
}
export async function publishTaskGraded(data: {
  taskId: string;
  submissionId: string;
  studentId: string;
  marks: number;
  feedback?: string;
  taskTitle: string;
}) {
  await publishEvent('task.graded', {
    taskId: data.taskId,
    submissionId: data.submissionId,
    studentId: data.studentId,
    marks: data.marks,
    feedback: data.feedback,
    taskTitle: data.taskTitle,
    timestamp: new Date().toISOString(),
  });
}
export async function publishDeadlineExtended(data: {
  taskId: string;
  studentId: string;
  taskTitle: string;
  oldDueDate: Date;
  newDueDate: Date;
}) {
  await publishEvent('task.deadline.extended', {
    taskId: data.taskId,
    studentId: data.studentId,
    taskTitle: data.taskTitle,
    oldDueDate: data.oldDueDate.toISOString(),
    newDueDate: data.newDueDate.toISOString(),
    timestamp: new Date().toISOString(),
  });
}
export async function publishResubmissionGranted(data: {
  taskId: string;
  studentId: string;
  taskTitle: string;
}) {
  await publishEvent('task.resubmission.granted', {
    taskId: data.taskId,
    studentId: data.studentId,
    taskTitle: data.taskTitle,
    timestamp: new Date().toISOString(),
  });
}
