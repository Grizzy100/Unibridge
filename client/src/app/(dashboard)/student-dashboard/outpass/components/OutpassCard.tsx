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

    <div
      className="
      bg-white
      rounded-2xl
      border border-gray-200/80
      px-6 py-5
      shadow-[0_1px_2px_rgba(0,0,0,0.04)]
      hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]
      transition-all duration-200
      "
    >

      {/* Header */}
      <div className="flex justify-between items-start mb-4">

        <div>

          <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-slate-900 mb-2">
            {outpass.type === 'DAY_PASS' ? 'Day Outpass' : 'Leave Outpass'}
          </h3>

          <span
            className={`
            inline-flex items-center gap-1.5
            px-2.5 py-1
            rounded-full
            text-[12px]
            font-medium
            border
            ${config.className}
            `}
          >
            {config.icon}
            {config.label}
          </span>

        </div>

        {canCancel && onCancel && (

          <button
            onClick={() => onCancel(outpass.id)}
            className="
            text-red-600
            text-[13px]
            font-medium
            px-3 py-1.5
            rounded-lg
            hover:bg-red-50
            transition-all duration-200
            "
          >
            Cancel
          </button>

        )}

      </div>

      {/* Date */}
      <div className="flex gap-3 mb-3">

        <FiCalendar size={16} className="text-slate-400 mt-0.5" />

        <div>

          <p className="text-[14.5px] font-medium text-slate-900">
            {formatDate(outpass.outgoingDate)} — {formatDate(outpass.returningDate)}
          </p>

          <p className="text-[13px] text-slate-500">
            {formatTime(outpass.outgoingDate)} to {formatTime(outpass.returningDate)}
          </p>

        </div>

      </div>

      {/* Reason */}
      <div className="flex gap-3 mb-4">

        <FiFileText size={16} className="text-slate-400 mt-0.5" />

        <p className="text-[14px] text-slate-600">
          {outpass.reason}
        </p>

      </div>

      {/* Proof */}
      {outpass.proofUrl && (

        <a
          href={outpass.proofUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
          text-[13px]
          font-medium
          text-slate-900
          hover:text-slate-700
          transition
          "
        >
          View proof document →
        </a>

      )}

      {/* Approval */}
      <div className="border-t border-gray-200/70 mt-4 pt-4 grid grid-cols-2 gap-4">

        <div>

          <p className="text-[12px] text-slate-500 mb-1">
            Parent Approval
          </p>

          <p className="text-[13px] font-medium text-slate-900">
            {outpass.parentApproval}
          </p>

        </div>

        <div>

          <p className="text-[12px] text-slate-500 mb-1">
            Warden Approval
          </p>

          <p className="text-[13px] font-medium text-slate-900">
            {outpass.wardenApproval}
          </p>

        </div>

      </div>

    </div>

  );
}


// 'use client';

// import { FiClock, FiCheckCircle, FiXCircle, FiCalendar, FiFileText, FiAlertCircle } from 'react-icons/fi';
// import { OutpassRequest } from '../../../../../../lib/types/outpass.types';

// interface OutpassCardProps {
//   outpass: OutpassRequest;
//   onCancel?: (id: string) => void;
// }

// export default function OutpassCard({ outpass, onCancel }: OutpassCardProps) {
//   const canCancel = ['PENDING', 'PARENT_APPROVED'].includes(outpass.status);

//   const statusConfig = {
//     PENDING: {
//       label: 'Pending',
//       icon: <FiClock className="text-xs" />,
//       className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
//     },
//     PARENT_APPROVED: {
//       label: 'Parent Approved',
//       icon: <FiCheckCircle className="text-xs" />,
//       className: 'bg-blue-100 text-blue-700 border-blue-200',
//     },
//     APPROVED: {
//       label: 'Approved',
//       icon: <FiCheckCircle className="text-xs" />,
//       className: 'bg-green-100 text-green-700 border-green-200',
//     },
//     REJECTED: {
//       label: 'Rejected',
//       icon: <FiXCircle className="text-xs" />,
//       className: 'bg-red-100 text-red-700 border-red-200',
//     },
//     CANCELLED: {
//       label: 'Cancelled',
//       icon: <FiAlertCircle className="text-xs" />,
//       className: 'bg-gray-100 text-gray-700 border-gray-200',
//     },
//   };

//   const config = statusConfig[outpass.status];

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   const formatTime = (dateString: string) => {
//     return new Date(dateString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
//       <div className="flex items-start justify-between mb-4">
//         <div>
//           <h3 className="font-semibold text-slate-900 text-lg mb-1">
//             {outpass.type === 'DAY_PASS' ? 'Day Outpass' : 'Leave Outpass'}
//           </h3>
//           <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
//             {config.icon}
//             {config.label}
//           </span>
//         </div>

//         {canCancel && onCancel && (
//           <button
//             onClick={() => onCancel(outpass.id)}
//             className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
//           >
//             Cancel
//           </button>
//         )}
//       </div>

//       <div className="space-y-3">
//         {/* Date & Time */}
//         <div className="flex items-start gap-3 text-sm">
//           <FiCalendar className="text-gray-400 mt-0.5" />
//           <div className="flex-1">
//             <p className="text-gray-900 font-medium">
//               {formatDate(outpass.outgoingDate)} - {formatDate(outpass.returningDate)}
//             </p>
//             <p className="text-gray-500 text-xs">
//               {formatTime(outpass.outgoingDate)} to {formatTime(outpass.returningDate)}
//             </p>
//           </div>
//         </div>

//         {/* Reason */}
//         <div className="flex items-start gap-3 text-sm">
//           <FiFileText className="text-gray-400 mt-0.5" />
//           <div className="flex-1">
//             <p className="text-gray-600">{outpass.reason}</p>
//           </div>
//         </div>

//         {/* Proof Document */}
//         {outpass.proofUrl && (
//           <div className="pt-2">
//             <a
//               href={outpass.proofUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline"
//             >
//               View Proof Document →
//             </a>
//           </div>
//         )}

//         {/* Approval Status */}
//         <div className="pt-3 border-t border-gray-100">
//           <div className="grid grid-cols-2 gap-4 text-xs">
//             <div>
//               <p className="text-gray-500 mb-1">Parent Approval</p>
//               <p className={`font-medium ${
//                 outpass.parentApproval === 'APPROVED' ? 'text-green-600' :
//                 outpass.parentApproval === 'REJECTED' ? 'text-red-600' :
//                 'text-yellow-600'
//               }`}>
//                 {outpass.parentApproval}
//               </p>
//             </div>
//             <div>
//               <p className="text-gray-500 mb-1">Warden Approval</p>
//               <p className={`font-medium ${
//                 outpass.wardenApproval === 'APPROVED' ? 'text-green-600' :
//                 outpass.wardenApproval === 'REJECTED' ? 'text-red-600' :
//                 'text-yellow-600'
//               }`}>
//                 {outpass.wardenApproval}
//               </p>
//             </div>
//           </div>

//           {/* Rejection Comment */}
//           {outpass.wardenRejectionComment && (
//             <div className="mt-3 p-2 bg-red-50 border border-red-100 rounded-lg">
//               <p className="text-xs text-red-700">
//                 <span className="font-semibold">Warden Comment:</span> {outpass.wardenRejectionComment}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
