
//server/task-service/src/validators/task.validator.ts
import { z } from 'zod';
export const createTaskSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(3),
  description: z.string().optional(),
  type: z.string().optional().default('LAB'),  // Lab only
  dueDate: z.string().refine(v => !isNaN(Date.parse(v)), { 
    message: 'Invalid due date' 
  }),
  // Question file metadata (if using createTaskWithFile)
  questionFileUrl: z.string().url().optional(),
  questionFileType: z.string().optional(),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
