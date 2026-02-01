//client/src/app/(dashboard)/student-dashboard/Schedule/page.tsx
import DashboardLayout from '../components/DashboardLayout';
import { FiClock } from 'react-icons/fi';

export default function SchedulePage() {
  const schedule = [
    { day: 'Monday', classes: [
      { time: '9:00 AM - 10:30 AM', subject: 'Mathematics', room: 'Room 101' },
      { time: '11:00 AM - 12:30 PM', subject: 'Physics', room: 'Lab 2' },
      { time: '2:00 PM - 3:30 PM', subject: 'Computer Science', room: 'Room 305' },
    ]},
    { day: 'Tuesday', classes: [
      { time: '9:00 AM - 10:30 AM', subject: 'Chemistry', room: 'Lab 1' },
      { time: '11:00 AM - 12:30 PM', subject: 'English', room: 'Room 202' },
    ]},
    { day: 'Wednesday', classes: [
      { time: '9:00 AM - 10:30 AM', subject: 'Mathematics', room: 'Room 101' },
      { time: '2:00 PM - 3:30 PM', subject: 'Physics Lab', room: 'Lab 2' },
    ]},
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Class Schedule</h1>

        <div className="space-y-6">
          {schedule.map((day, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{day.day}</h3>
              <div className="space-y-3">
                {day.classes.map((classItem, classIndex) => (
                  <div key={classIndex} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <FiClock className="text-slate-900" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{classItem.subject}</p>
                      <p className="text-sm text-gray-600">{classItem.time}</p>
                    </div>
                    <span className="text-sm text-gray-600">{classItem.room}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
