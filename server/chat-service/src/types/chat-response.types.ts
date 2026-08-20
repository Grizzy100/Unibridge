// server/chat-service/src/types/chat-response.types.ts
import type { IntentType, RetrievalStrategy } from "./intent.types.js";

export interface SourceMetadata {
    source: string;
    score: number;
    preview: string;
}

export interface ChatMeta {
    intent: IntentType;
    confidence: number;
    retrievalConfidence?: number;
    retrievalSource: RetrievalStrategy;
    chunksFound: number;
    usedFallback: boolean;
    wasTrimmed: boolean;
    sources?: SourceMetadata[];
}

export interface ChatResponsePayload {
    answer: string;
    sessionId: string;
    meta?: ChatMeta;
}


//Meta: Runs after the request has been processed.
//(Or just before sending the answer back to the user).

// The "Receipt" of the transaction.
// When you order food, you get a receipt at the end. It lists what you ordered, if there were any discounts (trimming), and if the chef had to substitute something (fallback).
// ChatMeta is that receipt. It tells you: "Did the AI actually find what you asked for, or did it guess?"
