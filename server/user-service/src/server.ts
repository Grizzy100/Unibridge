
//server/user-service/src/server.ts  
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';
import profileRoutes from './routes/profile.routes.js';
import parentStudentRoutes from './routes/parentStudent.routes.js';
import userRoutes from './routes/user.routes.js';
import emailRoutes from './routes/email.routes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api', courseRoutes);  // Course management routes
app.use('/api/profile', profileRoutes);
app.use('/api/parent-student', parentStudentRoutes);
app.use('/api/users', userRoutes);      
app.use('/api', emailRoutes);
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'user-service' });
});
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
export default app;
