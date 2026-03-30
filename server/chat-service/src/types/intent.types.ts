// server/chat-service/src/types/intent.types.ts

export type RetrievalStrategy =
    | "IDENTITY_ONLY"
    | "NEONDB_ONLY"
    | "CHROMADB_ONLY"
    | "HYBRID"
    | "REST_API"
    | "SKIP_RETRIEVAL"
    | "HARD_FALLBACK";

export type StudentIntent =
    | "PERSONAL_PROFILE"
    | "PERSONAL_ACADEMIC"
    | "PERSONAL_ATTENDANCE"
    | "PERSONAL_TASKS"
    | "PERSONAL_HOSTEL"
    | "PERSONAL_ELIGIBILITY"
    | "QUERY_TEACHER"
    | "QUERY_POLICY"
    | "QUERY_ACADEMIC_INFO"
    | "SMALLTALK"
    | "OUT_OF_SCOPE";

export type TeacherIntent =
    | "PERSONAL_PROFILE"
    | "PERSONAL_COURSES"
    | "STUDENT_SUBMISSIONS"
    | "STUDENT_ATTENDANCE"
    | "QUERY_POLICY"
    | "SMALLTALK"
    | "OUT_OF_SCOPE";

export type WardenIntent =
    | "STUDENT_OUTPASS"
    | "HOSTEL_POLICY"
    | "BLOCK_OVERVIEW"
    | "SMALLTALK"
    | "OUT_OF_SCOPE";

export type IntentType = StudentIntent | TeacherIntent | WardenIntent;

export interface IntentResult {
    intent: IntentType;
    confidence: number;
    retrieval: RetrievalStrategy;
    collections: string[];
    entities: string[];
    isPersonal: boolean;
    requiresUserScope: boolean;
}

// Structured data retrieved from NeonDB or REST APIs
export type StructuredData = Record<string, unknown> | null;

// Semantic chunks from ChromaDB
export type SemanticChunks = string[] | null;
