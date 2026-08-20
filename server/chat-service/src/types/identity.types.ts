// server/chat-service/src/types/identity.types.ts
// Matches the ACTUAL user-service Prisma schema (prisma/schema.prisma)
// Updated after full audit on 2026-03-27

// School enum mirrors user-service
export type School = "BTECH" | "BBA" | "BCOM" | "BSC" | "BA" | "MTECH" | "MBA" | "MSC" | "MA";

export interface CourseRef {
    courseCode: string;
    courseName: string;
    credits: number;
    semester: number;
    department: string;
    school: School | null;
}

export interface StudentIdentity {
    profileId: string;              // StudentProfile.id
    enrollmentNumber: string;       // unique
    customEmail: string | null;     // university email if set
    school: School;                 // e.g. BTECH
    batch: string;                  // e.g. "2022-2026"
    year: number;
    semester: number;
    specialization: string | null;
    cgpa: number | null;            // Float? — may be null (not set on creation)
    backlogs: number;               // Int @default(0)
    hostelAssigned: boolean;
    hostelName: string | null;      // The hostel/block name (set via assignStudentHostel)
    roomNumber: string | null;
    fatherName: string | null;
    motherName: string | null;
    guardianName: string | null;
    parentContact: string | null;
    emergencyContact: string | null;
    warden: {
        name: string;
        email: string | null;       // warden's login email (from User)
    } | null;                       // null if student has no hostel assigned
    courses: CourseRef[];
}

export interface TeacherIdentity {
    profileId: string;              // TeacherProfile.id
    employeeId: string;             // unique
    department: string;
    designation: string;
    specialization: string | null;
    officeRoom: string | null;
    courses: CourseRef[];           // courses taught (Course.teacherId = profileId)
}

export interface WardenIdentity {
    profileId: string;             // WardenProfile.id
    employeeId: string;
    hostelAssigned: string;        // String — the hostel/block name they manage
    officeRoom: string | null;
    // Phase 2: studentCount, pendingOutpasses
}

export type UserRole = "STUDENT" | "TEACHER" | "WARDEN" | "ADMIN" | "PARENT" | "DEFAULT";

export interface UserIdentity {
    userId: string;                // User.id (cuid)
    name: string;                  // firstName + lastName
    email: string;                 // User.email (login email)
    role: UserRole;
    student?: StudentIdentity;
    teacher?: TeacherIdentity;
    warden?: WardenIdentity;
}
