// client/src/app/(dashboard)/parent-dashboard/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiUser } from 'react-icons/fi';
import { getParentPrimaryWard, ParentWard } from '../../../../lib/parent';
import WardAttendanceChart from './components/WardAttendanceChart';

export default function ParentDashboardHome() {
  const [ward, setWard] = useState<ParentWard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const currentWard = await getParentPrimaryWard();
        if (active) setWard(currentWard);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto font-sans antialiased">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Parent Dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Track your ward's attendance, tasks, and outpass activity.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-8">
        {/* Main Content Area - Chart (Center focus) */}
        <div className="xl:col-span-2 space-y-6">
          <WardAttendanceChart wardUserId={ward?.studentUserId} />
        </div>

        {/* Right Sidebar - Ward Info and Contact Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm">
                <FiUser className="text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 leading-tight">Ward Overview</h2>
                <p className="text-xs text-slate-500">Primary linked student</p>
              </div>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
            ) : ward ? (
              <div className="space-y-4">
                <div className="flex flex-col border-b border-gray-100 pb-3">
                  <span className="text-xs text-slate-500 mb-0.5">Name</span>
                  <span className="text-slate-900 font-medium text-sm">{ward.studentName}</span>
                </div>
                <div className="flex flex-col border-b border-gray-100 pb-3">
                  <span className="text-xs text-slate-500 mb-0.5">Enrollment</span>
                  <span className="text-slate-900 font-medium text-sm">{ward.enrollmentNumber || 'N/A'}</span>
                </div>
                <div className="flex flex-col border-b border-gray-100 pb-3">
                  <span className="text-xs text-slate-500 mb-0.5">Relationship</span>
                  <span className="text-slate-900 font-medium text-sm">{ward.relationship || 'Parent'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 mb-0.5">Email</span>
                  <span className="text-slate-900 font-medium text-sm truncate" title={ward.email}>{ward.email || 'N/A'}</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-lg border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
                <FiUser className="text-3xl text-slate-400 mb-3" />
                <h3 className="text-[15px] font-semibold text-slate-800 mb-1">Awaiting Linkage</h3>
                <p className="text-slate-500 text-xs mb-4">
                  Admin approval required to link ward.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
