// Lightweight JWT middleware for the chat service.
// Does NOT make any database calls — only decodes the token.
// Uses optionalAuth (non-blocking) for the chat route,
// and requireAuth (blocking) for protected admin routes.
// requireAdmin (blocking) exclusively allows ADMIN role.

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const { TokenExpiredError } = jwt;

const JWT_SECRET = process.env.JWT_SECRET ?? "dev_secret";

interface JwtPayload {
    sub?: string;
    userId?: string;
    role?: string;
}

// Decodes the Bearer token if present and attaches req.user.
// If no token or invalid token — proceeds as anonymous (req.user stays undefined).
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
        return next();
    }

    const token = header.split(" ")[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const id = payload.sub ?? payload.userId;

        if (id && payload.role) {
            (req as any).user = { id, role: payload.role };
        }
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            // Log the expiry but don't block — just treat as anonymous
            console.warn("[auth] Token expired — proceeding as anonymous");
        }
        // Any other error (malformed, bad signature) — silently ignore
    }

    next();
}

// Blocks the request if no valid JWT is present.
// Use this on admin-only routes like POST /chat/sync.
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
        res.status(401).json({ error: "Authentication required." });
        return;
    }

    const token = header.split(" ")[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const id = payload.sub ?? payload.userId;

        if (!id || !payload.role) {
            res.status(401).json({ error: "Invalid token payload." });
            return;
        }

        (req as any).user = { id, role: payload.role };
        next();
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            res.status(401).json({ error: "Token expired. Please log in again." });
        } else {
            res.status(401).json({ error: "Invalid token." });
        }
    }
}

// Blocks the request if no valid JWT is present or role is not ADMIN.
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
    requireAuth(req, res, () => {
        if ((req as any).user?.role !== "ADMIN") {
            res.status(403).json({ error: "Admin access required." });
            return;
        }
        next();
    });
}
