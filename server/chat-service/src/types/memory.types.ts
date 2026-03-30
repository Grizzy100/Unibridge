// server/chat-service/src/types/memory.types.ts

export interface ConversationTurn {
    role: "user" | "model";
    content: string;
}

export interface ConversationMemory {
    summary: string;            // Compressed older turns
    recentTurns: ConversationTurn[];
}

// Raw turn format used internally by Gemini API
export interface GeminiTurn {
    role: "user" | "model";
    parts: [{ text: string }];
}
