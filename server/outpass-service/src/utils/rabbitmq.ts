
//server/outpass-service/src/utils/rabbitmq.ts
import amqp from 'amqplib';
let connection: any = null;
let channel: any = null;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const EXCHANGE_NAME = 'unibridge.events';
export async function connectRabbitMQ(): Promise<void> {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    console.log('RabbitMQ connected (outpass-service)');
    connection.on('error', (err: Error) => {
      console.error('RabbitMQ connection error:', err);
    });
    connection.on('close', () => {
      console.log('RabbitMQ connection closed, reconnecting in 5s...');
      connection = null;
      channel = null;
      setTimeout(() => {
        connectRabbitMQ().catch(console.error);
      }, 5000);
    });
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    setTimeout(() => {
      connectRabbitMQ().catch(console.error);
    }, 5000);
  }
}
export async function publishEvent(
  routingKey: string,
  data: any
): Promise<void> {
  if (!channel) {
    console.error('RabbitMQ channel not initialized');
    return;
  }
  try {
    const message = JSON.stringify(data);
    channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(message), {
      persistent: true,
      contentType: 'application/json',
    });
    console.log(`📤 Published event: ${routingKey}`);
  } catch (error) {
    console.error('Error publishing event:', error);
  }
}
export async function closeRabbitMQ(): Promise<void> {
  try {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
    console.log('RabbitMQ connection closed');
  } catch (error) {
    console.error('Error closing RabbitMQ:', error);
  }
}
