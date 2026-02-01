
//server/user-service/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getUserById } from "../services/auth.service.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

interface JwtPayload {
  sub?: string;
  userId?: string;
  email: string;
  role: string;
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }
  const token = auth.split(" ")[1];
  
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Support both 'sub' and 'userId' claim for flexibility
    const userId = payload.sub || payload.userId;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload: missing user ID" });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid token: user not found" });
    }

    // Attach minimal user info to request for downstream handlers
    (req as any).user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
