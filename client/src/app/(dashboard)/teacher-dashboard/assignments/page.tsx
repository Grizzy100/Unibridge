//client/src/app/(dashboard)/teacher-dashboard/assignments/page.tsx
'use client';
import { FiPlus, FiClock, FiCheckCircle } from 'react-icons/fi';

export default function AssignmentsPage() {
  const assignments = [
    { title: 'Calculus Problem Set 5', course: 'MATH101', dueDate: '2025-11-20', submissions: 32, total: 45, status: 'active' },
    { title: 'Physics Lab Report', course: 'PHY201', dueDate: '2025-11-18', submissions: 38, total: 38, status: 'completed' },
    { title: 'Programming Assignment 3', course: 'CS150', dueDate: '2025-11-25', submissions: 15, total: 52, status: 'active' },
  ];

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Assignments</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
          <FiPlus />
          Create Assignment
        </button>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-slate-900">{assignment.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    assignment.status === 'active' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {assignment.status === 'active' ? <FiClock className="inline mr-1 text-xs" /> : <FiCheckCircle className="inline mr-1 text-xs" />}
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Course: {assignment.course}</p>
                <p className="text-sm text-gray-600">Due Date: {assignment.dueDate}</p>
                <div className="mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span>Submissions: {assignment.submissions}/{assignment.total}</span>
                    <div className="flex-1 max-w-xs">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-slate-900 rounded-full"
                          style={{ width: `${(assignment.submissions / assignment.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 text-slate-900 border border-slate-900 rounded-lg text-sm font-medium hover:bg-slate-900 hover:text-white transition-colors">
                View Submissions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
