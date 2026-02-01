// client/src/app/(dashboard)/student-dashboard/components/Outpass.tsx
import { FiClock } from 'react-icons/fi';

const outpassQueue = [
  { reason: 'Library visit', time: '10:30 AM', status: 'Pending' },
  { reason: 'Medical', time: '11:10 AM', status: 'Approved' },
  { reason: 'Hostel office', time: '1:00 PM', status: 'Pending' },
  { reason: 'Bank', time: '2:30 PM', status: 'Rejected' }, // > 3 triggers scroll
];

export default function Outpass() {
  const isScrollable = outpassQueue.length > 3;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">Outpass Queue</h3>
          <p className="text-xs text-slate-500 mt-0.5">Recent requests</p>
        </div>
        <FiClock className="text-gray-400" />
      </div>

      {outpassQueue.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p className="text-sm">No active outpass</p>
        </div>
      ) : (
        <div
          className={`space-y-3 pr-1 ${isScrollable ? 'max-h-[240px] overflow-y-auto' : ''}`}
        >
          {outpassQueue.map((op, idx) => (
            <div
              key={idx}
              className="h-16 rounded-xl border border-gray-200 bg-gray-50 px-4 flex items-center justify-between hover:bg-gray-100 transition"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{op.reason}</p>
                <p className="text-xs text-slate-500">{op.time}</p>
              </div>
              <span className="text-xs font-semibold text-slate-700">{op.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
