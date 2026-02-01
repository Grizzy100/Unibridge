// client/src/app/(dashboard)/student-dashboard/task/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';
import { getMyTasks, Task as TaskType, Course } from '../../../../../lib/task';
import { getStudentCoursesForTasks } from '../../../../../lib/task';
import TaskCard from './components/TaskCard';
import TaskFilters from './components/TaskFilters';
import SubmitTaskModal from './components/SubmitTaskModal';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../../../../components/ui/pagination';

type FilterType = 'All' | 'Completed' | 'Pending' | 'Overdue';

const ITEMS_PER_PAGE = 10;

export default function TaskPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError('');

      const [tasksResult, coursesData] = await Promise.all([
        getMyTasks(),
        getStudentCoursesForTasks(),
      ]);

      if (tasksResult.success) {
        setTasks(tasksResult.data);
      } else {
        setError('Failed to fetch tasks');
      }

      setCourses(coursesData);
    } catch (err: any) {
      console.error('Failed to fetch data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  }

  const courseMap = new Map(courses.map(c => [c.id, c.courseCode]));

  const filteredTasks = tasks.filter((task) => {
    const submission = task.submissions?.[0];

    if (activeFilter === 'Completed') {
      if (!submission || (submission.status !== 'SUBMITTED' && submission.status !== 'GRADED')) {
        return false;
      }
    } else if (activeFilter === 'Pending') {
      if (submission?.status !== 'PENDING') return false;
    } else if (activeFilter === 'Overdue') {
      if (submission?.status !== 'LATE') return false;
    }

    if (selectedCourseId !== 'All' && task.courseId !== selectedCourseId) {
      return false;
    }

    return true;
  });

  const sortedTasks = [...filteredTasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalPages = Math.ceil(sortedTasks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTasks = sortedTasks.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, selectedCourseId]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const handleSubmitSuccess = () => {
    setIsModalOpen(false);
    fetchData();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-slate-900 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600 font-medium animate-pulse">Loading your tasks...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-600 text-lg font-semibold">{error}</p>
            <button
              onClick={fetchData}
              className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all transform hover:scale-105 active:scale-95"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 animate-fadeIn">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
          <p className="text-gray-500">Manage and submit your assignments</p>
        </div>

        {/* Filters */}
        <TaskFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          selectedCourseId={selectedCourseId}
          onCourseChange={setSelectedCourseId}
          courses={courses}
        />

        {/* Task List */}
        <div className="mt-8 space-y-4">
          {paginatedTasks.length === 0 ? (
            <div className="text-center py-20 animate-fadeIn">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">No tasks found</p>
              <p className="text-gray-400 text-sm mt-2">
                {activeFilter !== 'All'
                  ? `No ${activeFilter.toLowerCase()} tasks at the moment`
                  : 'Your tasks will appear here once assigned'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="animate-slideUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TaskCard
                    task={task}
                    courseCode={courseMap.get(task.courseId) || 'N/A'}
                    onSubmitClick={() => handleSubmitClick(task.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center animate-fadeIn">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={`${
                      currentPage === 1 
                        ? 'pointer-events-none opacity-40' 
                        : 'cursor-pointer hover:bg-gray-100 transition-colors'
                    }`}
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;

                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer hover:bg-gray-100 transition-all"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={`${
                      currentPage === totalPages 
                        ? 'pointer-events-none opacity-40' 
                        : 'cursor-pointer hover:bg-gray-100 transition-colors'
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Submit Task Modal */}
      {isModalOpen && (
        <SubmitTaskModal
          taskId={selectedTaskId}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSubmitSuccess}
        />
      )}
    </DashboardLayout>
  );
}
