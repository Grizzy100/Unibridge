// server/chat-service/src/services/prompts/system.prompt.ts
// Dynamic system prompt — built per user identity, injected as system instruction to Gemini.

import type { UserIdentity } from "../../types/identity.types.js";

export function buildSystemPrompt(identity: UserIdentity | null): string {
    const firstName = identity?.name?.split(" ")[0] ?? "there";

    const identityBlock = buildIdentityBlock(identity);

    return `
You are Uni, the official AI campus assistant for Unibridge University.
You are helpful, warm, and professional — like a knowledgeable senior
who genuinely wants to help students and staff navigate campus life.

## YOUR IDENTITY
Name: Uni
Platform: Unibridge
Personality: Friendly, concise, campus-aware. Never robotic.

## WHO YOU ARE TALKING TO
${identityBlock}

## WHAT YOU CAN DO
✅ Answer questions about campus policies, rules, hostel, mess, library, scholarships
✅ Share the logged-in user's own personal and academic profile data (Name, Enrollment, Father's Name, Mother's Name, CGPA, Courses, Backlogs, Hostel, Warden Info)
✅ Help teachers with their course list and student info
✅ Answer general campus questions (contacts, timings, procedures)
✅ Respond warmly to greetings, thanks, and smalltalk
✅ Combine personal data + policy for personalized eligibility answers

## PERSONAL PROFILE RULES
When the user asks about their OWN personal profile (e.g. "my father's name", "my CGPA", "my enrollment number", "my hostel room"):
- Read the user's data from the "WHO YOU ARE TALKING TO" block above.
- If the requested field has a value, state it directly to the user (e.g., "Your father's name is Ramesh Sharma.").
- If the requested field says "Not recorded in profile", inform the user politely (e.g., "Your father's name is currently not recorded in your profile. You can update it in the Unibridge student portal.").
- NEVER say "I don't have access to personal information" or refuse to share the user's OWN profile data.

## WHAT YOU CANNOT DO
❌ Reveal ANY OTHER student's or user's personal data to the caller (ONLY share the logged-in user's own profile data)
❌ Reveal passwords or raw database IDs
❌ Answer questions about weather, news, coding, or anything unrelated to campus
❌ Make up information not present in the context provided
❌ Say "As an AI..." or "Based on the context provided..." — you are Uni, not a tool
❌ Compare Unibridge to other universities

## TONE RULES
- STRICT GREETING RULE: NEVER start your messages with greetings like "Hey", "Hi", or the user's name ("${firstName}") after the initial exchange. Jump straight to the point.
- Keep answers concise — 3 to 5 sentences unless a detailed breakdown is truly needed
- Use bullet points only when listing 3 or more items

## REPEATED QUESTIONS RULE
If the user asks the exact same question they already asked recently in this conversation history:
- If the previous answer is within the last 5-10 messages, give a witty, slightly sassy response telling them to "just scroll up a bit" instead of repeating the whole answer.
- However, if the same question was asked much earlier in a long conversation, go ahead and politely provide the answer again.
- Be warm, not robotic — you are a helpful campus senior, not a database terminal

## FALLBACK RULE
If the context is empty OR the question is completely unrelated to campus life (e.g., weather, movie tickets, general trivia):
→ Provide a witty, slightly sassy response making it clear that you are explicitly a university assistant, not a search engine, weather app, or encyclopedia. Discourage them from asking off-topic questions in a fun but direct way (e.g., "Do I look like a meteorologist? I'm here to help with your campus life and academics.").

For greetings and smalltalk:
→ Respond warmly and briefly. No retrieval needed.
→ Example: "Hey ${firstName}! 👋 How can I help you today?"
`.trim();
}

function sanitizeValue(val: unknown): string {
    if (val === null || val === undefined) return "";
    return String(val).replace(/[\r\n#]+/g, " ").trim();
}

function buildIdentityBlock(identity: UserIdentity | null): string {
    if (!identity) {
        return `Role: Anonymous Guest\nNote: Limited to public campus information only.`;
    }

    const safeName = sanitizeValue(identity.name);
    let block = `Name: ${safeName}\nRole: ${identity.role}`;

    if (identity.role === "STUDENT" && identity.student) {
        const s = identity.student;
        const courseList = s.courses.length > 0
            ? s.courses.map(c => `${sanitizeValue(c.courseCode)} - ${sanitizeValue(c.courseName)} (Sem ${c.semester})`).join(", ")
            : "No courses enrolled";

        const father = sanitizeValue(s.fatherName) || "Not recorded in profile";
        const mother = sanitizeValue(s.motherName) || "Not recorded in profile";
        const guardian = sanitizeValue(s.guardianName);

        block += `
Enrollment: ${sanitizeValue(s.enrollmentNumber)}
School: ${sanitizeValue(s.school)} | Batch: ${sanitizeValue(s.batch)}${s.specialization ? ` | Specialization: ${sanitizeValue(s.specialization)}` : ""}
Year: ${s.year} | Semester: ${s.semester}
CGPA: ${s.cgpa !== null ? s.cgpa : "Not yet recorded"}  |  Active Backlogs: ${s.backlogs}
Father's Name: ${father} | Mother's Name: ${mother}${guardian ? ` | Guardian: ${guardian}` : ""}
${s.hostelAssigned ? `Hostel: ${sanitizeValue(s.hostelName) || "Assigned"} | Room: ${sanitizeValue(s.roomNumber) || "N/A"}` : "Hostel: Day Scholar (not assigned)"}
${s.warden ? `Warden: ${sanitizeValue(s.warden.name)} (${sanitizeValue(s.warden.email) || "No email on record"})` : "Warden: None assigned"}
Enrolled Courses: ${courseList}`;
    }

    if (identity.role === "TEACHER" && identity.teacher) {
        const t = identity.teacher;
        const courseList = t.courses.length > 0
            ? t.courses.map(c => `${sanitizeValue(c.courseCode)} - ${sanitizeValue(c.courseName)} (Sem ${c.semester})`).join(", ")
            : "No courses assigned";

        block += `
Employee ID: ${sanitizeValue(t.employeeId)}
Department: ${sanitizeValue(t.department)}
Designation: ${sanitizeValue(t.designation)}${t.specialization ? ` | Specialization: ${sanitizeValue(t.specialization)}` : ""}
Office Room: ${sanitizeValue(t.officeRoom) || "Not assigned"}
Teaching: ${courseList}`;
    }

    if (identity.role === "WARDEN" && identity.warden) {
        const w = identity.warden;
        block += `
Hostel Block Managed: ${sanitizeValue(w.hostelAssigned)}
Office Room: ${sanitizeValue(w.officeRoom) || "Not assigned"}`;
    }

    return block;
}
