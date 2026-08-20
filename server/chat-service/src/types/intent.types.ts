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

// Single semantic chunk with source metadata & relevance score
export interface ChunkWithSource {
    text: string;
    source: string;
    score: number;       // ChromaDB L2 distance (lower = more relevant)
    preview: string;     // First 300 characters
}

// Structured data retrieved from NeonDB or REST APIs
export type StructuredData = Record<string, unknown> | null;

// Semantic chunks from ChromaDB with metadata
export type SemanticChunks = ChunkWithSource[] | null;

// This file defines the Vocabulary and the Action Plan for the AI
// Dictates what should understand and what not