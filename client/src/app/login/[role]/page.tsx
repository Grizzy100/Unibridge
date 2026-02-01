// client/src/app/login/[role]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import LoginLayout from '../../../../components/auth/LoginLayout';
import RoleLoginForm from '../../../../components/auth/RoleLoginForm';
import { useEffect } from 'react';

// Allowed roles
const roles = ['student', 'teacher', 'warden'] as const;
type UserRole = typeof roles[number];

export default function LoginRolePage() {
  const { role } = useParams();
  const router = useRouter();

  useEffect(() => {
    // If the role is invalid, redirect to a default or home
    if (!roles.includes(role as UserRole)) {
      router.replace('/login/student');
    }
  }, [role, router]);

  if (!roles.includes(role as UserRole)) {
    return null; // Or loading spinner
  }

  return (
    <LoginLayout>
      <RoleLoginForm defaultRole={role as UserRole} />
    </LoginLayout>
  );
}
