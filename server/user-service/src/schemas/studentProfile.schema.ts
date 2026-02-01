
//server/user-service/src/schemas/studentSchema.schema.ts
import { z } from "zod";
export const studentProfileSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  enrollmentNumber: z.string().min(1),
  school: z.enum(["BTECH", "BBA", "BCOM", "BSC", "BA", "MTECH", "MBA", "MSC", "MA"]),
  batch: z.string().regex(/^\d{4}-\d{4}$/),  // e.g., 2023-2027
  year: z.number().int().min(1).max(5),        // 1-5
  semester: z.number().int().min(1).max(10),   // 1-10
  specialization: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string().refine(v => !isNaN(Date.parse(v)), { message: "Invalid date" }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  phoneNumber: z.string().optional(),
  bloodGroup: z.enum(["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "O_POSITIVE", "O_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE"]).optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  guardianName: z.string().optional(),
  parentContact: z.string().optional(),
  emergencyContact: z.string().optional(),
  currentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  hostelAssigned: z.boolean().optional(),
  hostelName: z.string().optional(),
  roomNumber: z.string().optional(),
});
export type StudentProfileInput = z.infer<typeof studentProfileSchema>;
