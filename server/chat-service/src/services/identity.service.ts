// server/chat-service/src/services/identity.service.ts
// Fetches and builds the full user identity from NeonDB.
// Column names are validated against the actual Prisma schema.
// Called once per session on first message, then cached in-memory.

import { sql } from "../lib/neon.js";
import type {
    UserIdentity,
    StudentIdentity,
    TeacherIdentity,
    WardenIdentity,
    CourseRef,
} from "../types/identity.types.js";

// ─────────────────────────────────────────────
// Student Identity
// ─────────────────────────────────────────────

async function buildStudentIdentity(userId: string): Promise<UserIdentity | null> {
    // Single query: student profile + user email + warden (if hostel assigned)
    const rows = await sql`
        SELECT
            s.id                AS "profileId",
            s."firstName",
            s."lastName",
            s."enrollmentNumber",
            s."customEmail",
            s.school,
            s.batch,
            s.year,
            s.semester,
            s.specialization,
            s.cgpa,
            s.backlogs,
            s."hostelAssigned",
            s."hostelName",
            s."roomNumber",
            s."fatherName",
            s."motherName",
            s."guardianName",
            s."parentContact",
            s."emergencyContact",
            u.email             AS "userEmail",
            w."firstName"       AS "wFirst",
            w."lastName"        AS "wLast",
            wu.email            AS "wEmail"
        FROM "StudentProfile" s
        JOIN "User" u           ON u.id = s."userId"
        LEFT JOIN "WardenProfile" w  ON w."hostelAssigned" = s."hostelName"
        LEFT JOIN "User" wu          ON wu.id = w."userId"
        WHERE s."userId" = ${userId}
    `;

    if (rows.length === 0) return null;
    const row = rows[0];

    // Fetch enrolled courses with full details
    const courses = await sql`
        SELECT
            c."courseCode",
            c."courseName",
            c.credits,
            c.semester,
            c.department,
            c.school
        FROM "CourseEnrollment" e
        JOIN "Course" c ON c.id = e."courseId"
        WHERE e."studentId" = ${row.profileId}
        ORDER BY c.semester, c."courseCode"
    `;

    // Warden is only present if student has a hostel assigned
    const hasWarden = row.hostelAssigned && row.hostelName && row.wFirst;

    const student: StudentIdentity = {
        profileId:        String(row.profileId),
        enrollmentNumber: String(row.enrollmentNumber),
        customEmail:      row.customEmail ? String(row.customEmail) : null,
        school:           row.school as StudentIdentity["school"],
        batch:            String(row.batch),
        year:             Number(row.year),
        semester:         Number(row.semester),
        specialization:   row.specialization ? String(row.specialization) : null,
        cgpa:             row.cgpa !== null && row.cgpa !== undefined ? Number(row.cgpa) : null,
        backlogs:         Number(row.backlogs ?? 0),
        hostelAssigned:   Boolean(row.hostelAssigned),
        hostelName:       row.hostelName ? String(row.hostelName) : null,
        roomNumber:       row.roomNumber ? String(row.roomNumber) : null,
        fatherName:       row.fatherName ? String(row.fatherName) : null,
        motherName:       row.motherName ? String(row.motherName) : null,
        guardianName:     row.guardianName ? String(row.guardianName) : null,
        parentContact:    row.parentContact ? String(row.parentContact) : null,
        emergencyContact: row.emergencyContact ? String(row.emergencyContact) : null,
        warden: hasWarden ? {
            name:  `${row.wFirst} ${row.wLast ?? ""}`.trim(),
            email: row.wEmail ? String(row.wEmail) : null,
        } : null,
        courses: courses.map((c: any): CourseRef => ({
            courseCode:  c.courseCode,
            courseName:  c.courseName,
            credits:     Number(c.credits),
            semester:    Number(c.semester),
            department:  c.department,
            school:      c.school ?? null,
        })),
    };

    return {
        userId,
        name:  `${row.firstName} ${row.lastName}`.trim(),
        email: String(row.userEmail),
        role:  "STUDENT",
        student,
    };
}

// ─────────────────────────────────────────────
// Teacher Identity
// ─────────────────────────────────────────────

async function buildTeacherIdentity(userId: string): Promise<UserIdentity | null> {
    const rows = await sql`
        SELECT
            t.id              AS "profileId",
            t."firstName",
            t."lastName",
            t."employeeId",
            t.department,
            t.designation,
            t.specialization,
            t."officeRoom",
            u.email           AS "userEmail"
        FROM "TeacherProfile" t
        JOIN "User" u ON u.id = t."userId"
        WHERE t."userId" = ${userId}
    `;

    if (rows.length === 0) return null;
    const row = rows[0];

    // Courses taught (Course.teacherId = TeacherProfile.id)
    const courses = await sql`
        SELECT
            "courseCode",
            "courseName",
            credits,
            semester,
            department,
            school
        FROM "Course"
        WHERE "teacherId" = ${row.profileId}
        ORDER BY semester, "courseCode"
    `;

    const teacher: TeacherIdentity = {
        profileId:      String(row.profileId),
        employeeId:     String(row.employeeId),
        department:     String(row.department),
        designation:    String(row.designation),
        specialization: row.specialization ? String(row.specialization) : null,
        officeRoom:     row.officeRoom ? String(row.officeRoom) : null,
        courses: courses.map((c: any): CourseRef => ({
            courseCode:  c.courseCode,
            courseName:  c.courseName,
            credits:     Number(c.credits),
            semester:    Number(c.semester),
            department:  c.department,
            school:      c.school ?? null,
        })),
    };

    return {
        userId,
        name:  `${row.firstName} ${row.lastName}`.trim(),
        email: String(row.userEmail),
        role:  "TEACHER",
        teacher,
    };
}

// ─────────────────────────────────────────────
// Warden Identity (Phase 1 — basic)
// ─────────────────────────────────────────────

async function buildWardenIdentity(userId: string): Promise<UserIdentity | null> {
    const rows = await sql`
        SELECT
            w.id              AS "profileId",
            w."firstName",
            w."lastName",
            w."employeeId",
            w."hostelAssigned",
            w."officeRoom",
            u.email           AS "userEmail"
        FROM "WardenProfile" w
        JOIN "User" u ON u.id = w."userId"
        WHERE w."userId" = ${userId}
    `;

    if (rows.length === 0) return null;
    const row = rows[0];

    const warden: WardenIdentity = {
        profileId:     String(row.profileId),
        employeeId:    String(row.employeeId),
        hostelAssigned: String(row.hostelAssigned), // The hostel/block name they manage
        officeRoom:    row.officeRoom ? String(row.officeRoom) : null,
    };

    return {
        userId,
        name:  `${row.firstName} ${row.lastName}`.trim(),
        email: String(row.userEmail),
        role:  "WARDEN",
        warden,
    };
}

// ─────────────────────────────────────────────
// Public entry point
// ─────────────────────────────────────────────

export async function buildIdentity(userId: string, role: string): Promise<UserIdentity | null> {
    try {
        if (role === "STUDENT") return await buildStudentIdentity(userId);
        if (role === "TEACHER") return await buildTeacherIdentity(userId);
        if (role === "WARDEN")  return await buildWardenIdentity(userId);
        return null;
    } catch (err: any) {
        console.error(`[IdentityService] Failed to build identity for userId=${userId} role=${role}: ${err?.message}`);
        return null;
    }
}
