import { getToken, getUser } from './auth';

const USER_SERVICE_URL =
  process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:3001';

export interface ParentWard {
  linkId: string;
  relationship: string;
  isPrimary: boolean;
  studentId: string;
  studentUserId: string;
  studentName: string;
  enrollmentNumber?: string;
  course?: string;
  email?: string;
}

interface ParentProfileResponse {
  success: boolean;
  data?: {
    id: string;
  };
}

interface ParentChildrenResponse {
  success: boolean;
  data?: Array<{
    id: string;
    relationship: string;
    isPrimary: boolean;
    studentId: string;
    student: {
      userId: string;
      firstName: string;
      lastName: string;
      enrollmentNumber?: string;
      course?: string;
      user?: {
        email?: string;
      };
    };
  }>;
}

export async function getParentPrimaryWard(): Promise<ParentWard | null> {
  const token = getToken();
  const user = getUser();

  if (!token || !user?.id) {
    return null;
  }

  const parentRes = await fetch(`${USER_SERVICE_URL}/api/profile/parents/${user.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!parentRes.ok) {
    return null;
  }

  const parentJson = (await parentRes.json()) as ParentProfileResponse;
  const parentId = parentJson.data?.id;
  if (!parentId) {
    return null;
  }

  const childrenRes = await fetch(
    `${USER_SERVICE_URL}/api/parent-student/parent/${parentId}/children`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!childrenRes.ok) {
    return null;
  }

  const childrenJson = (await childrenRes.json()) as ParentChildrenResponse;
  const children = childrenJson.data || [];

  if (!children.length) {
    return null;
  }

  const selected = children.find((c) => c.isPrimary) || children[0];

  return {
    linkId: selected.id,
    relationship: selected.relationship,
    isPrimary: selected.isPrimary,
    studentId: selected.studentId,
    studentUserId: selected.student.userId,
    studentName: `${selected.student.firstName} ${selected.student.lastName}`,
    enrollmentNumber: selected.student.enrollmentNumber,
    course: selected.student.course,
    email: selected.student.user?.email,
  };
}
