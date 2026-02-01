
// server/outpass-service/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import outpassRoutes from './routes/outpass.routes.js';
import { connectRabbitMQ, closeRabbitMQ } from './utils/rabbitmq.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3003;
// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/outpass', outpassRoutes);
// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'outpass-service' });
});
async function bootstrap() {
  try {
    await connectRabbitMQ();
    console.log('RabbitMQ connected');
  } catch (error) {
    console.error('RabbitMQ connection failed:', error);
  }
}
bootstrap().catch(console.error);
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await closeRabbitMQ();
  process.exit(0);
});
app.listen(PORT, () => {
  console.log(`Outpass Service running on port ${PORT}`);
});
export default app;
