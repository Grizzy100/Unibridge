// client/src/app/(dashboard)/student-dashboard/components/TaskQueue.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getMyTasks, Task, Course } from '../../../../../lib/task';
import { getStudentCoursesForTasks } from '../../../../../lib/task';
import { FiClock } from 'react-icons/fi';

export default function TaskQueue() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPendingTasks();
  }, []);

  async function fetchPendingTasks() {
    try {
      setLoading(true);

      const [tasksResult, coursesData] = await Promise.all([
        getMyTasks(),
        getStudentCoursesForTasks(),
      ]);

      if (tasksResult?.success && Array.isArray(tasksResult.data)) {
        const now = new Date();
        
        const pendingTasks = tasksResult.data.filter((task) => {
          const submission = task.submissions?.[0];
          const status = submission?.status || 'PENDING';
          return status === 'PENDING';
        });

        const sortedTasks = pendingTasks.sort((a, b) => {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });

        setTasks(sortedTasks.slice(0, 5));
      }

      setCourses(coursesData || []);
    } catch (err: any) {
      console.error('❌ Error fetching pending tasks:', err);
      toast.error('Failed to load task queue');
    } finally {
      setLoading(false);
    }
  }

  const courseMap = new Map(courses.map((c) => [c.id, c.courseCode]));

  const formatDueTime = (dueDate: Date, status: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    
    if (status === 'LATE') return 'Late';
    if (status === 'SUBMITTED' || status === 'GRADED') return 'Submitted';
    
    if (diff < 0) {
      const hoursOverdue = Math.abs(Math.floor(diff / (1000 * 60 * 60)));
      if (hoursOverdue > 24) return `${Math.floor(hoursOverdue / 24)}d overdue`;
      return `${hoursOverdue}h overdue`;
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 1) return `${days} days`;
    if (days === 1) return '1 day';
    if (hours > 1) return `${hours} hours`;
    return 'Soon';
  };

  // ✅ IMPROVED Loading State
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Task Queue</h2>
              <p className="text-sm text-gray-500 mt-1">Pending assignments</p>
            </div>
            <FiClock className="text-gray-400" />
          </div>
        </div>
        
        {/* ✅ Better Skeleton Loader */}
        <div className="divide-y divide-gray-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 animate-pulse">
              {/* Course Badge + Time Skeleton */}
              <div className="flex items-center justify-between mb-3">
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
              
              {/* Title Skeleton */}
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              
              {/* Due Date Skeleton */}
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        
        {/* Footer Skeleton */}
        <div className="p-4 pb-6 border-t border-gray-200 text-center">
          <div className="h-5 w-32 bg-gray-200 rounded mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Empty State
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Task Queue</h2>
              <p className="text-sm text-gray-500 mt-1">Pending assignments</p>
            </div>
            <FiClock className="text-gray-400" />
          </div>
        </div>
        <div className="p-12 pb-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FiClock className="text-gray-400 text-2xl" />
          </div>
          <p className="text-sm text-gray-500">No pending tasks</p>
          <p className="text-xs text-gray-400 mt-1">All caught up! 🎉</p>
        </div>
      </div>
    );
  }

  // Success State
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Task Queue</h2>
            <p className="text-sm text-gray-500 mt-1">Pending assignments</p>
          </div>
          <FiClock className="text-gray-400" />
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto pb-4">
        <div className="divide-y divide-gray-100">
          {tasks.map((task) => {
            const courseCode = courseMap.get(task.courseId) || 'N/A';
            const submission = task.submissions?.[0];
            const dueDate = new Date(submission?.customDueDate || task.dueDate);
            const dueTime = formatDueTime(dueDate, submission?.status || 'PENDING');
            const isOverdue = new Date() > dueDate && (!submission || submission.status === 'PENDING');

            return (
              <div
                key={task.id}
                onClick={() => router.push('/student-dashboard/task')}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="inline-block px-2.5 py-1 bg-slate-900 text-white text-xs font-bold rounded uppercase">
                    {courseCode}
                  </span>
                  <span className={`text-xs flex items-center gap-1 ${
                    submission?.status === 'LATE' 
                      ? 'text-red-600 font-semibold' 
                      : isOverdue
                      ? 'text-red-600 font-semibold'
                      : 'text-gray-500'
                  }`}>
                    <FiClock className="text-xs" />
                    {dueTime}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                  {task.title}
                </h3>

                <p className="text-xs text-gray-500">
                  Due: {dueDate.toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 pb-6 border-t border-gray-200 text-center">
        <button
          onClick={() => router.push('/student-dashboard/task')}
          className="text-sm text-slate-900 hover:text-slate-700 font-medium transition-colors inline-flex items-center gap-1"
        >
          View All Tasks
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

