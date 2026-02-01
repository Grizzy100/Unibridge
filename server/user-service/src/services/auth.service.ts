
//server/user-service/src/services/auth.service.ts
import { Role } from '../generated/prisma/client.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from '../utils/prisma.js';
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_EXPIRES_IN = "7d";
export async function registerByAdmin(
  adminId: string,
  payload: { email: string; password: string; role: Role }
) {
  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existing) throw new Error("Email already exists");
  const hashed = await bcrypt.hash(payload.password, 12);  // ✅ Changed to 12
  const user = await prisma.user.create({
    data: { email: payload.email, password: hashed, role: payload.role }
  });
  
  return { id: user.id, email: user.email, role: user.role };
}
export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");
  
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid credentials");
  
  const token = jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  
  // ✅ ADD DASHBOARD REDIRECT
  const dashboardMap: Record<Role, string> = {
    ADMIN: "/admin/dashboard",
    STUDENT: "/student/dashboard",
    TEACHER: "/teacher/dashboard",
    PARENT: "/parent/dashboard",
    WARDEN: "/warden/dashboard"
  };
  
  return {
    token,
    user: { id: user.id, email: user.email, role: user.role },
    redirectTo: dashboardMap[user.role]  // ✅ ADDED
  };
}
export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}
