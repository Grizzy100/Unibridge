// server/chat-service/src/types/chat-response.types.ts
import type { IntentType, RetrievalStrategy } from "./intent.types.js";

export interface ChatMeta {
    intent: IntentType;
    confidence: number;
    retrievalSource: RetrievalStrategy;
    chunksFound: number;
    usedFallback: boolean;
    wasTrimmed: boolean;
}

export interface ChatResponsePayload {
    answer: string;
    sessionId: string;
    meta?: ChatMeta;
}
