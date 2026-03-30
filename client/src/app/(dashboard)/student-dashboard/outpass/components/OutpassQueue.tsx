'use client';

import { FiClock, FiCheckCircle, FiFileText } from 'react-icons/fi';

interface OutpassQueueProps {
  total: number;
  approved: number;
  pending: number;
}

export default function OutpassQueue({ total, approved, pending }: OutpassQueueProps) {
  return (
    <div className="
      flex gap-3 sm:gap-4
      overflow-x-auto
      pb-2
      -mx-4 px-4 sm:mx-0 sm:px-0
      [&::-webkit-scrollbar]:hidden
      mb-5 sm:mb-6
    ">

      <div className="shrink-0 w-[160px] sm:w-[200px] md:flex-1">
        <StatCard icon={<FiFileText size={16} />} label="Total Requests" value={total} color="slate" />
      </div>

      <div className="shrink-0 w-[160px] sm:w-[200px] md:flex-1">
        <StatCard icon={<FiCheckCircle size={16} />} label="Approved" value={approved} color="green" />
      </div>

      <div className="shrink-0 w-[160px] sm:w-[200px] md:flex-1">
        <StatCard icon={<FiClock size={16} />} label="Pending" value={pending} color="amber" />
      </div>

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
  color: 'slate' | 'green' | 'amber';
}) {
  const colorClasses = {
    slate: 'text-slate-900',
    green: 'text-emerald-600',
    amber: 'text-amber-600',
  };

  return (
    <div className="
      bg-white rounded-2xl border border-gray-200/80
      px-4 sm:px-5 py-3 sm:py-4
      shadow-[0_1px_2px_rgba(0,0,0,0.04)]
      h-full
    ">
      <div className="flex items-center gap-2.5 mb-2">

        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
          {icon}
        </div>

        <p className="text-[11px] sm:text-[12px] font-medium text-slate-500">
          {label}
        </p>

      </div>

      <p className={`text-[20px] sm:text-[26px] font-semibold tracking-tight ${colorClasses[color]}`}>
        {value}
      </p>
    </div>
  );
}