//client/src/app/(dashboard)/parent-dashboard/outpass/components/OutpassCard.tsx
'use client';

import { useState } from 'react';

export type Outpass = {
  id: string;
  studentId: string;
  reason: string;
  type: string;
  outgoingDate: string;
  returningDate: string;
  status: string;
  parentApproval: string;
};

export default function OutpassCard({
  outpass,
  onApprove,
  onReject,
}: {
  outpass: Outpass;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const statusColor =
    outpass.parentApproval === "APPROVED"
      ? "bg-green-100 text-green-700"
      : outpass.parentApproval === "REJECTED"
      ? "bg-red-100 text-red-600"
      : "bg-yellow-100 text-yellow-700";

  const statusText =
    outpass.parentApproval.charAt(0) +
    outpass.parentApproval.slice(1).toLowerCase();

  const isPending =
    outpass.parentApproval === "PENDING" && outpass.status === "PENDING";

  return (
    <div
      className="relative bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-2 transition hover:shadow-lg hover:border-slate-900"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="font-bold text-slate-900">{outpass.type.replace('_', ' ')}</div>
          <div className="text-xs text-gray-500">
            Out: {new Date(outpass.outgoingDate).toLocaleString()} • Back:{" "}
            {new Date(outpass.returningDate).toLocaleString()}
          </div>
        </div>
        <div className={`text-xs px-2 py-1 rounded-xl font-semibold ${statusColor}`}>
          {statusText}
        </div>
      </div>
      <div className="mb-2 text-gray-800">{outpass.reason}</div>
      {isPending && hovered && (
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <button
            onClick={() => onApprove && onApprove(outpass.id)}
            className="bg-green-500 hover:bg-green-700 text-white rounded-full p-2 text-lg shadow transition"
            title="Approve"
          >
            ✓
          </button>
          <button
            onClick={() => onReject && onReject(outpass.id)}
            className="bg-red-500 hover:bg-red-700 text-white rounded-full p-2 text-lg shadow transition"
            title="Reject"
          >
            ✗
          </button>
        </div>
      )}
    </div>
  );
}
