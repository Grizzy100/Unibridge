
//server/mail-service/src/middleware/error-handler.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/errors.js'
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
    })
  }
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      error: `File upload error: ${err.message}`,
      code: 'UPLOAD_ERROR',
    })
  }
  console.error('Unhandled error:', err)
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  })
}
