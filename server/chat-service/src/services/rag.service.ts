// server/chat-service/src/services/rag.service.ts
// The main chat pipeline — wires all services together.
//
// Flow:
//   Session → Identity → Intent classify → Validate → Retrieve → Fallback? → Context → Gemini → Memory

import { GoogleGenAI } from "@google/genai";
import {
    getOrInitSession,
    getHistory,
    getMemory,
    getJwt,
    addTurns,
} from "./session.service.js";
import { classifyIntent } from "./intent.service.js";
import { hybridRetrieve } from "./retrieval.service.js";
import { buildSystemPrompt } from "./prompts/system.prompt.js";
import { buildContextPrompt } from "./prompts/context.prompt.js";
import { FALLBACK_MESSAGE } from "../constants.js";
import type { UserRole } from "../types/identity.types.js";
import type { ChatResponsePayload } from "../types/chat-response.types.js";

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });
const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL ?? "gemini-2.5-flash";

export async function chat(
    question: string,
    sessionId: string,
    role: string = "DEFAULT",
    userId: string = "anonymous",
    jwt: string | null = null
): Promise<ChatResponsePayload> {
    // ── Step 1: Session & Identity ─────────────────────────────────────────
    const session = await getOrInitSession(sessionId, userId, role, jwt);
    const identity = session.identity;
    const userRole = (role ?? "DEFAULT") as UserRole;

    // ── Step 2: Classify Intent ────────────────────────────────────────────
    const memory = getMemory(sessionId);
    const intent = await classifyIntent(question, userRole, memory.summary);

    // ── Step 3: Hard Fallback — skip Gemini entirely (save tokens & latency)
    if (intent.retrieval === "HARD_FALLBACK") {
        return {
            answer: FALLBACK_MESSAGE,
            sessionId,
            meta: {
                intent: intent.intent,
                confidence: intent.confidence,
                retrievalSource: "HARD_FALLBACK",
                chunksFound: 0,
                usedFallback: true,
                wasTrimmed: false
            }
        };
    }

    // ── Step 4: Hybrid Retrieval ───────────────────────────────────────────
    const storedJwt = getJwt(sessionId) ?? jwt;
    const { structuredData, semanticChunks } = await hybridRetrieve(
        intent,
        identity,
        question,
        storedJwt
    );

    const chunksCount = semanticChunks?.length ?? 0;
    
    // ── Step 5: Build Context Prompt ───────────────────────────────────────
    const contextResult = buildContextPrompt(
        identity,
        intent,
        structuredData,
        semanticChunks,
        memory,
        question
    );

    // ── Step 6: Build System Prompt ────────────────────────────────────────
    const systemInstruction = buildSystemPrompt(identity);

    // ── Step 7: Get Gemini History ─────────────────────────────────────────
    const history = getHistory(sessionId);

    // ── Step 8: Generate Response ──────────────────────────────────────────
    try {
        const response = await gemini.models.generateContent({
            model: CHAT_MODEL,
            contents: [
                ...history,
                { role: "user", parts: [{ text: contextResult.prompt }] },
            ],
            config: {
                systemInstruction,
            },
        });

        const answer = response.text?.trim() ?? FALLBACK_MESSAGE;

        // ── Step 9: Save Turns to Memory ──────────────────────────────────
        await addTurns(sessionId, question, answer);

        return {
            answer,
            sessionId,
            meta: {
                intent: intent.intent,
                confidence: intent.confidence,
                retrievalSource: intent.retrieval,
                chunksFound: chunksCount,
                usedFallback: answer === FALLBACK_MESSAGE,
                wasTrimmed: contextResult.wasTrimmed
            }
        };

    } catch (err: any) {
        console.error("[RAGService] Gemini generation failed:", err?.message);
        return {
            answer: FALLBACK_MESSAGE,
            sessionId,
            meta: {
                intent: intent.intent,
                confidence: intent.confidence,
                retrievalSource: intent.retrieval,
                chunksFound: chunksCount,
                usedFallback: true,
                wasTrimmed: contextResult.wasTrimmed
            }
        };
    }
}
