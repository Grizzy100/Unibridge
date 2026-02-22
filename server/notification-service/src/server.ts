
//server/notification-service/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notificationRoutes from './routes/notification.routes.js';
import { connectRabbitMQ, closeRabbitMQ } from './utils/rabbitmq.js';
import { startAttendanceEventsConsumer } from './consumers/attendance-events.consumer.js';
import { startOutpassEventsConsumer } from './consumers/outpass-events.consumer.js';
import { startTaskEventsConsumer } from './consumers/task-events.consumer.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3008;
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/notifications', notificationRoutes);
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'notification-service' });
});
async function bootstrap() {
  await connectRabbitMQ();
  await startAttendanceEventsConsumer();
  await startOutpassEventsConsumer();
  await startTaskEventsConsumer();
}
bootstrap().catch(console.error);
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await closeRabbitMQ();
  process.exit(0);
});
app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
export default app;
