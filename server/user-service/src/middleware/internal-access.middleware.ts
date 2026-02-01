//server\user-service\src\middleware\service.middleware.ts
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const SERVICE_KEY = process.env.SERVICE_KEY || ""
const JWT_SECRET = process.env.JWT_SECRET || "yourSuperSecretJWTKey"

type JwtPayload = {
  sub?: string
  userId?: string
  email?: string
  role?: string
}

export function requireServiceOrAdmin(req: Request, res: Response, next: NextFunction) {
  const serviceKey = req.headers["x-service-key"]

  if (SERVICE_KEY && typeof serviceKey === "string" && serviceKey === SERVICE_KEY) {
    return next()
  }

  const auth = req.headers.authorization
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Missing Authorization or X-Service-Key"
    })
  }

  const token = auth.split(" ")[1]

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload

    if (payload.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      })
    }

    return next()
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    })
  }
}

