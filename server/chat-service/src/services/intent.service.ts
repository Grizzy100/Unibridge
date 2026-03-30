// server/chat-service/src/services/intent.service.ts
// Intent classification using Gemini with structured JSON output.
// Uses role-aware prompt builder + validates output before returning.

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { buildIntentClassifierPrompt } from "./prompts/intent.prompt.js";
import { validateIntent } from "../validators/intent.validator.js";
import type { IntentResult } from "../types/intent.types.js";
import type { UserRole } from "../types/identity.types.js";

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });
const INTENT_MODEL = "gemini-2.5-flash";

const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        intent:            { type: Type.STRING, description: "The classified intent" },
        confidence:        { type: Type.NUMBER, description: "Confidence 0–1" },
        retrieval:         { type: Type.STRING, description: "Retrieval strategy" },
        collections:       { type: Type.ARRAY, items: { type: Type.STRING }, description: "ChromaDB collections to search" },
        entities:          { type: Type.ARRAY, items: { type: Type.STRING }, description: "Extracted entities from the message" },
        isPersonal:        { type: Type.BOOLEAN, description: "Whether this is a personal data query" },
        requiresUserScope: { type: Type.BOOLEAN, description: "Whether retrieval must be scoped to this user" },
    },
    required: ["intent", "confidence", "retrieval", "isPersonal", "requiresUserScope"],
};

export async function classifyIntent(
    message: string,
    role: UserRole,
    historySummary: string = ""
): Promise<IntentResult> {
    const prompt = buildIntentClassifierPrompt(message, historySummary, role);

    try {
        const result = await gemini.models.generateContent({
            model: INTENT_MODEL,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema,
                temperature: 0.1,
                thinkingConfig: { thinkingBudget: 0 }, // No thinking — fast classification
            },
        });

        if (!result.text) {
            return safeDefault(role);
        }

        const raw = JSON.parse(result.text) as Partial<IntentResult>;
        const validated = validateIntent(raw, role);

        console.log(`[IntentService] "${message.slice(0, 40)}..." → ${validated.intent} (${(validated.confidence * 100).toFixed(0)}%)`);
        return validated;

    } catch (error: any) {
        console.error("[IntentService] Classification failed:", error?.message);
        return safeDefault(role);
    }
}

function safeDefault(role: UserRole): IntentResult {
    return {
        intent: "QUERY_POLICY",
        confidence: 0.5,
        retrieval: "CHROMADB_ONLY",
        collections: ["knowledge_base"],
        entities: [],
        isPersonal: false,
        requiresUserScope: false,
    };
}
