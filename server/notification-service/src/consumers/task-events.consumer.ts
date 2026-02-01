
//server/notification-service/src/consumers/task-events.consumer.ts
import { consumeEvents } from '../utils/rabbitmq.js';
import { createNotification } from '../services/notification.service.js';
import { getEnrolledStudents } from '../services/course.service.js';
import { getStudentById } from '../services/user.service.js';
export async function startTaskEventsConsumer() {
  const queueName = 'notification.task.queue';
  const routingKeys = [
    'task.created',
    'task.graded',
    'task.deadline.extended',
    'task.resubmission.granted',
  ];
  await consumeEvents(queueName, routingKeys, async (routingKey, data) => {
    try {
      if (routingKey === 'task.created') {
        await handleTaskCreated(data);
      } else if (routingKey === 'task.graded') {
        await handleTaskGraded(data);
      } else if (routingKey === 'task.deadline.extended') {
        await handleDeadlineExtended(data);
      } else if (routingKey === 'task.resubmission.granted') {
        await handleResubmissionGranted(data);
      }
    } catch (error) {
      console.error(`Error handling ${routingKey}:`, error);
    }
  });
}
async function handleTaskCreated(data: any) {
  console.log('📝 Processing task created:', data);
  const { taskId, courseId, title, description, dueDate, maxMarks } = data;
  const enrollments = await getEnrolledStudents(courseId);
  if (!enrollments || enrollments.length === 0) {
    console.log('No students enrolled in this course');
    return;
  }
  for (const enrollment of enrollments) {
    try {
      const studentUserId = enrollment.student.userId;
      if (!studentUserId) {
        console.error(`Student userId not found for enrollment: ${enrollment.id}`);
        continue;
      }
      await createNotification(
        studentUserId,
        'TASK_CREATED',
        '📝 New Task Assigned',
        `${title} - Due: ${new Date(dueDate).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        {
          taskId,
          courseId,
          title,
          description,
          dueDate,
          maxMarks,
        }
      );
    } catch (error) {
      console.error(`Failed to create notification for student ${enrollment.studentId}:`, error);
    }
  }
  console.log(`✅ Task created notifications sent to ${enrollments.length} students`);
}
async function handleTaskGraded(data: any) {
  console.log('✅ Processing task graded:', data);
  const { taskId, submissionId, studentId, marks, feedback, taskTitle } = data;
  const student = await getStudentById(studentId);
  if (!student || !student.userId) {
    console.error('Student not found or userId missing');
    return;
  }
  await createNotification(
    student.userId,
    'TASK_GRADED',
    '✅ Task Graded',
    `Your submission for "${taskTitle}" has been graded: ${marks}/5${
      feedback ? ` - ${feedback}` : ''
    }`,
    {
      taskId,
      submissionId,
      marks,
      feedback,
      taskTitle,
    }
  );
  console.log('✅ Task graded notification sent');
}
async function handleDeadlineExtended(data: any) {
  console.log('📅 Processing deadline extended:', data);
  const { taskId, studentId, taskTitle, oldDueDate, newDueDate } = data;
  const student = await getStudentById(studentId);
  if (!student || !student.userId) {
    console.error('Student not found or userId missing');
    return;
  }
  await createNotification(
    student.userId,
    'TASK_DEADLINE_EXTENDED',
    '📅 Deadline Extended',
    `Deadline extended for "${taskTitle}" - New due: ${new Date(newDueDate).toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    )}`,
    {
      taskId,
      taskTitle,
      oldDueDate,
      newDueDate,
    }
  );
  console.log('✅ Deadline extended notification sent');
}
async function handleResubmissionGranted(data: any) {
  console.log('🔄 Processing resubmission granted:', data);
  const { taskId, studentId, taskTitle } = data;
  const student = await getStudentById(studentId);
  if (!student || !student.userId) {
    console.error('Student not found or userId missing');
    return;
  }
  await createNotification(
    student.userId,
    'TASK_RESUBMISSION_GRANTED',
    '🔄 Resubmission Allowed',
    `Your teacher has allowed you to resubmit "${taskTitle}". You can now submit a new file.`,
    {
      taskId,
      taskTitle,
    }
  );
  console.log('✅ Resubmission granted notification sent');
}
