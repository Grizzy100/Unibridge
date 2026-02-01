
// user-service/src/controllers/auth.controller.ts
import { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { loginSchema, createUserSchema } from "../schemas/auth.schema.js"; 
import { Role } from "@prisma/client";

// Public Login
export async function login(req: Request, res: Response) {
  try {
    // Validate with Zod
    const { email, password } = loginSchema.parse(req.body);  // ← UPDATED
    const result = await authService.login(email, password);
    return res.json(result);
  } catch (err: any) {
    // Zod validation errors
    if (err.name === "ZodError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors.map((e: any) => ({
          field: e.path.join("."),
          message: e.message
        }))
      });
    }
    // Auth errors
    return res.status(401).json({ message: err.message });
  }
}


// Admin Creates User
export async function adminCreateUser(req: Request, res: Response) {
  try {
    const adminId = (req as any).user.id;
    
    // Validate with Zod (role-specific email validation)
    const data = createUserSchema.parse(req.body);  // ← UPDATED
    
    const created = await authService.registerByAdmin(adminId, {
      email: data.email,
      password: data.password,
      role: data.role as Role
    });
    
    return res.status(201).json({
      message: "User created successfully",
      user: created
    });
  } catch (err: any) {
    // Zod validation errors
    if (err.name === "ZodError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors.map((e: any) => ({
          field: e.path.join("."),
          message: e.message
        }))
      });
    }
    // Service errors
    return res.status(400).json({ message: err.message });
  }
}
