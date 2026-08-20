// server/chat-service/src/services/session.service.ts
// Manages per-session state: identity (cached), conversation history, and memory compression.

import { GoogleGenAI } from "@google/genai";
import { buildIdentity } from "./identity.service.js";
import type { UserIdentity } from "../types/identity.types.js";
import type { GeminiTurn, ConversationMemory } from "../types/memory.types.js";
import { redis } from "../utils/redis";

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });
const SUMMARY_MODEL = process.env.GEMINI_CHAT_MODEL ?? "gemini-2.5-flash";
const SESSION_TTL_MS = 30 * 60 * 1000;  // 30 minutes
const MAX_RECENT_TURNS = 6;              // Keep last 6 turns (3 exchanges) in-memory
const COMPRESS_AFTER = 12;              // Compress when > 12 turns total
const SESSION_TTL_SECONDS = Math.ceil(SESSION_TTL_MS / 1000);
const REDIS_SESSION_PREFIX = "chat:session:";

export type Session = {
    identity: UserIdentity | null;
    history: GeminiTurn[];              // For Gemini multi-turn context
    memory: ConversationMemory;
    lastActive: number;
    jwt: string | null;                 // Stored for REST API calls from retrieval service
};

const sessions = new Map<string, Session>();

function redisSessionKey(sessionId: string): string {
    return `${REDIS_SESSION_PREFIX}${sessionId}`;
}

async function saveSessionToRedis(sessionId: string, session: Session): Promise<void> {
    try {
        await redis.set(redisSessionKey(sessionId), JSON.stringify(session), "EX", SESSION_TTL_SECONDS);
    } catch (error) {
        console.warn("[SessionService] Failed to persist session to Redis:", error);
    }
}

async function loadSessionFromRedis(sessionId: string): Promise<Session | null> {
    try {
        const raw = await redis.get(redisSessionKey(sessionId));
        if (!raw) return null;

        return JSON.parse(raw) as Session;
    } catch (error) {
        console.warn("[SessionService] Failed to load session from Redis:", error);
        return null;
    }
}

// ─────────────────────────────────────────────
// Init / Get
// ─────────────────────────────────────────────

export async function getOrInitSession(
    sessionId: string,
    userId: string,
    role: string,
    jwt: string | null = null
): Promise<Session> {
    const existing = sessions.get(sessionId);
    if (existing) {
        existing.lastActive = Date.now();
        if (jwt && !existing.jwt) existing.jwt = jwt; // Store JWT if first time
        void saveSessionToRedis(sessionId, existing);
        return existing;
    }

    const cached = await loadSessionFromRedis(sessionId);
    if (cached) {
        cached.lastActive = Date.now();
        if (jwt && !cached.jwt) cached.jwt = jwt;

        if (userId && userId !== "anonymous") {
            cached.identity = await buildIdentity(userId, role);
        }

        sessions.set(sessionId, cached);
        void saveSessionToRedis(sessionId, cached);
        return cached;
    }

    const session: Session = {
        identity: null,
        history: [],
        memory: { summary: "", recentTurns: [] },
        lastActive: Date.now(),
        jwt,
    };

    // Load identity if this is a known user (not anonymous)
    if (userId && userId !== "anonymous") {
        session.identity = await buildIdentity(userId, role);
        if (session.identity) {
            console.log(`[SessionService] Identity loaded for ${session.identity.name} (${role})`);
        } else {
            console.warn(`[SessionService] No identity found for userId=${userId} role=${role}`);
        }
    }

    sessions.set(sessionId, session);
    void saveSessionToRedis(sessionId, session);
    return session;
}

// ─────────────────────────────────────────────
// History access
// ─────────────────────────────────────────────

export function getHistory(sessionId: string): GeminiTurn[] {
    return sessions.get(sessionId)?.history ?? [];
}

export function getMemory(sessionId: string): ConversationMemory {
    return sessions.get(sessionId)?.memory ?? { summary: "", recentTurns: [] };
}

export function getJwt(sessionId: string): string | null {
    return sessions.get(sessionId)?.jwt ?? null;
}

// ─────────────────────────────────────────────
// Add turns + compress
// ─────────────────────────────────────────────

export async function addTurns(sessionId: string, userText: string, modelText: string): Promise<void> {
    const session = sessions.get(sessionId);
    if (!session) return;

    // Update Gemini history (for multi-turn awareness)
    session.history.push({ role: "user",  parts: [{ text: userText }] });
    session.history.push({ role: "model", parts: [{ text: modelText }] });

    // Update readable memory (for context prompt)
    session.memory.recentTurns.push({ role: "user",  content: userText });
    session.memory.recentTurns.push({ role: "model", content: modelText });

    // Keep only the last N readable turns
    if (session.memory.recentTurns.length > MAX_RECENT_TURNS * 2) {
        session.memory.recentTurns = session.memory.recentTurns.slice(-MAX_RECENT_TURNS * 2);
    }

    session.lastActive = Date.now();

    // Compress Gemini history when it grows too long
    if (session.history.length > COMPRESS_AFTER) {
        const toCompress = session.history.splice(0, 8); // Compress oldest 8 turns
        const transcript = toCompress.map(t => `${t.role}: ${t.parts[0].text}`).join("\n");

        try {
            const prompt = `Summarize this conversation concisely. Retain key facts:
Current Summary: ${session.memory.summary || "None"}
New Messages:
${transcript}`;

            const result = await gemini.models.generateContent({
                model: SUMMARY_MODEL,
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            });

            const newSummary = result.text?.trim();
            if (newSummary) session.memory.summary = newSummary;
        } catch {
            // If compression fails, keep the summary as-is
        }
    }

    void saveSessionToRedis(sessionId, session);
}

// ─────────────────────────────────────────────
// Cleanup
// ─────────────────────────────────────────────

export function clearSession(sessionId: string): void {
    sessions.delete(sessionId);
    void redis.del(redisSessionKey(sessionId));
}

export function cleanupStaleSessions(): void {
    const now = Date.now();
    for (const [id, session] of sessions) {
        if (now - session.lastActive > SESSION_TTL_MS) {
            sessions.delete(id);
        }
    }
}



//Memory Manager
// I didn't want to use a heavy external database like Redis just to track active 
// chat sessions, so I built an in-memory session manager. 
// It acts as an asynchronous state machine. Every time a message is sent, 
// it updates the short-term sliding window array. But more importantly, 
// it monitors the length of the chat. When the chat exceeds our defined 
// limits, it asynchronously splices the oldest messages and runs them 
// through a secondary, cheaper LLM to generate a rolling summary. 
// This guarantees our sessions stay memory-efficient on the server, 
// and token-efficient on the API.