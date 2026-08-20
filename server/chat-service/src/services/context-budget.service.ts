// server/chat-service/src/services/context-budget.service.ts

import type { ChunkWithSource } from "../types/intent.types.js";

export function enforceContextBudget(
    structuredPrompt: string,
    semanticChunks: ChunkWithSource[],
    charBudget: number
): { safeStructured: string; safeChunks: ChunkWithSource[]; wasTrimmed: boolean } {
    let wasTrimmed = false;
    
    // First, determine sizes
    const structuredSize = structuredPrompt.length;
    const initialChunksTotalSize = semanticChunks.reduce((acc, c) => acc + c.text.length, 0);

    if (structuredSize + initialChunksTotalSize <= charBudget) {
        return { safeStructured: structuredPrompt, safeChunks: semanticChunks, wasTrimmed: false };
    }

    wasTrimmed = true;
    let safeChunks: ChunkWithSource[] = [];
    let remainingBudget = charBudget - structuredSize;

    if (remainingBudget > 0) {
        // We have room for some chunks. Add complete chunks until we hit the budget.
        for (const chunk of semanticChunks) {
            if (chunk.text.length <= remainingBudget) {
                safeChunks.push(chunk);
                remainingBudget -= chunk.text.length;
            } else {
                // Try to find the last sentence boundary that fits
                const truncatedText = trimToLastSentenceBoundary(chunk.text, remainingBudget);
                if (truncatedText.length > 50) {
                    safeChunks.push({
                        ...chunk,
                        text: truncatedText,
                        preview: truncatedText.slice(0, 300),
                    });
                    remainingBudget -= truncatedText.length;
                }
                break; // Stop adding more chunks once we start trimming
            }
        }
    } else {
        // Structured data alone exceeds the budget! We must drop ALL chunks.
        safeChunks = [];
        
        // And now we must trim the structured data itself
        const overage = structuredSize - charBudget;
        const safeLen = Math.max(0, structuredSize - overage);
        const truncatedData = trimToLastSentenceBoundary(structuredPrompt, safeLen);
        
        return {
            safeStructured: truncatedData + "\n[Data trimmed due to size constraints]",
            safeChunks,
            wasTrimmed: true
        };
    }

    console.warn(`[ContextBudget] Context trimmed. Removed ${semanticChunks.length - safeChunks.length} full chunks. remaining budget: ${remainingBudget}`);
    
    return {
        safeStructured: structuredPrompt,
        safeChunks,
        wasTrimmed: true
    };
}


function trimToLastSentenceBoundary(text: string, maxLen: number): string {
    if (text.length <= maxLen) return text;
    
    const candidate = text.slice(0, maxLen);
    // Look for the last period, exclamation, or question mark
    const match = candidate.match(/.*[.!?]/s);
    
    if (match) {
        return match[0].trim();
    }
    
    // If no sentence boundary found, try splitting at the last newline or space
    const lastNewline = candidate.lastIndexOf("\n");
    if (lastNewline > 0) return candidate.slice(0, lastNewline).trim();
    
    const lastSpace = candidate.lastIndexOf(" ");
    if (lastSpace > 0) return candidate.slice(0, lastSpace).trim() + "...";
    
    return candidate.trim();
}


//This file acts like an Accountant and enforecs on CONTEXT_CHARACTER_BUDGET
//We  have handled the edge case where few tokens are left, so take in query from user
// but need to trim down some partialDeepStrictEqual. We dont trim from halfway , but the last 
// 'fullstop', 'exclamation mark', 'question mark', 'newline' or 'space'.

//if no token left , then drop the entire chunks