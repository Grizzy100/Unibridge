// client/src/app/(dashboard)/student-dashboard/components/NotificationBell.tsx
'use client';

import { FiBell } from 'react-icons/fi';

const recent = [
  { title: 'New mail from Dean Office', time: '2h ago' },
  { title: 'Outpass approved', time: 'Yesterday' },
  { title: 'Assignment deadline today', time: 'Mon' },
];

export default function NotificationBell() {
  return (
    <div className="relative group">
      <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
        <FiBell className="text-xl" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      <div
        className="
          absolute right-0 mt-2 w-80
          opacity-0 translate-y-1 pointer-events-none
          group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
          transition
          z-50
        "
      >
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
            <button className="text-xs text-slate-500 hover:text-slate-700">View all</button>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {recent.map((n, i) => (
              <div key={i} className="px-4 py-3 hover:bg-slate-50 transition">
                <p className="text-sm text-slate-900">{n.title}</p>
                <p className="text-xs text-slate-500 mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
