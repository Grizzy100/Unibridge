
//server/user-service/src/schemas/teacherProfile.schema.ts
import { z } from "zod";
export const teacherProfileSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  employeeId: z.string().min(1),
  department: z.string().min(1),
  designation: z.string().min(1),
  dateOfJoining: z.string().refine(v => !isNaN(Date.parse(v)), { message: "Invalid date" }),
  dateOfBirth: z.string().optional(),  // Optional
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  phoneNumber: z.string().optional(),
  bloodGroup: z.enum(["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "O_POSITIVE", "O_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE"]).optional(),
  specialization: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  officeRoom: z.string().optional(),
});
export type TeacherProfileInput = z.infer<typeof teacherProfileSchema>;
