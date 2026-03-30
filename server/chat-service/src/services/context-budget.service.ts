// server/chat-service/src/services/context-budget.service.ts

export function enforceContextBudget(
    structuredPrompt: string,
    semanticChunks: string[],
    charBudget: number
): { safeStructured: string; safeChunks: string[]; wasTrimmed: boolean } {
    let wasTrimmed = false;
    
    // First, determine sizes
    const structuredSize = structuredPrompt.length;
    const initialChunksTotalSize = semanticChunks.reduce((acc, c) => acc + c.length, 0);

    if (structuredSize + initialChunksTotalSize <= charBudget) {
        return { safeStructured: structuredPrompt, safeChunks: semanticChunks, wasTrimmed: false };
    }

    wasTrimmed = true;
    let safeChunks: string[] = [];
    let remainingBudget = charBudget - structuredSize;

    if (remainingBudget > 0) {
        // We have room for some chunks. Add complete chunks until we hit the budget.
        // If a single chunk is too big, skip it to avoid cutting sentences mid-way, or cut at sentence boundary.
        for (const chunk of semanticChunks) {
            if (chunk.length <= remainingBudget) {
                safeChunks.push(chunk);
                remainingBudget -= chunk.length;
            } else {
                // Try to find the last sentence boundary that fits
                const truncated = trimToLastSentenceBoundary(chunk, remainingBudget);
                if (truncated.length > 50) { // arbitrary minimum useful length
                    safeChunks.push(truncated);
                    remainingBudget -= truncated.length;
                }
                break; // Stop adding more chunks once we start trimming
            }
        }
    } else {
        // Structured data alone exceeds the budget! We must drop ALL chunks.
        safeChunks = [];
        
        // And now we must trim the structured data itself
        const overage = structuredSize - charBudget;
        // Keep the top part of the structured prompt, which usually has the most important fields
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