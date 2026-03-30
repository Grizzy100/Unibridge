//client/src/app/(dashboard)/student-dashboard/outpass/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import DashboardLayout from '../components/DashboardLayout';
import OutpassQueue from './components/OutpassQueue';
import OutpassCard from './components/OutpassCard';
import OutpassModal from './components/OutpassModal';

import { FiPlus } from 'react-icons/fi';

import { outpassAPI } from '../../../../../lib/outpass';
import { getUser, getToken } from '../../../../../lib/auth';

export default function OutpassPage() {

  const router = useRouter();

  const [outpasses, setOutpasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const user = getUser();
  const token = getToken();

  useEffect(() => {

    if (!user || !token || user.role !== "STUDENT") {
      router.replace('/login/student');
    }

  }, [user, token]);

  useEffect(() => {
    if (token) fetchOutpasses();
  }, [token]);

  const fetchOutpasses = async () => {

    try {

      const res = await outpassAPI.getMyOutpasses();
      setOutpasses(res.data || res);

    } finally {

      setLoading(false);

    }

  };

  const stats = {

    total: outpasses.length,

    approved: outpasses.filter(o => o.status === "APPROVED").length,

    pending: outpasses.filter(o =>
      ["PENDING", "PARENT_APPROVED"].includes(o.status)
    ).length,

  };

  return (
  <DashboardLayout>

    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-6 sm:py-8">

      {/* Header */}
      <div className="
        flex flex-col sm:flex-row
        sm:items-center sm:justify-between
        gap-4
        mb-6 sm:mb-8
      ">

        <div>
          <h1 className="text-[20px] sm:text-[24px] md:text-[26px] font-semibold tracking-tight text-slate-900">
            Outpass Requests
          </h1>

          <p className="text-[13px] sm:text-[14px] text-slate-600 mt-1">
            Manage your outpass applications
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="
            w-full sm:w-auto
            inline-flex items-center justify-center gap-2
            px-4 py-2.5
            rounded-xl
            text-[13px] sm:text-[14px]
            font-medium
            bg-slate-900 text-white
            hover:bg-slate-800
          "
        >
          Create Outpass
        </button>
      </div>

      {/* Stats */}
      {outpasses.length > 0 && <OutpassQueue {...stats} />}

      {/* Cards */}
      <div className="space-y-3 sm:space-y-4">
        {outpasses.map(o => (
          <OutpassCard key={o.id} outpass={o} />
        ))}
      </div>

    </div>

    {showModal && (
      <OutpassModal
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          fetchOutpasses();
        }}
      />
    )}

  </DashboardLayout>
);
}






