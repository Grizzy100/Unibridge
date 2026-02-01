
//server/task-service/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/task.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import { connectRabbitMQ, closeRabbitMQ } from './utils/rabbitmq.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3005;
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/tasks', taskRoutes);
app.use('/api/submissions', submissionRoutes);
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'task-service' });
});
async function bootstrap() {
  await connectRabbitMQ();
}
bootstrap().catch(console.error);
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await closeRabbitMQ();
  process.exit(0);
});
app.listen(PORT, () => {
  console.log(`Task Service running on port ${PORT}`);
});
export default app;
