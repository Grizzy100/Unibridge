
//server/attendance-service/src/events/publishers/attendanceMarked.publisher.ts
import RabbitMQConnection from '../connection.js';
export async function publishAttendanceMarked(data: {
  studentId: string;
  sessionId: string;
  courseId: string;
  status: 'PRESENT' | 'ABSENT';
  markedAt: Date;
}): Promise<void> {
  try {
    const rmq = RabbitMQConnection.getInstance();
    const channel = rmq.getChannel();
    const exchange = rmq.getExchangeName();
    const message = Buffer.from(JSON.stringify({
      ...data,
      timestamp: new Date(),
      service: 'attendance-service'
    }));
    channel.publish(exchange, 'attendance.marked', message, {
      persistent: true,
      contentType: 'application/json',
    });
    console.log('[Event] Published: attendance.marked', data.studentId);
  } catch (error) {
    console.error('[Event] Failed to publish attendance.marked:', error);
  }
}





