'use client';

import { useEffect, useMemo, useState } from 'react';
import TaskCard from '../../student-dashboard/task/components/TaskCard';
import TaskFilters from '../../student-dashboard/task/components/TaskFilters';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../../../../components/ui/pagination';
import { Course, Task as TaskType } from '../../../../../lib/task';
import { getToken } from '../../../../../lib/auth';
import { getParentPrimaryWard, ParentWard } from '../../../../../lib/parent';

type FilterType = 'All' | 'Completed' | 'Pending' | 'Overdue';

const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:3001';
const TASK_SERVICE_URL = process.env.NEXT_PUBLIC_TASK_SERVICE_URL || 'http://localhost:3005';
const ITEMS_PER_PAGE = 10;

export default function ParentTaskPage() {
  const [ward, setWard] = useState<ParentWard | null>(null);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const token = getToken();
      if (!token) throw new Error('Not authenticated');

      const linkedWard = await getParentPrimaryWard();
      setWard(linkedWard);

      if (!linkedWard) {
        setCourses([]);
        setTasks([]);
        return;
      }

      const coursesRes = await fetch(
        `${USER_SERVICE_URL}/api/students/${linkedWard.studentUserId}/courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!coursesRes.ok) {
        throw new Error('Failed to fetch ward courses');
      }

      const coursesJson = await coursesRes.json();
      const wardCourses: Course[] = coursesJson.data || [];
      setCourses(wardCourses);

      if (!wardCourses.length) {
        setTasks([]);
        return;
      }

      // Fetch student's tasks WITH their submissions using the new endpoint
      const tasksRes = await fetch(`${TASK_SERVICE_URL}/api/tasks/student/${linkedWard.studentUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!tasksRes.ok) {
        throw new Error('Failed to fetch ward tasks');
      }

      const tasksJson = await tasksRes.json();
      setTasks(tasksJson.data || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  const courseMap = useMemo(
    () => new Map(courses.map((c) => [c.id, c.courseCode])),
    [courses]
  );

  const now = Date.now();

  const filteredTasks = tasks.filter((task) => {
    const submission = task.submissions?.[0];
    const status = submission?.status ?? null;
    const isPastDue = now > new Date(submission?.customDueDate || task.dueDate).getTime();

    if (activeFilter === 'Completed') {
      return status === 'SUBMITTED' || status === 'GRADED' || status === 'LATE';
    }

    if (activeFilter === 'Pending') {
      if (!status) return !isPastDue;
      return status === 'PENDING' || status === 'RESUBMITTING';
    }

    if (activeFilter === 'Overdue') {
      if (!status) return isPastDue;
      return status === 'LATE' || (status === 'PENDING' && isPastDue);
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
  const paginatedTasks = sortedTasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, selectedCourseId]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-slate-900 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium animate-pulse">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-red-600 text-lg font-semibold">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 animate-fadeIn max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Task</h1>
        <p className="text-gray-500">
          {ward ? `Viewing ${ward.studentName}'s assignments (read-only)` : 'Read-only task view'}
        </p>
      </div>

      {!ward ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
          No ward is linked to this parent account yet.
        </div>
      ) : (
        <>
          <TaskFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            selectedCourseId={selectedCourseId}
            onCourseChange={setSelectedCourseId}
            courses={courses}
          />

          <div className="mt-8 space-y-4">
            {paginatedTasks.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg font-medium">No tasks found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedTasks.map((task, index) => (
                  <div key={task.id} className="animate-slideUp" style={{ animationDelay: `${index * 50}ms` }}>
                    <TaskCard
                      task={task}
                      courseCode={courseMap.get(task.courseId) || 'N/A'}
                      onSubmitClick={() => {}}
                      readOnly
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center animate-fadeIn">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-40'
                          : 'cursor-pointer hover:bg-gray-100 transition-colors'
                      }
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
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-40'
                          : 'cursor-pointer hover:bg-gray-100 transition-colors'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
