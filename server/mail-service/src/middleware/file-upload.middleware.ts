
//server/mail-service/src/middleware/file-upload.middleware.ts
import multer from 'multer'
import { config } from '../config/index.js'
import { ValidationError } from '../utils/errors.js'
const storage = multer.memoryStorage()
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
  ]
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new ValidationError(`File type not allowed: ${file.mimetype}`), false)
  }
}
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSizeBytes,
    files: config.upload.maxFiles,
  },
}).array('attachments', config.upload.maxFiles)
