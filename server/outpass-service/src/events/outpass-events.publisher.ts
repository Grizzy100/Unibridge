
//server/outpass-service/src/events/outpass-events.publisher.ts
import { publishEvent } from '../utils/rabbitmq.js';
export async function publishOutpassCreated(data: {
  outpassId: string;
  studentId: string;
  type: string;
  reason: string;
  outgoingDate: Date;
  returningDate: Date;
}) {
  await publishEvent('outpass.created', {
    outpassId: data.outpassId,
    studentId: data.studentId,
    type: data.type,
    reason: data.reason,
    outgoingDate: data.outgoingDate.toISOString(),
    returningDate: data.returningDate.toISOString(),
    timestamp: new Date().toISOString(),
  });
}
export async function publishOutpassParentApproved(data: {
  outpassId: string;
  studentId: string;
  type: string;
  outgoingDate: Date;
  returningDate: Date;
}) {
  await publishEvent('outpass.parent.approved', {
    outpassId: data.outpassId,
    studentId: data.studentId,
    type: data.type,
    outgoingDate: data.outgoingDate.toISOString(),
    returningDate: data.returningDate.toISOString(),
    timestamp: new Date().toISOString(),
  });
}
export async function publishOutpassParentRejected(data: {
  outpassId: string;
  studentId: string;
  type: string;
}) {
  await publishEvent('outpass.parent.rejected', {
    outpassId: data.outpassId,
    studentId: data.studentId,
    type: data.type,
    timestamp: new Date().toISOString(),
  });
}
export async function publishOutpassWardenApproved(data: {
  outpassId: string;
  studentId: string;
  type: string;
  outgoingDate: Date;
  returningDate: Date;
}) {
  await publishEvent('outpass.warden.approved', {
    outpassId: data.outpassId,
    studentId: data.studentId,
    type: data.type,
    outgoingDate: data.outgoingDate.toISOString(),
    returningDate: data.returningDate.toISOString(),
    timestamp: new Date().toISOString(),
  });
}
export async function publishOutpassWardenRejected(data: {
  outpassId: string;
  studentId: string;
  type: string;
  comment?: string;
}) {
  await publishEvent('outpass.warden.rejected', {
    outpassId: data.outpassId,
    studentId: data.studentId,
    type: data.type,
    comment: data.comment,
    timestamp: new Date().toISOString(),
  });
}
export async function publishOutpassCancelled(data: {
  outpassId: string;
  studentId: string;
  type: string;
}) {
  await publishEvent('outpass.cancelled', {
    outpassId: data.outpassId,
    studentId: data.studentId,
    type: data.type,
    timestamp: new Date().toISOString(),
  });
}


export async function publishOutpassDeleted(data: {
  outpassId: string;
  studentId: string;
  type: string;
  status: string;
  reason?: string;
  wasActive?: boolean;
}) {
  await publishEvent('outpass.warden.deleted', {
    outpassId: data.outpassId,
    studentId: data.studentId,
    type: data.type,
    status: data.status,
    reason: data.reason,
    wasActive: data.wasActive,
    timestamp: new Date().toISOString(),
  });
}

export async function publishOutpassWardenDeleted(data: {
  outpassId: string;
  studentId: string;
  type: string;
  status: string;
  reason?: string;
}) {
  await publishEvent('outpass.warden.deleted', {
    outpassId: data.outpassId,
    studentId: data.studentId,
    type: data.type,
    status: data.status,
    reason: data.reason || 'Deleted by warden',
    timestamp: new Date().toISOString(),
  });
}

export async function publishOutpassForceDeleted(data: {
  outpassId: string;
  studentId: string;
  type: string;
  status: string;
  wasActive: boolean;
  wardenReason: string;
  outgoingDate: Date;
  returningDate: Date;
}) {
  await publishEvent('outpass.force.deleted', {
    outpassId: data.outpassId,
    studentId: data.studentId,
    type: data.type,
    status: data.status,
    wasActive: data.wasActive,
    wardenReason: data.wardenReason,
    outgoingDate: data.outgoingDate.toISOString(),
    returningDate: data.returningDate.toISOString(),
    timestamp: new Date().toISOString(),
  });
}

