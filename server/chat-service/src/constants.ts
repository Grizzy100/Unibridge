// server/chat-service/src/constants.ts

// ─────────────────────────────────────────────
// Role-to-collections whitelist
// Used by intent validator and retrieval router
// ─────────────────────────────────────────────

export const ROLE_COLLECTIONS: Record<string, string[]> = {
    STUDENT: [
        "student_profiles",
        "teacher_profiles",
        "warden_profiles",
        "courses",
        "scholarships",
        "knowledge_base",
    ],
    TEACHER: [
        "teacher_profiles",
        "courses",
        "knowledge_base",
    ],
    WARDEN: [
        "warden_profiles",
        "knowledge_base",
    ],
    DEFAULT: ["knowledge_base"],
};

// ─────────────────────────────────────────────
// Fallback message — shown when context is empty
// or intent is OUT_OF_SCOPE / HARD_FALLBACK
// ─────────────────────────────────────────────

export const FALLBACK_MESSAGE =
    "I don't have that information right now. For the most accurate details, " +
    "please check the Unibridge portal or contact your department office directly. " +
    "Is there anything else I can help you with?";

// ─────────────────────────────────────────────
// ChromaDB results per collection per query
// ─────────────────────────────────────────────

export const TOP_K = 4;

// ─────────────────────────────────────────────
// ChromaDB L2 Distance Threshold
// 0.0 = perfect match, 2.0 = completely unrelated.
// Results with distance >= 0.8 are filtered out.
// ─────────────────────────────────────────────

export const CHROMA_DISTANCE_THRESHOLD = 0.8;

// ─────────────────────────────────────────────
// Text Chunking Config (Sliding Window with Overlap)
// ─────────────────────────────────────────────

export const CHUNK_SIZE = 1000;
export const CHUNK_OVERLAP = 200;

// ─────────────────────────────────────────────
// Context character budget (~3000 tokens ≈ 12000 chars)
// ─────────────────────────────────────────────

export const CONTEXT_CHAR_BUDGET = 12_000;

