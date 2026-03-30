// server/chat-service/src/validators/coverage.validator.ts
import { ALLOWED_INTENTS_MAP } from "./intent.validator.js";
import type { IntentType } from "../types/intent.types.js";

// This file checks if all declared intents actually have a retrieval strategy mapped
export function validateIntentCoverage(handledIntents: Record<IntentType, true>): void {
    const allDeclaredIntents = new Set<string>();
    
    for (const roleIntents of Object.values(ALLOWED_INTENTS_MAP)) {
        for (const intent of roleIntents) {
            allDeclaredIntents.add(intent);
        }
    }

    const unhandled: string[] = [];
    for (const intent of allDeclaredIntents) {
        if (!(intent in handledIntents)) {
            unhandled.push(intent);
        }
    }

    if (unhandled.length > 0) {
        const message = `[CoverageValidator] CRITICAL: ${unhandled.length} declared intents have NO retrieval handler in retrieval.service.ts: ${unhandled.join(", ")}`;
        
        if (process.env.NODE_ENV === "production") {
            console.error(message);
            console.error("[CoverageValidator] Refusing to start in production with missing intent handlers.");
            process.exit(1);
        } else {
            console.warn(`\x1b[33m${message}\x1b[0m`);
            console.warn("\x1b[33m[CoverageValidator] Warning mapped but allowing startup in DEV.\x1b[0m");
        }
    } else {
        console.log("[CoverageValidator] All declared intents have retrieval handlers mapped. ✓");
    }
}
