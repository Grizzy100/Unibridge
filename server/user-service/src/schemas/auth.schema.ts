
//user-service/src/schemas/auth.schema.ts
import { z } from "zod";
// ─────────────────────────────────────────
// Email Format Validators by Role
// ─────────────────────────────────────────
// Student: e23cseuXXXX@uniname.edu.in
const studentEmailRegex = /^e\d{2}[a-z]{4,6}\d{4}@[a-z]+\.edu\.in$/i;
// Teacher: firstname.lastname@uniname.edu.in
const teacherEmailRegex = /^[a-z]+\.[a-z]+@[a-z]+\.edu\.in$/i;
// Parent: parentname.surname@uniname.edu.in
const parentEmailRegex = /^[a-z]+\.[a-z]+@[a-z]+\.edu\.in$/i;
// Warden: wardenname.surname@uniname.edu.in
const wardenEmailRegex = /^[a-z]+\.[a-z]+@[a-z]+\.edu\.in$/i;
// ─────────────────────────────────────────
// Login Schema (NO email format validation)
// Anyone with valid email + password can login
// ─────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});
export type LoginInput = z.infer<typeof loginSchema>;
// ─────────────────────────────────────────
// Create User Schemas (STRICT email validation)
// Only enforced when admin creates users
// ─────────────────────────────────────────
// Student Creation
export const createStudentSchema = z.object({
  email: z
    .string()
    .regex(studentEmailRegex, "Student email must be: e23cseuXXXX@uniname.edu.in"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain number"),
  role: z.literal("STUDENT")
});
// Teacher Creation
export const createTeacherSchema = z.object({
  email: z
    .string()
    .regex(teacherEmailRegex, "Teacher email must be: firstname.lastname@uniname.edu.in"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain number"),
  role: z.literal("TEACHER")
});
// Parent Creation
export const createParentSchema = z.object({
  email: z
    .string()
    .regex(parentEmailRegex, "Parent email must be: parentname.surname@uniname.edu.in"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain number"),
  role: z.literal("PARENT")
});
// Warden Creation
export const createWardenSchema = z.object({
  email: z
    .string()
    .regex(wardenEmailRegex, "Warden email must be: wardenname.surname@uniname.edu.in"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain number"),
  role: z.literal("WARDEN")
});
// Admin Creation (for future admins)
export const createAdminSchema = z.object({
  email: z.string().email("Invalid admin email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain number"),
  role: z.literal("ADMIN")
});
// ─────────────────────────────────────────
// Union Schema for User Creation
// ─────────────────────────────────────────
export const createUserSchema = z.discriminatedUnion("role", [
  createStudentSchema,
  createTeacherSchema,
  createParentSchema,
  createWardenSchema,
  createAdminSchema
]);
export type CreateUserInput = z.infer<typeof createUserSchema>;
