//client/src/app/(dashboard)/parent-dashboard/outpass/components/OutpassCard.tsx
'use client';

import { FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiUser, FiHome } from 'react-icons/fi';

export type OutpassStudent = {
  name: string;
  firstName: string;
  lastName: string;
  enrollmentNumber: string | null;
  hostelAssigned: boolean;
  hostelName: string | null;
  email: string;
};

export type Outpass = {
  id: string;
  studentId: string;
  reason: string;
  type: string;
  outgoingDate: string;
  returningDate: string;
  status: string;
  parentApproval: string;
  proofUrl?: string | null;
  student?: OutpassStudent | null;
};

interface OutpassCardProps {
  outpass: Outpass;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

function formatDate(d: string) {
  return new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const TYPE_LABELS: Record<string, string> = {
  HOME_PASS: 'Home Pass',
  DAY_PASS: 'Day Pass',
  EMERGENCY: 'Emergency',
  MEDICAL: 'Medical',
};

export default function OutpassCard({ outpass, onApprove, onReject }: OutpassCardProps) {
  const isPendingParent =
    outpass.parentApproval === 'PENDING' && outpass.status === 'PENDING';

  // ── Hosteller guard ────────────────────────────────────────────
  // Only show action buttons when the ward is a confirmed hosteller.
  // Day scholars should not have outpasses — show a warning instead.
  const isHosteller = outpass.student?.hostelAssigned === true;
  const showActions = isPendingParent && isHosteller;
  const showDayScholarWarning = isPendingParent && !isHosteller;
  // ──────────────────────────────────────────────────────────────

  const statusConfig = (() => {
    if (outpass.parentApproval === 'APPROVED')
      return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: FiCheckCircle, label: 'Approved' };
    if (outpass.parentApproval === 'REJECTED')
      return { color: 'bg-red-50 text-red-700 border-red-200', icon: FiXCircle, label: 'Rejected' };
    return { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: FiClock, label: 'Pending your action' };
  })();

  const StatusIcon = statusConfig.icon;

  return (
    <div className="
      bg-white rounded-2xl border border-gray-200/80
      hover:border-gray-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]
      shadow-[0_1px_2px_rgba(0,0,0,0.04)]
      transition-all duration-200 p-5
    ">

      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">

          {/* Student name + type badge */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-slate-900/5 text-slate-700 text-[11px] font-semibold tracking-wide">
              {TYPE_LABELS[outpass.type] ?? outpass.type.replace('_', ' ')}
            </span>

            {/* Hosteller badge */}
            {outpass.student && (
              <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                isHosteller
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-orange-50 text-orange-700 border-orange-200'
              }`}>
                <FiHome size={10} />
                {isHosteller ? `Hosteller · ${outpass.student.hostelName ?? 'Hostel'}` : 'Day Scholar'}
              </span>
            )}
          </div>

          {/* Student name */}
          {outpass.student && (
            <div className="flex items-center gap-1.5 text-[13px] text-slate-700 font-medium">
              <FiUser size={12} className="text-slate-400" />
              {outpass.student.name}
              {outpass.student.enrollmentNumber && (
                <span className="text-slate-400 font-normal">· {outpass.student.enrollmentNumber}</span>
              )}
            </div>
          )}

        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${statusConfig.color}`}>
          <StatusIcon size={12} />
          {statusConfig.label}
        </div>
      </div>

      {/* Reason */}
      <p className="text-[13px] text-slate-600 mb-3 line-clamp-2">{outpass.reason}</p>

      {/* Dates */}
      <div className="flex items-center gap-4 text-[12px] text-slate-500 mb-4">
        <div className="flex items-center gap-1">
          <FiClock size={12} />
          Out: <span className="font-medium text-slate-700 ml-1">{formatDate(outpass.outgoingDate)}</span>
        </div>
        <div className="flex items-center gap-1">
          Return: <span className="font-medium text-slate-700 ml-1">{formatDate(outpass.returningDate)}</span>
        </div>
      </div>

      {/* Day Scholar Warning */}
      {showDayScholarWarning && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-50 border border-orange-200 text-[12px] text-orange-700 mb-3">
          <FiAlertCircle size={14} />
          This student is registered as a <strong>Day Scholar</strong> — outpass requests cannot be approved. Contact the admin.
        </div>
      )}

      {/* Action buttons — only for hostellers with pending approval */}
      {showActions && (
        <div className="flex gap-2">
          <button
            onClick={() => onApprove?.(outpass.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-medium transition-colors"
          >
            <FiCheckCircle size={14} />
            Approve
          </button>
          <button
            onClick={() => onReject?.(outpass.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[13px] font-medium transition-colors"
          >
            <FiXCircle size={14} />
            Reject
          </button>
        </div>
      )}

    </div>
  );
}
