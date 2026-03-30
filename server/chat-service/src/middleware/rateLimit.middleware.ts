// server/chat-service/src/middleware/rateLimit.middleware.ts
// Rate limits the /chat endpoint to prevent API quota abuse.
// Uses express-rate-limit (already a dependency via express ecosystem).

import { Request, Response } from "express";

// Simple in-memory rate limiter (no Redis needed)
// Tracks request count per identifier within a rolling window

const WINDOW_MS = 60 * 1000;   // 1 minute window
const MAX_REQUESTS = 20;        // 20 messages per minute per user

interface RateLimitEntry {
    count: number;
    windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
        if (now - entry.windowStart > WINDOW_MS * 2) {
            store.delete(key);
        }
    }
}, 5 * 60 * 1000);

export function chatRateLimit(req: Request, res: Response, next: Function): void {
    // Key: user ID if authenticated, otherwise IP
    const user = (req as any).user as { id: string } | undefined;
    const key = user?.id ?? req.ip ?? "unknown";

    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now - entry.windowStart > WINDOW_MS) {
        // New window
        store.set(key, { count: 1, windowStart: now });
        return next();
    }

    if (entry.count >= MAX_REQUESTS) {
        res.status(429).json({
            error: "Too many messages. Please wait a moment before sending more.",
        });
        return;
    }

    entry.count++;
    return next();
}
