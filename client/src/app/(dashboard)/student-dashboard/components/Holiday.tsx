//client/src/app/(dashboard)/student-dashboard/components/Holiday.tsx
import { FiCalendar } from 'react-icons/fi';

export default function Holiday() {
  const holidays = [
    { name: 'Diwali Break', date: 'Nov 12-15' },
    { name: 'Winter Vacation', date: 'Dec 20 - Jan 5' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiCalendar className="text-slate-900" />
        <h3 className="font-semibold text-slate-900">Upcoming Holidays</h3>
      </div>
      <div className="space-y-3">
        {holidays.map((holiday, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-slate-900">{holiday.name}</span>
            <span className="text-xs text-gray-600">{holiday.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
