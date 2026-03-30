// Syncs rows from the Postgres database into ChromaDB collections.
// IMPORTANT: Mappers only include safe, public-facing fields.
// Sensitive personal data (CGPA, address, phone, blood group, etc.) is NEVER embedded.

import { sql } from "../lib/neon.js";
import { getCollection } from "./chroma.service.js";

// ─────────────────────────────────────────────
// Source configuration
// ─────────────────────────────────────────────

interface SourceConfig {
  name: string;
  query: string;
  collection: string;
  idPrefix: string;
  buildId: (row: Record<string, unknown>, index: number) => string;
  mapper: (row: Record<string, unknown>) => string;
}

const sources: SourceConfig[] = [
  // ── Students (public info only) ──────────────────────────────────────────
  {
    name: "StudentProfile",
    query: `SELECT * FROM "StudentProfile"`,
    collection: "student_profiles",
    idPrefix: "student",
    buildId: (row, i) => `student-${String(row.id ?? i)}`,
    mapper: (row) => {
      const name = `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim();
      const parts = [
        `Student: ${name}.`,
        `Enrollment Number: ${row.enrollmentNumber ?? "N/A"}.`,
        `School: ${row.school ?? "N/A"}.`,
        `Batch: ${row.batch ?? "N/A"}.`,
        `Year: ${row.year ?? "N/A"}, Semester: ${row.semester ?? "N/A"}.`,
        row.specialization ? `Specialization: ${row.specialization}.` : "",
        row.hostelAssigned
          ? `Hostel: Assigned — Block: ${row.hostelName ?? "N/A"}.`
          : "Hostel: Not assigned (day scholar).",
      ];
      return parts.filter(Boolean).join(" ");
    },
  },

  // ── Teachers (public info only) ──────────────────────────────────────────
  {
    name: "TeacherProfile",
    query: `SELECT * FROM "TeacherProfile"`,
    collection: "teacher_profiles",
    idPrefix: "teacher",
    buildId: (row, i) => `teacher-${String(row.id ?? i)}`,
    mapper: (row) => {
      const name = `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim();
      const parts = [
        `Teacher: ${name}.`,
        `Department: ${row.department ?? "N/A"}.`,
        `Designation: ${row.designation ?? "N/A"}.`,
        row.specialization ? `Specialization: ${row.specialization}.` : "",
        row.officeRoom ? `Office Room: ${row.officeRoom}.` : "",
        `Date of Joining: ${row.dateOfJoining ? new Date(row.dateOfJoining as string).getFullYear() : "N/A"}.`,
      ];
      return parts.filter(Boolean).join(" ");
    },
  },

  // ── Wardens (block contact info — no personal details) ───────────────────
  {
    name: "WardenProfile",
    // Join with User table to get the email address
    query: `SELECT wp.*, u.email as "wardenEmail" FROM "WardenProfile" wp JOIN "User" u ON u.id = wp."userId"`,
    collection: "warden_profiles",
    idPrefix: "warden",
    buildId: (row, i) => `warden-${String(row.id ?? i)}`,
    mapper: (row) => {
      const name = `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim();
      const parts = [
        `Warden: ${name}.`,
        `Hostel Block: ${row.hostelAssigned ?? "N/A"}.`,
        `Email: ${row.wardenEmail ?? "Not available"}.`,
        row.officeRoom ? `Office Room: ${row.officeRoom}.` : "",
      ];
      return parts.filter(Boolean).join(" ");
    },
  },

  // ── Courses ───────────────────────────────────────────────────────────────
  {
    name: "Course",
    query: `
      SELECT c.*, tp."firstName" as "teacherFirstName", tp."lastName" as "teacherLastName"
      FROM "Course" c
      LEFT JOIN "TeacherProfile" tp ON tp.id = c."teacherId"
    `,
    collection: "courses",
    idPrefix: "course",
    buildId: (row, i) => `course-${String(row.id ?? i)}`,
    mapper: (row) => {
      const teacherName = `${row.teacherFirstName ?? ""} ${row.teacherLastName ?? ""}`.trim();
      const parts = [
        `Course: ${row.courseName ?? "N/A"} (${row.courseCode ?? "N/A"}).`,
        `Department: ${row.department ?? "N/A"}.`,
        `Credits: ${row.credits ?? "N/A"}, Semester: ${row.semester ?? "N/A"}.`,
        teacherName ? `Taught by: ${teacherName}.` : "",
        row.description ? `Description: ${row.description}.` : "",
      ];
      return parts.filter(Boolean).join(" ");
    },
  },

  /*
    // ── Scholarships (already existed — keeping) ──────────────────────────────
    {
      name: process.env.SCHOLARSHIP_TABLE ?? "scholarships",
      query: `SELECT * FROM "${process.env.SCHOLARSHIP_TABLE ?? "scholarships"}"`,
      collection: "scholarships",
      idPrefix: "scholarship",
      buildId: (row, i) => `scholarship-${String(row.id ?? i)}`,
      mapper: (row) => {
        const name = String(row.name ?? row.title ?? "Unnamed scholarship");
        const parts = [
          `Scholarship: ${name}.`,
          `Eligibility: ${row.criteria ?? row.eligibility_criteria ?? "Not specified"}.`,
          `Revoke conditions: ${row.revoke_conditions ?? row.revoke_criteria ?? "Not specified"}.`,
          `Amount: ${row.amount ?? row.grant_amount ?? "Not specified"}.`,
          `Deadline: ${row.deadline ?? row.application_deadline ?? "Not specified"}.`,
          `Department: ${row.department ?? "All"}.`,
        ];
        return parts.filter(Boolean).join(" ");
      },
    },
  
    // ── Policies (already existed — keeping) ──────────────────────────────────
    {
      name: process.env.POLICY_TABLE ?? "policies",
      query: `SELECT * FROM "${process.env.POLICY_TABLE ?? "policies"}"`,
      collection: "policies",
      idPrefix: "policy",
      buildId: (row, i) => `policy-${String(row.id ?? i)}`,
      mapper: (row) => {
        const parts = [
          `Policy: ${row.title ?? row.name ?? "Untitled"}.`,
          `Category: ${row.category ?? "General"}.`,
          `Description: ${row.description ?? row.details ?? "No description"}.`,
          `Effective date: ${row.effective_date ?? "Not specified"}.`,
        ];
        return parts.filter(Boolean).join(" ");
      },
    },
  */
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

async function fetchRows(query: string, sourceName: string): Promise<Record<string, unknown>[]> {
  try {
    return (await sql.unsafe(query)) as Record<string, unknown>[];
  } catch (err) {
    console.warn(`[sync] Skipping "${sourceName}": ${(err as Error).message}`);
    return [];
  }
}

// ─────────────────────────────────────────────
// Main sync function
// ─────────────────────────────────────────────

export async function syncToChroma(): Promise<void> {
  console.log("[sync] Starting database → ChromaDB sync");

  for (const source of sources) {
    const rows = await fetchRows(source.query, source.name);

    if (rows.length === 0) {
      console.log(`[sync] "${source.name}": 0 rows — skipping`);
      continue;
    }

    const ids = rows.map((row, i) => source.buildId(row, i));
    const documents = rows.map(source.mapper);
    const metadatas = rows.map((row) => ({
      source: source.name,
      rowId: String(row.id ?? ""),
      ...(row.userId ? { userId: String(row.userId) } : {})
    }));

    const collection = await getCollection(source.collection);
    await collection.upsert({ ids, documents, metadatas });

    console.log(`[sync] "${source.name}": ${rows.length} rows → "${source.collection}"`);
  }

  console.log("[sync] Sync complete.");
}
