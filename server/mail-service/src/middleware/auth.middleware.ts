
//server/mail-service/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'
import { UnauthorizedError } from '../utils/errors.js'
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided')
    }
    const token = authHeader.split(' ')[1]
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any
      // ✅ Support both 'userId' and 'id' from JWT
      req.user = {
        userId: decoded.userId || decoded.id || decoded.sub,
        email: decoded.email,
        role: decoded.role,
      }
      console.log('✅ Authenticated user:', req.user.userId)
      next()
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedError('Invalid token')
      } else if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token expired')
      }
      throw error
    }
  } catch (error) {
    next(error)
  }
}
