// client/src/app/(dashboard)/student-dashboard/outpass/components/OutpassQueue.tsx
'use client';

import { FiClock, FiCheckCircle, FiFileText } from 'react-icons/fi';

interface OutpassQueueProps {
  total: number;
  approved: number;
  pending: number;
}

export default function OutpassQueue({ total, approved, pending }: OutpassQueueProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <StatCard
        icon={<FiFileText className="text-xl" />}
        label="Total Requests"
        value={total}
        color="slate"
      />
      <StatCard
        icon={<FiCheckCircle className="text-xl" />}
        label="Approved"
        value={approved}
        color="green"
      />
      <StatCard
        icon={<FiClock className="text-xl" />}
        label="Pending"
        value={pending}
        color="yellow"
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'slate' | 'green' | 'yellow';
}) {
  const colorClasses = {
    slate: 'text-slate-900',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-gray-400">{icon}</div>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
      <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
    </div>
  );
}
