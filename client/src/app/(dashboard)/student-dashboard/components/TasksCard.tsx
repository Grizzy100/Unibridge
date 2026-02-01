// client/src/app/(dashboard)/student-dashboard/components/TaskCard.tsx
'use client';

import { useState } from 'react';
import { Task } from '../../../../../lib/task';
import { FiClock, FiCheckCircle, FiAlertCircle, FiFileText, FiUpload } from 'react-icons/fi';
import SubmitTaskModal from '../task/components/SubmitTaskModal';

interface TaskCardProps {
  task: Task;
  courseCode: string;
  onRefresh?: () => void;
}

export default function TaskCard({ task, courseCode, onRefresh }: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const submission = task.submissions?.[0];
  const status = submission?.status || 'PENDING';

  const getTimeRemaining = () => {
    const dueDate = new Date(submission?.customDueDate || task.dueDate);
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();

    if (diff < 0) return 'Overdue';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    return 'Due soon';
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'GRADED':
        return {
          icon: FiCheckCircle,
          label: 'Graded',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
        };
      case 'SUBMITTED':
        return {
          icon: FiCheckCircle,
          label: 'Submitted',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
        };
      case 'LATE':
        return {
          icon: FiAlertCircle,
          label: 'Late',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
        };
      default:
        return {
          icon: FiAlertCircle,
          label: 'Pending',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200',
        };
    }
  };

  const statusConfig = getStatusConfig();
  const canSubmit = !submission || submission.status === 'PENDING' || submission.status === 'RESUBMITTING';
  const timeRemaining = getTimeRemaining();
  const isOverdue = timeRemaining === 'Overdue';

  const handleSubmitSuccess = () => {
    setIsModalOpen(false);
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Course Badge */}
            <span className="inline-block px-2 py-0.5 bg-slate-900 text-white text-xs font-bold rounded uppercase mb-2">
              {courseCode}
            </span>

            {/* Task Title */}
            <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
              {task.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-gray-600 mb-2 line-clamp-1">
              {task.description || 'No description provided'}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-3 text-xs">
              {/* Deadline */}
              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                <FiClock className="text-xs" />
                <span>{timeRemaining}</span>
              </div>

              {/* Marks */}
              <div className="flex items-center gap-1 text-gray-600">
                <FiFileText className="text-xs" />
                <span>{task.maxMarks} marks</span>
              </div>

              {/* Score (if graded) */}
              {submission?.marks !== undefined && submission?.marks !== null && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">Score:</span>
                  <span className="font-bold text-gray-900">
                    {submission.marks}/{task.maxMarks}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col items-end gap-2">
            {/* Status Badge */}
            <div className={`flex items-center gap-1 px-2 py-0.5 ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} rounded-full text-xs font-medium`}>
              <statusConfig.icon className="text-xs" />
              <span>{statusConfig.label}</span>
            </div>

            {/* Submit Button */}
            {canSubmit && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <FiUpload className="text-xs" />
                Submit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      {isModalOpen && (
        <SubmitTaskModal
          taskId={task.id}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSubmitSuccess}
        />
      )}
    </>
  );
}
