// server/chat-service/src/validators/intent.validator.ts
// Validates and sanitizes the raw intent result from Gemini before it
// is used to route retrieval. Prevents prompt injection from affecting
// retrieval behavior.

import type { IntentResult, IntentType, RetrievalStrategy } from "../types/intent.types.js";
import type { UserRole } from "../types/identity.types.js";

// Allowed intents per role — any intent not in this list is rejected
export const ALLOWED_INTENTS_MAP: Record<UserRole, IntentType[]> = {
    STUDENT: [
        "PERSONAL_PROFILE", "PERSONAL_ACADEMIC", "PERSONAL_ATTENDANCE",
        "PERSONAL_TASKS", "PERSONAL_HOSTEL", "PERSONAL_ELIGIBILITY",
        "QUERY_TEACHER", "QUERY_POLICY", "QUERY_ACADEMIC_INFO",
        "SMALLTALK", "OUT_OF_SCOPE",
    ],
    TEACHER: [
        "PERSONAL_PROFILE", "PERSONAL_COURSES",
        "STUDENT_SUBMISSIONS", "STUDENT_ATTENDANCE",
        "QUERY_POLICY", "SMALLTALK", "OUT_OF_SCOPE",
    ],
    WARDEN: [
        "STUDENT_OUTPASS", "HOSTEL_POLICY",
        "BLOCK_OVERVIEW", "SMALLTALK", "OUT_OF_SCOPE",
    ],
    ADMIN:  ["QUERY_POLICY", "SMALLTALK", "OUT_OF_SCOPE"],
    PARENT: ["QUERY_POLICY", "SMALLTALK", "OUT_OF_SCOPE"],
    DEFAULT: ["QUERY_POLICY", "SMALLTALK", "OUT_OF_SCOPE"],
};

const VALID_COLLECTIONS = new Set([
    "student_profiles", "teacher_profiles", "warden_profiles",
    "courses", "scholarships", "knowledge_base",
]);

const VALID_RETRIEVAL_STRATEGIES = new Set<RetrievalStrategy>([
    "IDENTITY_ONLY", "NEONDB_ONLY", "CHROMADB_ONLY",
    "HYBRID", "REST_API", "SKIP_RETRIEVAL", "HARD_FALLBACK",
]);

const SAFE_FALLBACK: IntentResult = {
    intent: "QUERY_POLICY",
    confidence: 0.5,
    retrieval: "CHROMADB_ONLY",
    collections: ["knowledge_base"],
    entities: [],
    isPersonal: false,
    requiresUserScope: false,
};

export function validateIntent(raw: Partial<IntentResult>, role: UserRole): IntentResult {
    const allowed = ALLOWED_INTENTS_MAP[role] ?? ALLOWED_INTENTS_MAP.DEFAULT;

    // 1. Validate intent type against allowed list for this role
    if (!raw.intent || !allowed.includes(raw.intent as IntentType)) {
        console.warn(`[IntentValidator] Intent "${raw.intent}" not allowed for role=${role}. Falling back.`);
        return SAFE_FALLBACK;
    }

    // 2. Validate retrieval strategy
    const retrieval: RetrievalStrategy =
        raw.retrieval && VALID_RETRIEVAL_STRATEGIES.has(raw.retrieval as RetrievalStrategy)
            ? raw.retrieval as RetrievalStrategy
            : "CHROMADB_ONLY";

    // 3. Sanitize collections — only allow known collection names
    const collections = Array.isArray(raw.collections)
        ? raw.collections.filter(c => VALID_COLLECTIONS.has(c))
        : [];

    // 4. Enforce: if isPersonal, requiresUserScope must be true
    const isPersonal = Boolean(raw.isPersonal);
    const requiresUserScope = isPersonal || Boolean(raw.requiresUserScope);

    // 5. Clamp confidence to [0, 1]
    const confidence = Math.min(1, Math.max(0, raw.confidence ?? 0.5));

    return {
        intent: raw.intent as IntentType,
        confidence,
        retrieval,
        collections,
        entities: Array.isArray(raw.entities) ? raw.entities.map(String) : [],
        isPersonal,
        requiresUserScope,
    };
}

//Intent: Runs after the user types and sends their question (at runtime/conversation time).

//Bouncer (or Border Security) of your chatbot. 
//Its job is to protect your system from trusting the AI blindly.
//AIs can make mistakes, hallucinate, or be tricked by malicious users.
//Students can only check their own accounts.
//Wardens can access the hostel gate controls.
//Admins can access everything.
