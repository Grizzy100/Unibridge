
//server/task-service/src/validators/submission.validator.ts
import { z } from 'zod';
export const createSubmissionSchema = z.object({
  comment: z.string().optional(),
});
export const extendTaskSchema = z.object({
  dueDate: z.string().refine(v => !isNaN(Date.parse(v)), { message: 'Invalid due date' }),
});
export const extendSubmissionSchema = z.object({
  customDueDate: z.string().refine(v => !isNaN(Date.parse(v)), { 
    message: 'Invalid custom due date' 
  }),
});
export const gradeSubmissionSchema = z.object({
  marks: z.number().int().min(0).max(5),  
  feedback: z.string().optional(),
});
