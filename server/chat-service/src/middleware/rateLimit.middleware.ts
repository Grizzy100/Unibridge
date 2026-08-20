// server/chat-service/src/middleware/rateLimit.middleware.ts
// Rate limits the /chat endpoint to prevent API quota abuse.

import { Request, Response } from "express";
import { redis } from "../utils/redis.js";

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 20;

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

async function getRedisRateCount(key: string): Promise<number | null> {
    const windowStart = Math.floor(Date.now() / WINDOW_MS) * WINDOW_MS;
    const redisKey = `chat:rate:${key}:${windowStart}`;

    try {
        const count = await redis.incr(redisKey);
        if (count === 1) {
            await redis.pexpire(redisKey, WINDOW_MS * 2);
        }

        return count;
    } catch (error) {
        console.warn("[chatRateLimit] Redis rate limit check failed:", error);
        return null;
    }
}

export async function chatRateLimit(req: Request, res: Response, next: Function): Promise<void> {
    // Key: user ID if authenticated, otherwise IP
    const user = (req as any).user as { id: string } | undefined;
    const key = user?.id ?? req.ip ?? "unknown";

    try {
        const redisCount = await getRedisRateCount(key);
        if (redisCount !== null && redisCount > MAX_REQUESTS) {
            res.status(429).json({
                error: "Too many messages. Please wait a moment before sending more.",
            });
            return;
        }

        return next();
    } catch (error) {
        console.warn("[chatRateLimit] Redis unavailable, falling back to in-memory limiter:", error);
    }

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
