// client/src/app/(dashboard)/student-dashboard/outpass/components/OutpassCard.tsx
'use client';

import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiFileText,
  FiAlertCircle
} from 'react-icons/fi';

import { OutpassRequest } from '../../../../../../lib/types/outpass.types';

interface OutpassCardProps {
  outpass: OutpassRequest;
  onCancel?: (id: string) => void;
}

export default function OutpassCard({ outpass, onCancel }: OutpassCardProps) {

  const canCancel = ['PENDING', 'PARENT_APPROVED'].includes(outpass.status);

  const statusConfig = {
    PENDING: {
      label: 'Pending',
      icon: <FiClock size={14} />,
      className: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    PARENT_APPROVED: {
      label: 'Parent Approved',
      icon: <FiCheckCircle size={14} />,
      className: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    APPROVED: {
      label: 'Approved',
      icon: <FiCheckCircle size={14} />,
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    REJECTED: {
      label: 'Rejected',
      icon: <FiXCircle size={14} />,
      className: 'bg-red-50 text-red-700 border-red-200',
    },
    CANCELLED: {
      label: 'Cancelled',
      icon: <FiAlertCircle size={14} />,
      className: 'bg-slate-100 text-slate-600 border-slate-200',
    },
  };

  const config = statusConfig[outpass.status];

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (

    <div className="
  bg-white rounded-2xl border border-gray-200/80
  px-4 sm:px-6 py-3 sm:py-5
  shadow-[0_1px_2px_rgba(0,0,0,0.04)]
  transition-all duration-200
">

  {/* Header */}
  <div className="flex justify-between items-start mb-3">

    <div>
      <h3 className="text-[15px] sm:text-[17px] font-semibold text-slate-900 mb-2">
        {outpass.type === 'DAY_PASS' ? 'Day Outpass' : 'Leave Outpass'}
      </h3>

      <span className={`
        inline-flex items-center gap-1.5
        px-2 py-0.5 sm:px-2.5 sm:py-1
        rounded-full text-[11px] sm:text-[12px]
        font-medium border
        ${config.className}
      `}>
        {config.icon}
        {config.label}
      </span>
    </div>

    {canCancel && onCancel && (
      <button
        onClick={() => onCancel(outpass.id)}
        className="text-red-600 text-[12px] font-medium px-2 py-1 rounded-lg hover:bg-red-50"
      >
        Cancel
      </button>
    )}
  </div>

  {/* Date */}
  <div className="flex gap-2.5 items-start mb-2.5">
    <FiCalendar size={15} className="text-slate-400 mt-0.5" />

    <div>
      <p className="text-[13px] sm:text-[14px] font-medium text-slate-900">
        {formatDate(outpass.outgoingDate)} - {formatDate(outpass.returningDate)}
      </p>

      <p className="text-[11px] sm:text-[13px] text-slate-500">
        {formatTime(outpass.outgoingDate)} - {formatTime(outpass.returningDate)}
      </p>
    </div>
  </div>

  {/* Reason */}
  <div className="flex gap-2.5 mb-3">
    <FiFileText size={15} className="text-slate-400 mt-0.5" />
    <p className="text-[12px] sm:text-[14px] text-slate-600">
      {outpass.reason}
    </p>
  </div>

  {/* Proof */}
  {outpass.proofUrl && (
    <a
      href={outpass.proofUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[12px] sm:text-[13px] font-medium text-slate-900"
    >
      View proof document →
    </a>
  )}

  {/* Approval */}
  <div className="border-t border-gray-200/70 mt-3 pt-3 grid grid-cols-2 gap-3">

    <div>
      <p className="text-[11px] text-slate-500 mb-1">
        Parent Approval
      </p>
      <p className="text-[12px] sm:text-[13px] font-medium text-slate-900">
        {outpass.parentApproval}
      </p>
    </div>

    <div>
      <p className="text-[11px] text-slate-500 mb-1">
        Warden Approval
      </p>
      <p className="text-[12px] sm:text-[13px] font-medium text-slate-900">
        {outpass.wardenApproval}
      </p>
    </div>

  </div>
</div>

  );
}


