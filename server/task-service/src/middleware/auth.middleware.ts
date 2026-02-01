
//server/task-service/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
interface JwtPayload {
  userId?: string;
  sub?: string;
  email: string;
  role: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}
export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const token = auth.substring(7);
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not set');
    const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    const userId = payload.userId || payload.sub || '';
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Invalid token payload: missing userId' });
    }
    req.user = { userId, email: payload.email, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
