// client/src/app/(dashboard)/student-dashboard/task/components/TaskFilters.tsx
'use client';

import { Course } from '../../../../../../lib/task';
import { FiChevronDown } from 'react-icons/fi';

interface TaskFiltersProps {
  activeFilter: 'All' | 'Completed' | 'Pending' | 'Overdue';
  onFilterChange: (filter: 'All' | 'Completed' | 'Pending' | 'Overdue') => void;
  selectedCourseId: string;
  onCourseChange: (courseId: string) => void;
  courses: Course[];
}

export default function TaskFilters({
  activeFilter,
  onFilterChange,
  selectedCourseId,
  onCourseChange,
  courses,
}: TaskFiltersProps) {
  const filters: Array<'All' | 'Completed' | 'Pending' | 'Overdue'> = [
    'All',
    'Completed',
    'Pending',
    'Overdue',
  ];

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      {/* Status Filters */}
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`
              px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
              ${
                activeFilter === filter
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            {filter}
          </button>
        ))}
      </div>

      
      <div className="relative">
        <select
          value={selectedCourseId}
          onChange={(e) => onCourseChange(e.target.value)}
          className="
            appearance-none px-5 py-2.5 pr-12 rounded-lg border border-gray-300 
            text-sm font-medium text-gray-700 bg-white 
            hover:border-gray-400 hover:shadow-sm
            focus:outline-none focus:border-gray-400

            transition-all duration-200 cursor-pointer
          "
        >
          <option value="All">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.courseCode} - {course.courseName}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors" />
      </div>
    </div>
  );
}
