//client/
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';

export default function StudentsPage() {
  const students = [
    { name: 'John Doe', id: 'STU2025001', room: 'A-101', email: 'john@university.edu', phone: '+1 234 567 8900' },
    { name: 'Jane Smith', id: 'STU2025002', room: 'A-102', email: 'jane@university.edu', phone: '+1 234 567 8901' },
    { name: 'Mike Johnson', id: 'STU2025003', room: 'B-201', email: 'mike@university.edu', phone: '+1 234 567 8902' },
  ];

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Students</h1>
        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800">
          Add Student
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Room</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
                        <FiUser className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{student.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.room}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="flex items-center gap-1">
                        <FiMail className="text-xs" /> {student.email}
                      </p>
                      <p className="flex items-center gap-1">
                        <FiPhone className="text-xs" /> {student.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-slate-900 hover:underline text-sm font-medium">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
