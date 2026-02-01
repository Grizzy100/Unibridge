//client/src/app/(dashboard)/teacher-dashboard/courses/page.tsx
'use client';
import CourseCard from '../components/CourseCard';

export default function CoursesPage() {
  const courses = [
    { courseName: 'Mathematics 101', courseCode: 'MATH101', students: 45, progress: 65 },
    { courseName: 'Advanced Physics', courseCode: 'PHY201', students: 38, progress: 80 },
    { courseName: 'Computer Science Fundamentals', courseCode: 'CS150', students: 52, progress: 50 },
    { courseName: 'Chemistry Basics', courseCode: 'CHEM101', students: 40, progress: 70 },
  ];

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Courses</h1>
        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
          Add New Course
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {courses.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
      </div>
    </div>
  );
}
