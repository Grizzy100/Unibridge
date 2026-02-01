
//server/attendance-service/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  sub?: string;
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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const token = authHeader.substring(7);
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not set');
    }



    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    console.log('Decoded JWT payload:', decoded);
    
    req.user = {
      userId: decoded.userId || decoded.sub || '',
      email: decoded.email,
      role: decoded.role,
    };
    if (!req.user.userId) {
      return res.status(401).json({ success: false, message: 'Invalid token payload: missing userId' });
    }
    next();
  } catch (err: any) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
