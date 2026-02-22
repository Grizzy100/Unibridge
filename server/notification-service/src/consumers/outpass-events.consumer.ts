
// //server\notification-service\src\consumers\outpass-events.consumer.ts
// import { consumeEvents } from '../utils/rabbitmq.js';
// import { createNotification } from '../services/notification.service.js';
// import {
//   sendOutpassCreatedEmail,
//   sendOutpassWardenApprovedEmail,
//   sendOutpassWardenRejectedEmail,
//   sendOutpassCancelledEmail,
// } from '../services/outpass-email.service.js';
// import { getAllWardenUserIds, getParentsByStudentId, getStudentById } from '../services/user.service.js';
// export async function startOutpassEventsConsumer() {
//   const queueName = 'notification.outpass.queue';
//   const routingKeys = [
//     'outpass.created',
//     'outpass.parent.approved',
//     'outpass.parent.rejected',
//     'outpass.warden.approved',
//     'outpass.warden.rejected',
//     'outpass.cancelled',
//   ];
//   await consumeEvents(queueName, routingKeys, async (routingKey, data) => {
//     try {
//       if (routingKey === 'outpass.created') {
//         await handleOutpassCreated(data);
//       } else if (routingKey === 'outpass.parent.approved') {
//         await handleParentApproved(data);
//       } else if (routingKey === 'outpass.parent.rejected') {
//         await handleParentRejected(data);
//       } else if (routingKey === 'outpass.warden.approved') {
//         await handleWardenApproved(data);
//       } else if (routingKey === 'outpass.warden.rejected') {
//         await handleWardenRejected(data);
//       } else if (routingKey === 'outpass.cancelled') {
//         await handleOutpassCancelled(data);
//       }
//     } catch (error) {
//       console.error(`Error handling ${routingKey}:`, error);
//     }
//   });
// }
// // 1. Student creates outpass → Email to parent
// async function handleOutpassCreated(data: any) {
//   console.log('Processing outpass created:', data);
//   const { outpassId, studentId, type, reason, outgoingDate, returningDate } = data;
//   // Get student details and parents
//   const student = await getStudentById(studentId);
//   const parents = await getParentsByStudentId(studentId);
//   if (!student) {
//     console.error('Student not found');
//     return;
//   }
//   const studentName = `${student.firstName} ${student.lastName}`;
//   // Send email to all parents
//   if (parents && parents.length > 0) {
//     for (const parent of parents) {
//       await sendOutpassCreatedEmail(
//         parent.email,
//         `${parent.firstName} ${parent.lastName}`,
//         studentName,
//         type,
//         reason,
//         outgoingDate,
//         returningDate
//       );
//     }
//   }
//   console.log('✅ Outpass created emails sent');
// }
// // 2. Parent approves → In-app for student + warden
// async function handleParentApproved(data: any) {
//   console.log('✅ Processing parent approval:', data);
//   const { outpassId, studentId, type, outgoingDate, returningDate } = data;
//   // Get student details
//   const student = await getStudentById(studentId);
//   const studentName = student ? `${student.firstName} ${student.lastName}` : 'Student';
//   // Notification to student
//   await createNotification(
//     student.userId,
//     'OUTPASS_PARENT_APPROVED',
//     '✅ Parent Approved Your Outpass',
//     `Your ${type} outpass has been approved by your parent. Awaiting warden approval.`,
//     {
//       outpassId,
//       type,
//       outgoingDate,
//       returningDate,
//     }
//   );
//   // Notifications to all wardens
//   const wardenUserIds = await getAllWardenUserIds();
//   for (const wardenUserId of wardenUserIds) {
//     await createNotification(
//       wardenUserId,
//       'OUTPASS_PARENT_APPROVED',
//       '📋 New Outpass Pending Approval',
//       `${studentName} has an outpass approved by parent. Please review and approve/reject.`,
//       {
//         outpassId,
//         studentId,
//         type,
//         outgoingDate,
//         returningDate,
//       }
//     );
//   }
//   console.log('✅ Parent approval notifications sent');
// }
// // 3. Parent rejects → In-app for student
// async function handleParentRejected(data: any) {
//   console.log('❌ Processing parent rejection:', data);
//   const { outpassId, studentId, type } = data;
//   // Get student details
//   const student = await getStudentById(studentId);
//   if (!student) {
//     console.error('Student not found');
//     return;
//   }
//   // Notification to student
//   await createNotification(
//     student.userId,
//     'OUTPASS_PARENT_REJECTED',
//     '❌ Outpass Rejected by Parent',
//     `Your ${type} outpass has been rejected by your parent.`,
//     {
//       outpassId,
//       type,
//     }
//   );
//   console.log('✅ Parent rejection notification sent');
// }
// // 4. Warden approves → In-app for student + email to parent
// async function handleWardenApproved(data: any) {
//   console.log('✅ Processing warden approval:', data);
//   const { outpassId, studentId, type, outgoingDate, returningDate } = data;
//   // Get student details and parents
//   const student = await getStudentById(studentId);
//   const parents = await getParentsByStudentId(studentId);
//   if (!student) {
//     console.error('Student not found');
//     return;
//   }
//   const studentName = `${student.firstName} ${student.lastName}`;
//   // Notification to student
//   await createNotification(
//     student.userId,
//     'OUTPASS_WARDEN_APPROVED',
//     '✅ Outpass Approved by Warden',
//     `Your ${type} outpass has been approved. You can leave campus as per the approved schedule.`,
//     {
//       outpassId,
//       type,
//       outgoingDate,
//       returningDate,
//     }
//   );
//   // Email to parents
//   if (parents && parents.length > 0) {
//     for (const parent of parents) {
//       await sendOutpassWardenApprovedEmail(
//         parent.email,
//         `${parent.firstName} ${parent.lastName}`,
//         studentName,
//         type,
//         outgoingDate,
//         returningDate
//       );
//     }
//   }
//   console.log('✅ Warden approval notifications sent');
// }
// // 5. Warden rejects → In-app for student + email to parent
// async function handleWardenRejected(data: any) {
//   console.log('❌ Processing warden rejection:', data);
//   const { outpassId, studentId, type, comment } = data;
//   // Get student details and parents
//   const student = await getStudentById(studentId);
//   const parents = await getParentsByStudentId(studentId);
//   if (!student) {
//     console.error('Student not found');
//     return;
//   }
//   const studentName = `${student.firstName} ${student.lastName}`;
//   // Notification to student
//   await createNotification(
//     student.userId,
//     'OUTPASS_WARDEN_REJECTED',
//     '❌ Outpass Rejected by Warden',
//     comment
//       ? `Your ${type} outpass has been rejected. Reason: ${comment}`
//       : `Your ${type} outpass has been rejected by the warden.`,
//     {
//       outpassId,
//       type,
//       comment,
//     }
//   );
//   // Email to parents
//   if (parents && parents.length > 0) {
//     for (const parent of parents) {
//       await sendOutpassWardenRejectedEmail(
//         parent.email,
//         `${parent.firstName} ${parent.lastName}`,
//         studentName,
//         type,
//         comment
//       );
//     }
//   }
//   console.log('✅ Warden rejection notifications sent');
// }
// // 6. Student cancels → Email to parent
// async function handleOutpassCancelled(data: any) {
//   console.log('🔄 Processing outpass cancellation:', data);
//   const { outpassId, studentId, type } = data;
//   // Get student details and parents
//   const student = await getStudentById(studentId);
//   const parents = await getParentsByStudentId(studentId);
//   if (!student) {
//     console.error('Student not found');
//     return;
//   }
//   const studentName = `${student.firstName} ${student.lastName}`;
//   // Email to parents
//   if (parents && parents.length > 0) {
//     for (const parent of parents) {
//       await sendOutpassCancelledEmail(
//         parent.email,
//         `${parent.firstName} ${parent.lastName}`,
//         studentName,
//         type
//       );
//     }
//   }
//   console.log('✅ Outpass cancellation emails sent');
// }







