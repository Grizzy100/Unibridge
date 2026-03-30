// server/chat-service/src/services/prompts/context.prompt.ts
// Builds the final user message sent to Gemini for the actual response.
// Keeps personal data and semantic chunks clearly separated.

import type { UserIdentity } from "../../types/identity.types.js";
import type { IntentResult, StructuredData, SemanticChunks } from "../../types/intent.types.js";
import type { ConversationMemory } from "../../types/memory.types.js";
import { enforceContextBudget } from "../context-budget.service.js";
import { CONTEXT_CHAR_BUDGET } from "../../constants.js";

export interface ContextPromptResult {
    prompt: string;
    wasTrimmed: boolean;
}

export function buildContextPrompt(
    identity: UserIdentity | null,
    intent: IntentResult,
    structuredData: StructuredData,
    semanticChunks: SemanticChunks,
    memory: ConversationMemory,
    currentMessage: string
): ContextPromptResult {
    const firstName = identity?.name?.split(" ")[0] ?? "User";

    const rawStructuredDataStr = formatStructuredData(structuredData, identity);
    
    // Gap 5: Enforce character budget
    const { safeStructured, safeChunks, wasTrimmed } = enforceContextBudget(
        rawStructuredDataStr,
        semanticChunks ?? [],
        CONTEXT_CHAR_BUDGET
    );

    if (wasTrimmed) {
        console.warn(`[PromptBuilder] Context for sessionId was trimmed to meet ${CONTEXT_CHAR_BUDGET} budget.`);
    }

    const prompt = `
## CONVERSATION MEMORY
${memory.summary
        ? `Summary of earlier conversation: ${memory.summary}`
        : "This is the start of the conversation."}

## RECENT TURNS
${memory.recentTurns.length > 0
        ? memory.recentTurns
            .map(t => `${t.role === "user" ? firstName : "Uni"}: ${t.content}`)
            .join("\n")
        : "No previous turns in this session."}

## DETECTED INTENT
Type: ${intent.intent}
Confidence: ${(intent.confidence * 100).toFixed(0)}%
Is Personal Query: ${intent.isPersonal}

## PERSONAL DATA (from University Database — use for exact facts)
${safeStructured}

## KNOWLEDGE BASE CONTEXT (from semantic search — use for rules and policies)
${formatSemanticChunks(safeChunks.length > 0 ? safeChunks : null)}

## ANSWERING INSTRUCTIONS
1. If PERSONAL DATA is present → use exact values, do not round or estimate
2. If KNOWLEDGE BASE CONTEXT is present → use it for rules and criteria
3. If BOTH are present → combine for a personalized answer
   (e.g. "Your CGPA is 8.2 which meets the 8.0 requirement, so you are eligible.")
4. If NEITHER is present → use the fallback message, never guess or make up data
5. Never expose raw JSON keys or field names to the user
6. Never share data marked private (phone, address, raw database IDs)
7. Keep the answer natural — do not say "the context says..." or "based on the data..."

## PRIVACY GUARDRAILS
- CGPA, backlogs, attendance → only share with the owner
- Teacher email → shareable if retrieved from knowledge base
- Warden contact → shareable only with students in that block
- Another student's personal data → never share under any circumstances

## CURRENT QUESTION FROM ${(identity?.name ?? "USER").toUpperCase()}
"${currentMessage}"

Answer as Uni. Be warm, accurate, and concise.
`.trim();

    return { prompt, wasTrimmed };
}

// ─────────────────────────────────────────────
// Helpers — sanitize before injecting into prompt
// ─────────────────────────────────────────────

function formatStructuredData(data: StructuredData, identity: UserIdentity | null): string {
    if (!data) {
        return "No personal database records retrieved for this query.";
    }

    // Remove internal/sensitive fields before injecting into the prompt
    const BLOCKED_KEYS = new Set([
        "id", "userId", "profileId", "password", "phoneNumber",
        "dateOfBirth", "currentAddress", "permanentAddress", "pincode",
        "parentContact", "emergencyContact", "createdAt", "updatedAt",
    ]);

    const safe = Object.entries(data)
        .filter(([k]) => !BLOCKED_KEYS.has(k))
        .map(([k, v]) => `${humanizeKey(k)}: ${formatValue(v)}`)
        .join("\n");

    if (!safe.trim()) return "No displayable personal data found.";

    return `${safe}\n\n⚠️ This data belongs to ${identity?.name ?? "the user"} only.`;
}

function formatSemanticChunks(chunks: SemanticChunks): string {
    if (!chunks || chunks.length === 0) {
        return "No relevant policy or knowledge base content found.";
    }
    return chunks
        .map((chunk, i) => `[Source ${i + 1}]: ${chunk}`)
        .join("\n---\n");
}

function humanizeKey(key: string): string {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

function formatValue(value: unknown): string {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) {
        return value.length > 0 ? value.join(", ") : "None";
    }
    return String(value);
}
