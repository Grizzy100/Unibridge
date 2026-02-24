
// server/notification-service/src/utils/rabbitmq.ts
import amqp from 'amqplib';

let connection: any = null;
let channel: any = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const EXCHANGE_NAME = 'unibridge.events';

// Holds all consumer registrations so they can be replayed after a reconnect
type ConsumerRegistration = {
  queueName: string;
  routingKeys: string[];
  handler: (routingKey: string, data: any) => Promise<void>;
};
const registeredConsumers: ConsumerRegistration[] = [];

export async function connectRabbitMQ(): Promise<void> {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    console.log('✅ RabbitMQ connected (notification-service)');

    connection.on('error', (err: Error) => {
      console.error('RabbitMQ connection error:', err.message);
    });

    connection.on('close', () => {
      console.log('RabbitMQ connection closed — reconnecting in 5s...');
      connection = null;
      channel = null;
      setTimeout(() => reconnectAndRestartConsumers(), 5000);
    });
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    setTimeout(() => reconnectAndRestartConsumers(), 5000);
  }
}

/** Reconnect AND re-bind all previously registered consumers */
async function reconnectAndRestartConsumers(): Promise<void> {
  await connectRabbitMQ();
  if (!channel) return; // still not connected — will retry via the close handler

  console.log(`🔄 Restarting ${registeredConsumers.length} consumer(s) after reconnect...`);
  for (const reg of registeredConsumers) {
    await bindAndConsume(reg);
  }
}

async function bindAndConsume(reg: ConsumerRegistration): Promise<void> {
  const { queueName, routingKeys, handler } = reg;
  try {
    await channel.assertQueue(queueName, { durable: true });
    for (const routingKey of routingKeys) {
      await channel.bindQueue(queueName, EXCHANGE_NAME, routingKey);
      console.log(`🔗 Bound queue ${queueName} → ${routingKey}`);
    }
    channel.consume(
      queueName,
      async (msg: any) => {
        if (!msg) return;
        try {
          const data = JSON.parse(msg.content.toString());
          const routingKey = msg.fields.routingKey;
          console.log(`📥 Received event: ${routingKey}`);
          await handler(routingKey, data);
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          channel.nack(msg, false, false); // discard — don't requeue indefinitely
        }
      },
      { noAck: false }
    );
    console.log(`✅ Consuming events from queue: ${queueName}`);
  } catch (error) {
    console.error(`Error setting up consumer for ${queueName}:`, error);
  }
}

export async function consumeEvents(
  queueName: string,
  routingKeys: string[],
  handler: (routingKey: string, data: any) => Promise<void>
): Promise<void> {
  // Save registration so it survives reconnects
  const reg: ConsumerRegistration = { queueName, routingKeys, handler };
  registeredConsumers.push(reg);

  if (!channel) {
    console.error(`RabbitMQ channel not ready — consumer for "${queueName}" will bind on next connect.`);
    return;
  }
  await bindAndConsume(reg);
}

export async function closeRabbitMQ(): Promise<void> {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log('RabbitMQ connection closed');
  } catch (error) {
    console.error('Error closing RabbitMQ:', error);
  }
}
