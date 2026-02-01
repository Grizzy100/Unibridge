
//server\attendance-service\src\events\connection.ts
import amqp from 'amqplib';

class RabbitMQConnection {
  private static instance: RabbitMQConnection;
  private connection: any = null;
  private channel: any = null;
  private readonly exchangeName = 'unibridge.events';
  private readonly queueName = 'attendance-service-queue';
  private isConnecting = false;

  private constructor() {}

  static getInstance(): RabbitMQConnection {
    if (!RabbitMQConnection.instance) {
      RabbitMQConnection.instance = new RabbitMQConnection();
    }
    return RabbitMQConnection.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      const rabbitMQUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
      
      this.connection = await amqp.connect(rabbitMQUrl);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange(this.exchangeName, 'topic', {
        durable: true,
      });

      await this.channel.assertQueue(this.queueName, { durable: true });

      await this.channel.bindQueue(this.queueName, this.exchangeName, 'user.*');
      await this.channel.bindQueue(this.queueName, this.exchangeName, 'outpass.*');

      console.log('✅ [RabbitMQ] Attendance Service connected');

      this.connection.on('error', (err: any) => {
        console.error('[RabbitMQ] Connection error:', err);
        this.reconnect();
      });

      this.connection.on('close', () => {
        console.warn('[RabbitMQ] Connection closed, reconnecting...');
        this.reconnect();
      });
    } catch (error) {
      console.error('[RabbitMQ] Connection failed:', error);
      this.reconnect();
    } finally {
      this.isConnecting = false;
    }
  }

  private reconnect(): void {
    this.connection = null;
    this.channel = null;
    setTimeout(() => {
      this.connect().catch(console.error);
    }, 5000);
  }

  getChannel(): any {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }
    return this.channel;
  }

  getExchangeName(): string {
    return this.exchangeName;
  }

  getQueueName(): string {
    return this.queueName;
  }
}

export default RabbitMQConnection;

