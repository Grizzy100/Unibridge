
//server/outpass-service/src/schemas/outpass.schema.ts
import { z } from 'zod';
export const createOutpassSchema = z.object({
  type: z.enum(['DAY_PASS', 'LEAVE_PASS']),
  reason: z.string().min(10).max(500),
  outgoingDateTime: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid outgoing datetime' }),
  returningDateTime: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid returning datetime' }),
}).refine(data => new Date(data.returningDateTime) > new Date(data.outgoingDateTime),
{ message: 'Returning datetime must be after outgoing datetime' });

export const parentApprovalSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
});
export const wardenApprovalSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
  comment: z.string().min(1).max(500).optional(),
}).refine(data => {
  if (data.action === 'REJECT' && !data.comment) return false;
  return true;
}, { message: 'Comment is required when rejecting' });

export const wardenDeleteSchema = z.object({
  reason: z.string().min(10).max(500).optional(),
});

export const forceDeleteSchema = z.object({
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500),
});

export type CreateOutpassInput = z.infer<typeof createOutpassSchema>;
export type ParentApprovalInput = z.infer<typeof parentApprovalSchema>;
export type WardenApprovalInput = z.infer<typeof wardenApprovalSchema>;
export type WardenDeleteInput = z.infer<typeof wardenDeleteSchema>;
export type ForceDeleteInput = z.infer<typeof forceDeleteSchema>;