// client/src/app/(dashboard)/student-dashboard/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from './components/DashboardLayout';
import HomeTabNav from './components/HomeTabNav';
import PersonalSpace from './components/PersonalSpace';
import { getUser, getToken } from '../../../../lib/auth';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const auth = useMemo(() => {
    if (!mounted) return { ok: false, loading: true };

    const user = getUser();
    const token = getToken();

    const ok = !!user && !!token && user.role === 'STUDENT';
    return { ok, loading: false };
  }, [mounted]);

  useEffect(() => {
    if (!auth.loading && !auth.ok) {
      router.replace('/login/student');
    }
  }, [auth.loading, auth.ok, router]);

  if (!mounted || auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto" />
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!auth.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Redirecting...</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 pb-20"> {/* ✅ Changed p-6 to include pb-20 */}
        <HomeTabNav />
        <PersonalSpace />
      </div>
    </DashboardLayout>
  );
}
