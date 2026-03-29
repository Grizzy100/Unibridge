// client/lib/studentProfile.ts
// Fetches the student's own profile (hostelAssigned, hostelName, etc.)
// Used by the Sidebar to decide whether to show Outpass.

import { getToken, getUser } from './auth';

export interface StudentProfileBasic {
    hostelAssigned: boolean;
    hostelName: string | null;
    roomNumber: string | null;
}

const USER_SERVICE = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:3001';

export async function getMyStudentProfile(): Promise<StudentProfileBasic | null> {
    const token = getToken();
    const user = getUser();
    if (!token || !user) return null;

    try {
        const res = await fetch(`${USER_SERVICE}/api/profiles/students/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!res.ok) return null;

        const json = await res.json();
        const profile = json?.data;
        if (!profile) return null;

        return {
            hostelAssigned: !!profile.hostelAssigned,
            hostelName: profile.hostelName ?? null,
            roomNumber: profile.roomNumber ?? null,
        };
    } catch {
        return null;
    }
}
