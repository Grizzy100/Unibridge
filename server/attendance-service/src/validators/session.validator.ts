
//server/attendance-service/src/validators/session.validator.ts
// import { z } from 'zod';
// export const createSessionSchema = z.object({
//   courseId: z.string().min(1, 'Course ID is required'),
//   sessionStartTime: z.string().refine(val => !isNaN(Date.parse(val)), {
//     message: 'Invalid session start time format'
//   }),
//   sessionEndTime: z.string().refine(val => !isNaN(Date.parse(val)), {
//     message: 'Invalid session end time format'
//   }),
//   location: z.string().optional(),
//   remarks: z.string().max(500).optional(),
//   qrValidityMinutes: z.number().min(0.5).max(60).optional().default(0.5) // <-- changed min from 1 to 0.5, default is now 0.5
// }).refine(data => new Date(data.sessionEndTime) > new Date(data.sessionStartTime), {
//   message: 'Session end time must be after start time'
// });
// export type CreateSessionInput = z.infer<typeof createSessionSchema>;



//server/attendance-service/src/validators/session.validator.ts
import { z } from 'zod';

// EXISTING: Keep for backwards compatibility
export const createSessionSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  sessionStartTime: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid session start time format'
  }),
  sessionEndTime: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid session end time format'
  }),
  location: z.string().optional(),
  remarks: z.string().max(500).optional(),
  qrValidityMinutes: z.number().min(0.5).max(60).optional().default(0.5)
}).refine(data => new Date(data.sessionEndTime) > new Date(data.sessionStartTime), {
  message: 'Session end time must be after start time'
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

// ✅ NEW: Phase 1 - Start a 1-hour session
export const startSessionSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  location: z.string().max(200).optional(),
  remarks: z.string().max(500).optional(),
  qrValiditySeconds: z.number().int().min(10).max(300).optional().default(30)
});

export type StartSessionInput = z.infer<typeof startSessionSchema>;

// ✅ NEW: Phase 1 - Refresh QR code
export const refreshQrSchema = z.object({
  qrValiditySeconds: z.number().int().min(10).max(300).optional().default(30)
});

export type RefreshQrInput = z.infer<typeof refreshQrSchema>;
