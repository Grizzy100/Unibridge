
//server/notification-service/src/utils/rabbitmq.ts
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
    console.log('✅ RabbitMQ connected (notification-service)');
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
export async function consumeEvents(
  queueName: string,
  routingKeys: string[],
  handler: (routingKey: string, data: any) => Promise<void>
): Promise<void> {
  if (!channel) {
    console.error('RabbitMQ channel not initialized');
    return;
  }
  try {
    await channel.assertQueue(queueName, { durable: true });
    for (const routingKey of routingKeys) {
      await channel.bindQueue(queueName, EXCHANGE_NAME, routingKey);
      console.log(`🔗 Bound queue ${queueName} to ${routingKey}`);
    }
    channel.consume(
      queueName,
      async (msg: any) => {
        if (msg) {
          try {
            const data = JSON.parse(msg.content.toString());
            const routingKey = msg.fields.routingKey;
            console.log(`📥 Received event: ${routingKey}`);
            
            await handler(routingKey, data);
            
            channel.ack(msg);
          } catch (error) {
            console.error('Error processing message:', error);
            channel.nack(msg, false, false);
          }
        }
      },
      { noAck: false }
    );
    console.log(`✅ Consuming events from queue: ${queueName}`);
  } catch (error) {
    console.error('Error setting up consumer:', error);
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