// server/notification-service/src/consumers/outpass-events.consumer.ts
import { consumeEvents } from '../utils/rabbitmq.js';
import { createNotification } from '../services/notification.service.js';
import {
  sendOutpassCreatedEmail,
  sendOutpassWardenApprovedEmail,
  sendOutpassWardenRejectedEmail,
  sendOutpassCancelledEmail,
} from '../services/outpass-email.service.js';
import {
  getAllWardenUserIds,
  getParentsByStudentId,
  getStudentById,
} from '../services/user.service.js';

export async function startOutpassEventsConsumer() {
  const queueName = 'notification.outpass.queue';

  const routingKeys = [
    'outpass.created',
    'outpass.parent.approved',
    'outpass.parent.rejected',
    'outpass.warden.approved',
    'outpass.warden.rejected',
    'outpass.cancelled',
  ];

  await consumeEvents(queueName, routingKeys, async (routingKey, data) => {
    try {
      switch (routingKey) {
        case 'outpass.created':
          await handleOutpassCreated(data);
          break;
        case 'outpass.parent.approved':
          await handleParentApproved(data);
          break;
        case 'outpass.parent.rejected':
          await handleParentRejected(data);
          break;
        case 'outpass.warden.approved':
          await handleWardenApproved(data);
          break;
        case 'outpass.warden.rejected':
          await handleWardenRejected(data);
          break;
        case 'outpass.cancelled':
          await handleOutpassCancelled(data);
          break;
      }
    } catch (error) {
      console.error(`❌ Error handling ${routingKey}:`, error);
    }
  });
}

