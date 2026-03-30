// server/chat-service/src/services/session.service.ts
// Manages per-session state: identity (cached), conversation history, and memory compression.

import { GoogleGenAI } from "@google/genai";
import { buildIdentity } from "./identity.service.js";
import type { UserIdentity } from "../types/identity.types.js";
import type { GeminiTurn, ConversationMemory } from "../types/memory.types.js";

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });
const SUMMARY_MODEL = process.env.GEMINI_CHAT_MODEL ?? "gemini-2.5-flash";
const SESSION_TTL_MS = 30 * 60 * 1000;  // 30 minutes
const MAX_RECENT_TURNS = 6;              // Keep last 6 turns (3 exchanges) in-memory
const COMPRESS_AFTER = 12;              // Compress when > 12 turns total

export type Session = {
    identity: UserIdentity | null;
    history: GeminiTurn[];              // For Gemini multi-turn context
    memory: ConversationMemory;
    lastActive: number;
    jwt: string | null;                 // Stored for REST API calls from retrieval service
};

const sessions = new Map<string, Session>();

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
        return existing;
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
}

// ─────────────────────────────────────────────
// Cleanup
// ─────────────────────────────────────────────

export function clearSession(sessionId: string): void {
    sessions.delete(sessionId);
}

export function cleanupStaleSessions(): void {
    const now = Date.now();
    for (const [id, session] of sessions) {
        if (now - session.lastActive > SESSION_TTL_MS) {
            sessions.delete(id);
        }
    }
}
