import { FiMessageSquare, FiClock } from 'react-icons/fi';

export default function ComplaintsPage() {
  const complaints = [
    { student: 'John Doe', issue: 'Room AC not working', date: '2025-11-14', status: 'pending' },
    { student: 'Jane Smith', issue: 'Water supply issue', date: '2025-11-13', status: 'resolved' },
  ];

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Complaints</h1>

      <div className="space-y-4">
        {complaints.map((complaint, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiMessageSquare className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">{complaint.issue}</h3>
                  <p className="text-sm text-gray-600 mb-2">Reported by: {complaint.student}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <FiClock /> {complaint.date}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                complaint.status === 'pending' 
                  ? 'bg-yellow-100 text-yellow-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {complaint.status}
              </span>
            </div>
            {complaint.status === 'pending' && (
              <button className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
                Mark as Resolved
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