/**
 * Helpers
 */
async function resolveStudent(studentProfileId: string) {
  const student = await getStudentById(studentProfileId);
  if (!student?.userId) {
    console.error('❌ Invalid student mapping:', studentProfileId);
    return null;
  }
  return student;
}

/**
 * 1. Student creates outpass → email parents
 */
async function handleOutpassCreated(data: any) {
  const { studentId: studentProfileId, type, reason, outgoingDate, returningDate } = data;

  const student = await resolveStudent(studentProfileId);
  if (!student) return;

  const parents = await getParentsByStudentId(studentProfileId);
  const studentName = `${student.firstName} ${student.lastName}`;

  for (const parent of parents) {
    await sendOutpassCreatedEmail(
      parent.email,
      `${parent.firstName} ${parent.lastName}`,
      studentName,
      type,
      reason,
      outgoingDate,
      returningDate
    );
  }

  console.log('✅ Outpass created emails sent');
}

/**
 * 2. Parent approved → notify student + wardens
 */
async function handleParentApproved(data: any) {
  const { outpassId, studentId: studentProfileId, type, outgoingDate, returningDate } = data;

  const student = await resolveStudent(studentProfileId);
  if (!student) return;

  const studentName = `${student.firstName} ${student.lastName}`;

  await createNotification(
    student.userId,
    'OUTPASS_PARENT_APPROVED',
    '✅ Parent Approved Your Outpass',
    `Your ${type} outpass has been approved by your parent. Awaiting warden approval.`,
    { outpassId, type, outgoingDate, returningDate }
  );

  const wardens = await getAllWardenUserIds();
  for (const wardenUserId of wardens) {
    await createNotification(
      wardenUserId,
      'OUTPASS_PARENT_APPROVED',
      '📋 New Outpass Pending Approval',
      `${studentName} has an outpass pending your approval.`,
      { outpassId, studentProfileId, type }
    );
  }
}

/**
 * 3. Parent rejected → notify student
 */
async function handleParentRejected(data: any) {
  const { outpassId, studentId: studentProfileId, type } = data;

  const student = await resolveStudent(studentProfileId);
  if (!student) return;

  await createNotification(
    student.userId,
    'OUTPASS_PARENT_REJECTED',
    '❌ Outpass Rejected by Parent',
    `Your ${type} outpass has been rejected by your parent.`,
    { outpassId, type }
  );
}

/**
 * 4. Warden approved → notify student + email parents
 */
async function handleWardenApproved(data: any) {
  const { outpassId, studentId: studentProfileId, type, outgoingDate, returningDate } = data;

  const student = await resolveStudent(studentProfileId);
  if (!student) return;

  const parents = await getParentsByStudentId(studentProfileId);
  const studentName = `${student.firstName} ${student.lastName}`;

  await createNotification(
    student.userId,
    'OUTPASS_WARDEN_APPROVED',
    '✅ Outpass Approved',
    `Your ${type} outpass has been approved by the warden.`,
    { outpassId, type, outgoingDate, returningDate }
  );

  for (const parent of parents) {
    await sendOutpassWardenApprovedEmail(
      parent.email,
      `${parent.firstName} ${parent.lastName}`,
      studentName,
      type,
      outgoingDate,
      returningDate
    );
  }
}

/**
 * 5. Warden rejected → notify student + email parents
 */
async function handleWardenRejected(data: any) {
  const { outpassId, studentId: studentProfileId, type, comment } = data;

  const student = await resolveStudent(studentProfileId);
  if (!student) return;

  const parents = await getParentsByStudentId(studentProfileId);
  const studentName = `${student.firstName} ${student.lastName}`;

  await createNotification(
    student.userId,
    'OUTPASS_WARDEN_REJECTED',
    '❌ Outpass Rejected',
    comment
      ? `Reason: ${comment}`
      : `Your ${type} outpass has been rejected by the warden.`,
    { outpassId, type, comment }
  );

  for (const parent of parents) {
    await sendOutpassWardenRejectedEmail(
      parent.email,
      `${parent.firstName} ${parent.lastName}`,
      studentName,
      type,
      comment
    );
  }
}

/**
 * 6. Student cancelled → email parents
 */
async function handleOutpassCancelled(data: any) {
  const { studentId: studentProfileId, type } = data;

  const student = await resolveStudent(studentProfileId);
  if (!student) return;

  const parents = await getParentsByStudentId(studentProfileId);
  const studentName = `${student.firstName} ${student.lastName}`;

  for (const parent of parents) {
    await sendOutpassCancelledEmail(
      parent.email,
      `${parent.firstName} ${parent.lastName}`,
      studentName,
      type
    );
  }
}
