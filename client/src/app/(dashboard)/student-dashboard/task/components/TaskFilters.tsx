// client/src/app/(dashboard)/student-dashboard/task/components/TaskFilters.tsx
'use client';

import { Course } from '../../../../../../lib/task';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../components/ui/select";

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
    <div className="flex flex-col gap-2 sm:gap-3 md:flex-row md:items-center md:justify-between bg-white p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
      {/* Status Filters */}
      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto max-w-full md:max-w-[70%]">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`
              shrink-0 px-3 sm:px-4 py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap
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

      
      <div className="relative w-full md:w-auto md:min-w-[220px]">
        <Select value={selectedCourseId} onValueChange={onCourseChange}>
          <SelectTrigger className="w-full bg-white border-gray-300 text-gray-700 hover:border-gray-400 focus:ring-slate-900 transition-all shadow-sm rounded-md sm:rounded-lg h-9 sm:h-10 text-xs sm:text-sm font-medium pr-3">
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            <SelectItem value="All" className="text-xs sm:text-sm font-medium cursor-pointer">
              All Courses
            </SelectItem>
            {courses.map((course) => (
              <SelectItem
                key={course.id}
                value={course.id}
                className="text-xs sm:text-sm cursor-pointer"
              >
                {course.courseCode} - {course.courseName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
