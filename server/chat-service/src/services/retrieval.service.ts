// server/chat-service/src/services/retrieval.service.ts
// Hybrid retrieval router. Routes to NeonDB, REST APIs, ChromaDB, or a combo
// based on intent. All retrieval calls are wrapped in a 3s timeout.

import { getCollection } from "./chroma.service.js";
import type { UserIdentity } from "../types/identity.types.js";
import type { IntentResult, IntentType, StructuredData, SemanticChunks, ChunkWithSource } from "../types/intent.types.js";
import { TOP_K, CHROMA_DISTANCE_THRESHOLD } from "../constants.js";
import { sql } from "../lib/neon.js";

const RETRIEVAL_TIMEOUT_MS = 3000;

export interface RetrievalResult {
    structuredData: StructuredData;
    semanticChunks: SemanticChunks;
}

// ─────────────────────────────────────────────
// Public entry point
// ─────────────────────────────────────────────

export async function hybridRetrieve(
    intent: IntentResult,
    identity: UserIdentity | null,
    message: string,
    jwt: string | null = null
): Promise<RetrievalResult> {
    try {
        return await withTimeout(doRetrieve(intent, identity, message, jwt), RETRIEVAL_TIMEOUT_MS);
    } catch (err: any) {
        console.warn(`[RetrievalService] Retrieval failed or timed out: ${err?.message}`);
        return { structuredData: null, semanticChunks: null };
    }
}

// ─────────────────────────────────────────────
// Intent coverage map
// Compile-time guard: every IntentType key must be present
// ─────────────────────────────────────────────

export const INTENT_HANDLER_COVERAGE: Record<IntentType, true> = {
    PERSONAL_PROFILE: true,
    PERSONAL_ACADEMIC: true,
    PERSONAL_ATTENDANCE: true,
    PERSONAL_TASKS: true,
    PERSONAL_HOSTEL: true,
    PERSONAL_ELIGIBILITY: true,
    QUERY_TEACHER: true,
    QUERY_POLICY: true,
    QUERY_ACADEMIC_INFO: true,
    SMALLTALK: true,
    OUT_OF_SCOPE: true,
    PERSONAL_COURSES: true,
    STUDENT_SUBMISSIONS: true,
    STUDENT_ATTENDANCE: true,
    STUDENT_OUTPASS: true,
    HOSTEL_POLICY: true,
    BLOCK_OVERVIEW: true,
};

// ─────────────────────────────────────────────
// Core routing logic
// ─────────────────────────────────────────────

async function doRetrieve(
    intent: IntentResult,
    identity: UserIdentity | null,
    message: string,
    jwt: string | null
): Promise<RetrievalResult> {
    const { retrieval, collections } = intent;

    switch (retrieval) {
        case "IDENTITY_ONLY":
        case "SKIP_RETRIEVAL":
        case "HARD_FALLBACK":
            return { structuredData: null, semanticChunks: null };

        case "CHROMADB_ONLY":
            return {
                structuredData: null,
                semanticChunks: await queryChromaDB(message, collections),
            };

        case "NEONDB_ONLY":
            return {
                structuredData: await queryNeonDB(intent, identity),
                semanticChunks: null,
            };

        case "REST_API":
            return {
                structuredData: await callServiceAPI(intent, identity, jwt),
                semanticChunks: null,
            };

        case "HYBRID":
            const [structuredData, semanticChunks] = await Promise.all([
                queryNeonDB(intent, identity),
                queryChromaDB(message, collections),
            ]);
            return { structuredData, semanticChunks };

        default:
            return {
                structuredData: null,
                semanticChunks: await queryChromaDB(message, collections),
            };
    }
}

// ─────────────────────────────────────────────
// ChromaDB semantic search with Distance Thresholding
// ─────────────────────────────────────────────

async function queryChromaDB(question: string, collections: string[]): Promise<SemanticChunks> {
    if (collections.length === 0) return null;

    const results = await Promise.allSettled(
        collections.map(async (name) => {
            try {
                const col = await getCollection(name);
                const count = await col.count();
                if (count === 0) return [];
                const res = await col.query({
                    queryTexts: [question],
                    nResults: Math.min(TOP_K, count),
                    include: ["documents" as any, "distances" as any, "metadatas" as any],
                });

                const docs = res.documents[0] ?? [];
                const distances = res.distances?.[0] ?? [];
                const metas = res.metadatas?.[0] ?? [];

                const items: ChunkWithSource[] = [];

                for (let i = 0; i < docs.length; i++) {
                    const text = docs[i];
                    const dist = distances[i] ?? 1.0;
                    const meta = metas[i] ?? {};
                    const source = String(meta.source ?? name);

                    if (text && Boolean(text.trim()) && dist < CHROMA_DISTANCE_THRESHOLD) {
                        items.push({
                            text: text.trim(),
                            source,
                            score: Number(dist.toFixed(4)),
                            preview: text.trim().slice(0, 300),
                        });
                    }
                }

                return items;
            } catch (err: any) {
                console.warn(`[RetrievalService] Failed ChromaDB query on collection ${name}: ${err?.message}`);
                return [];
            }
        })
    );

    const chunks = results
        .filter((r): r is PromiseFulfilledResult<ChunkWithSource[]> => r.status === "fulfilled")
        .flatMap(r => r.value);

    return chunks.length > 0 ? chunks : null;
}


