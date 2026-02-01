// client/src/app/(dashboard)/student-dashboard/outpass/components/OutpassCard.tsx
'use client';

import { FiClock, FiCheckCircle, FiXCircle, FiCalendar, FiFileText, FiAlertCircle } from 'react-icons/fi';
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
      icon: <FiClock className="text-xs" />,
      className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    },
    PARENT_APPROVED: {
      label: 'Parent Approved',
      icon: <FiCheckCircle className="text-xs" />,
      className: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    APPROVED: {
      label: 'Approved',
      icon: <FiCheckCircle className="text-xs" />,
      className: 'bg-green-100 text-green-700 border-green-200',
    },
    REJECTED: {
      label: 'Rejected',
      icon: <FiXCircle className="text-xs" />,
      className: 'bg-red-100 text-red-700 border-red-200',
    },
    CANCELLED: {
      label: 'Cancelled',
      icon: <FiAlertCircle className="text-xs" />,
      className: 'bg-gray-100 text-gray-700 border-gray-200',
    },
  };

  const config = statusConfig[outpass.status];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900 text-lg mb-1">
            {outpass.type === 'DAY_PASS' ? 'Day Outpass' : 'Leave Outpass'}
          </h3>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
            {config.icon}
            {config.label}
          </span>
        </div>

        {canCancel && onCancel && (
          <button
            onClick={() => onCancel(outpass.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Date & Time */}
        <div className="flex items-start gap-3 text-sm">
          <FiCalendar className="text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-gray-900 font-medium">
              {formatDate(outpass.outgoingDate)} - {formatDate(outpass.returningDate)}
            </p>
            <p className="text-gray-500 text-xs">
              {formatTime(outpass.outgoingDate)} to {formatTime(outpass.returningDate)}
            </p>
          </div>
        </div>

        {/* Reason */}
        <div className="flex items-start gap-3 text-sm">
          <FiFileText className="text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-gray-600">{outpass.reason}</p>
          </div>
        </div>

        {/* Proof Document */}
        {outpass.proofUrl && (
          <div className="pt-2">
            <a
              href={outpass.proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline"
            >
              View Proof Document →
            </a>
          </div>
        )}

        {/* Approval Status */}
        <div className="pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-500 mb-1">Parent Approval</p>
              <p className={`font-medium ${
                outpass.parentApproval === 'APPROVED' ? 'text-green-600' :
                outpass.parentApproval === 'REJECTED' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {outpass.parentApproval}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Warden Approval</p>
              <p className={`font-medium ${
                outpass.wardenApproval === 'APPROVED' ? 'text-green-600' :
                outpass.wardenApproval === 'REJECTED' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {outpass.wardenApproval}
              </p>
            </div>
          </div>

          {/* Rejection Comment */}
          {outpass.wardenRejectionComment && (
            <div className="mt-3 p-2 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-xs text-red-700">
                <span className="font-semibold">Warden Comment:</span> {outpass.wardenRejectionComment}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
