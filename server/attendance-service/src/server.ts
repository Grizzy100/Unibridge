
//server/attendance-service/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sessionRoutes from './routes/session.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import { connectRabbitMQ, closeRabbitMQ } from './utils/rabbitmq.js';
import { startWeeklySummaryCron } from './jobs/weekly-summary.job.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3004;
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/sessions', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'attendance-service' });
});
connectRabbitMQ().catch(console.error);
startWeeklySummaryCron();
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await closeRabbitMQ();
  process.exit(0);
});
app.listen(PORT, () => {
  console.log(`Attendance Service running on port ${PORT}`);
});
export default app;
