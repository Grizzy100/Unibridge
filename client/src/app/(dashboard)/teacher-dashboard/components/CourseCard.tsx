import React from 'react';

interface CourseCardProps {
  courseName: string;
  courseCode: string;
  students: number;
  progress: number;
}

export default function CourseCard({ courseName, courseCode, students, progress }: CourseCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{courseName}</h3>
          <p className="text-sm text-slate-500">{courseCode}</p>
        </div>
        <div className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">
          Active
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Students Enrolled</span>
          <span className="font-semibold text-slate-900">{students}</span>
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-medium text-slate-700">Course Progress</span>
            <span className="text-slate-600">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-slate-900 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}