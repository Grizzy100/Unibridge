// client/src/app/(dashboard)/student-dashboard/components/Tasks.tsx
'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getMyTasks, Task as TaskType, Course } from '../../../../../lib/task';
import { getStudentCoursesForTasks } from '../../../../../lib/task';
import TaskCard from './TasksCard';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

export default function Tasks() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchTasks();
  }, [retryCount]);

  async function fetchTasks() {
    try {
      setLoading(true);
      setError(null);

      // Fetch tasks and courses in parallel
      const [tasksResult, coursesData] = await Promise.all([
        getMyTasks().catch(err => {
          console.error('Failed to fetch tasks:', err);
          throw new Error('Could not load tasks');
        }),
        getStudentCoursesForTasks().catch(err => {
          console.error('Failed to fetch courses:', err);
          return []; // Return empty array if courses fail
        }),
      ]);

      if (tasksResult?.success && Array.isArray(tasksResult.data)) {
        // Sort by due date (closest first)
        const sortedTasks = tasksResult.data.sort((a, b) => {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });

        // Take only first 5 tasks for home page
        setTasks(sortedTasks.slice(0, 5));
      } else {
        throw new Error('Invalid tasks data received');
      }

      setCourses(coursesData || []);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load tasks';
      console.error('Error fetching tasks:', err);
      setError(errorMessage);
      
      // Show error toast
      toast.error(errorMessage, {
        duration: 4000,
        icon: '⚠️',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleRefresh = () => {
    setRetryCount(prev => prev + 1);
    toast.loading('Refreshing tasks...', { duration: 1000 });
  };

  // Create course map for quick lookup
  const courseMap = new Map(courses.map(c => [c.id, c.courseCode]));

  // Loading State
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="flex gap-3">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error && tasks.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
          <FiAlertCircle className="text-2xl text-red-600" />
        </div>
        <h3 className="text-sm font-semibold text-red-900 mb-1">Failed to Load Tasks</h3>
        <p className="text-xs text-red-700 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          <FiRefreshCw className="text-sm" />
          Retry
        </button>
      </div>
    );
  }

  // Empty State
  if (tasks.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">No Tasks Yet</h3>
        <p className="text-xs text-gray-600">Your assigned tasks will appear here</p>
      </div>
    );
  }

  // Success State - Show Tasks
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          courseCode={courseMap.get(task.courseId) || 'N/A'}
          onRefresh={fetchTasks}
        />
      ))}

      {/* View All Link */}
      {tasks.length > 0 && (
        <div className="pt-2 text-center">
          <a
            href="/student-dashboard/task"
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-900 hover:text-slate-700 transition-colors"
          >
            View All Tasks
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
