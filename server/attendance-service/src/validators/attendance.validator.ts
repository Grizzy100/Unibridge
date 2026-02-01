
//server/attendance-service/src/validators/attendance.validator.ts
import { z } from 'zod';
export const markAttendanceSchema = z.object({
  qrCode: z.string().min(1, 'QR code is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});
export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;
