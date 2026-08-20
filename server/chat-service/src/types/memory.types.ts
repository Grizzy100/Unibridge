// server/chat-service/src/types/memory.types.ts


//It simply states who spoke (user or model) 
// and what they said (content).
export interface ConversationTurn {
    role: "user" | "model";
    content: string;
}

//how you solve the "Context Budget" problem 
// (remember that 12_000 character limit we talked about earlier?).
//Context Window Management
//Cost Optimization
export interface ConversationMemory {
    summary: string;            // Compressed older turns
    recentTurns: ConversationTurn[];
}

// Raw turn format used internally by Gemini API
export interface GeminiTurn {
    role: "user" | "model";
    parts: [{ text: string }];
}


//this file basically creates 
// 1) who is talking, and about what ?
// 2) To remember context, we created summary , recent turn
// summary contains the older context (not word by word), reecnt turn contains
// upto older 4-6 messages (Context awareness), this is to also manage 
// CONTEXT_CHAR_BUDGET. 
// The sliding window type mechanism keep moving forward