//server/user-service/src/schemas/wardenProfile.schema.ts
import { z } from "zod";
export const wardenProfileSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  employeeId: z.string().min(1),
  hostelAssigned: z.string().min(1),
  dateOfJoining: z.string().refine(v => !isNaN(Date.parse(v)), { message: "Invalid date" }),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  phoneNumber: z.string().min(1),
  officeRoom: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});
export type WardenProfileInput = z.infer<typeof wardenProfileSchema>;
