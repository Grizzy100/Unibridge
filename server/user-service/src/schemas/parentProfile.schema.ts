
//server/user-service/src/schemas/parentProfile.schema.ts
import { z } from "zod";
export const parentProfileSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().min(10),
  relationship: z.string().min(1),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});
export const linkParentStudentSchema = z.object({
  parentId: z.string(),
  studentId: z.string(),
  relationship: z.string(),
  isPrimary: z.boolean().optional(),
});
export type ParentProfileInput = z.infer<typeof parentProfileSchema>;
export type LinkParentStudentInput = z.infer<typeof linkParentStudentSchema>;
