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

  const isHosteller = outpass.student?.hostelAssigned === true;
  const isExplicitDayScholar = outpass.student?.hostelAssigned === false;
  const showActions = isPendingParent && isHosteller;
  const showDayScholarWarning = isPendingParent && isExplicitDayScholar;

  const statusConfig = (() => {
    if (outpass.parentApproval === 'APPROVED')
      return { label: 'Approved', style: 'text-slate-700 bg-slate-100 border-slate-200' };
    if (outpass.parentApproval === 'REJECTED')
      return { label: 'Rejected', style: 'text-slate-700 bg-slate-100 border-slate-200' };
    return { label: 'Pending ', style: 'text-slate-700 bg-slate-100 border-slate-200' };
  })();

  return (
    <div className="
      bg-white rounded-2xl border border-slate-200
      hover:border-slate-300 hover:shadow-md
      transition-all duration-200
      p-4 sm:p-5
    ">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">

        <div className="flex-1 min-w-0">

          {/* Type + Hostel */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">

            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
              {TYPE_LABELS[outpass.type] ?? outpass.type.replace('_', ' ')}
            </span>

          </div>

          {/* Student */}
          {outpass.student && (
            <div className="flex items-center gap-1.5 text-[13px] text-slate-700 font-medium">
              <FiUser size={12} className="text-slate-400" />
              {outpass.student.name}
              {outpass.student.enrollmentNumber && (
                <span className="text-slate-400 font-normal">
                  · {outpass.student.enrollmentNumber}
                </span>
              )}
            </div>
          )}

        </div>

        {/* Status */}
        <div className={`px-2.5 py-1 rounded-full text-[11px] border ${statusConfig.style}`}>
          {statusConfig.label}
        </div>

      </div>

      {/* Reason */}
      <p className="text-[13px] text-slate-600 mb-3 line-clamp-2">
        {outpass.reason}
      </p>

      {/* Dates */}
      <div className="text-[12px] text-slate-500 mb-4 space-y-1">

        <div>
          <span className="text-slate-400">Out:</span>{' '}
          <span className="font-medium text-slate-700">
            {formatDate(outpass.outgoingDate)}
          </span>
        </div>

        <div>
          <span className="text-slate-400">Return:</span>{' '}
          <span className="font-medium text-slate-700">
            {formatDate(outpass.returningDate)}
          </span>
        </div>

      </div>

      {/* Warning */}
      {showDayScholarWarning && (
        <div className="text-[12px] text-slate-600 border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 mb-3">
          This student is a <strong>Day Scholar</strong>. Contact admin.
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2">

          <button
            onClick={() => onApprove?.(outpass.id)}
            className="
              flex-1 py-2 rounded-lg
              bg-slate-900 text-white
              text-[13px] font-medium
              hover:bg-slate-800 transition
            "
          >
            Approve
          </button>

          <button
            onClick={() => onReject?.(outpass.id)}
            className="
              flex-1 py-2 rounded-lg
              border border-slate-200
              text-slate-700 text-[13px]
              hover:bg-slate-100 transition
            "
          >
            Reject
          </button>

        </div>
      )}

    </div>
  );
}