// ─────────────────────────────────────────────
// NeonDB structured queries (for eligibility, academic lookups)
// ─────────────────────────────────────────────

async function queryNeonDB(
    intent: IntentResult,
    identity: UserIdentity | null
): Promise<StructuredData> {
    if (!identity) return null;

    // Currently: NeonDB queries are used for personal eligibility checks
    // The student's full profile is already in the identity object,
    // so we return it for the context prompt to use
    if (intent.intent === "PERSONAL_ELIGIBILITY" && identity.student) {
        return {
            cgpa: identity.student.cgpa,
            backlogs: identity.student.backlogs,
            semester: identity.student.semester,
            school: identity.student.school,
            hostelAssigned: identity.student.hostelAssigned,
        };
    }

    return null;
}

// ─────────────────────────────────────────────
// REST API calls to sibling microservices
// ─────────────────────────────────────────────

async function callServiceAPI(
    intent: IntentResult,
    identity: UserIdentity | null,
    jwt: string | null
): Promise<StructuredData> {
    if (!identity || !jwt) return null;

    const headers = { Authorization: `Bearer ${jwt}` };

    // Attendance data (Student)
    if (intent.intent === "PERSONAL_ATTENDANCE") {
        const url = `${process.env.ATTENDANCE_SERVICE_URL ?? "http://attendance-service:3004"}/api/attendance/my`;
        const res = await fetch(url, { headers });
        if (!res.ok) return null;
        const data = await res.json();
        // Return a summary, not raw records
        return summarizeAttendance(data);
    }

    // Task/assignment data (Student & Teacher)
    if (intent.intent === "PERSONAL_TASKS" || intent.intent === "STUDENT_SUBMISSIONS") {
        const url = `${process.env.TASK_SERVICE_URL ?? "http://task-service:3005"}/api/tasks/${intent.intent === "PERSONAL_TASKS" ? "student" : "teacher"}`;
        const res = await fetch(url, { headers });
        if (!res.ok) return null;
        const data = await res.json();
        return summarizeTasks(data);
    }

    // Outpass requests (Warden)
    if (intent.intent === "STUDENT_OUTPASS" || intent.intent === "BLOCK_OVERVIEW") {
        const url = `${process.env.OUTPASS_SERVICE_URL ?? "http://outpass-service:3003"}/api/outpass/warden/requests`;
        const res = await fetch(url, { headers });
        if (!res.ok) return null;
        const data = await res.json();
        return summarizeOutpasses(data);
    }

    // Student Attendance for a Teacher
    if (intent.intent === "STUDENT_ATTENDANCE" && identity.role === "TEACHER") {
        const url = `${process.env.ATTENDANCE_SERVICE_URL ?? "http://attendance-service:3004"}/api/attendance/teacher/sessions`;
        const res = await fetch(url, { headers });
        if (!res.ok) return null;
        const data = await res.json();
        return summarizeTeacherAttendance(data);
    }

    return null;
}

// ─────────────────────────────────────────────
// Response shapers — prevent raw data dumps into prompt
// ─────────────────────────────────────────────

function summarizeOutpasses(raw: any): StructuredData {
    if (!raw || !Array.isArray(raw)) return null;
    
    const pending = raw.filter((r: any) => r.status === "PENDING").length;
    const approved = raw.filter((r: any) => r.status === "APPROVED").length;
    
    return {
        totalRequestsInBlock: raw.length,
        pendingApproval: pending,
        recentlyApproved: approved,
        recentRequests: raw.slice(0, 5).map((r: any) => ({
            studentId: r.studentId,
            reason: r.reason,
            status: r.status,
            date: r.departureDate ? new Date(r.departureDate).toLocaleDateString() : "N/A"
        }))
    };
}

function summarizeTeacherAttendance(raw: any): StructuredData {
    if (!raw || !Array.isArray(raw)) return null;
    
    return {
        recentSessions: raw.slice(0, 5).map((s: any) => ({
            courseId: s.courseId,
            date: s.date ? new Date(s.date).toLocaleDateString() : "N/A",
            totalStudents: s.attendance?.length ?? 0,
            presentCount: s.attendance?.filter((a: any) => a.status === "PRESENT").length ?? 0
        }))
    };
}

function summarizeAttendance(raw: any): StructuredData {
    if (!raw || !Array.isArray(raw)) return null;

    const total = raw.length;
    const present = raw.filter((r: any) => r.status === "PRESENT").length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : "N/A";

    return {
        totalClasses: total,
        attended: present,
        attendancePercentage: `${percentage}%`,
    };
}

function summarizeTasks(raw: any): StructuredData {
    if (!raw || !Array.isArray(raw)) return null;

    const tasks = raw.slice(0, 10); // cap at 10 for prompt budget
    return {
        taskCount: raw.length,
        tasks: tasks.map((t: any) => ({
            title: t.title,
            status: t.submissions?.[0]?.status ?? "PENDING",
            dueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "N/A",
            marks: t.submissions?.[0]?.marks ?? null,
        })),
    };
}

// ─────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`Retrieval timed out after ${ms}ms`)), ms)
        ),
    ]);
}
