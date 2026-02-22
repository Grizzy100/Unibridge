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
    <div
      className="
      group
      bg-white
      rounded-2xl
      border border-gray-200/80
      hover:border-gray-300
      shadow-[0_1px_2px_rgba(0,0,0,0.04)]
      hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]
      transition-all duration-200
      px-5 py-4
      "
    >

      <div className="flex items-start justify-between gap-4">

        {/* LEFT */}
        <div className="flex-1 min-w-0">

          {/* Course + Status row */}
          <div className="flex items-center gap-2 mb-2">

            {/* Course badge (premium subtle version) */}
            <span
              className="
              px-2 py-0.5
              rounded-md
              bg-slate-900/5
              text-slate-700
              text-[11px]
              font-semibold
              tracking-wide
              "
            >
              {courseCode}
            </span>

            {/* Status */}
            <div
              className={`
              flex items-center gap-1
              px-2 py-0.5
              rounded-full
              text-[11px]
              font-medium
              border
              ${statusConfig.bgColor}
              ${statusConfig.textColor}
              ${statusConfig.borderColor}
              `}
            >
              <statusConfig.icon size={12} />
              {statusConfig.label}
            </div>

          </div>


          {/* Title */}
          <h3
            className="
            text-[15px]
            font-semibold
            text-slate-900
            mb-1
            line-clamp-1
            "
          >
            {task.title}
          </h3>


          {/* Description */}
          <p
            className="
            text-[13px]
            text-slate-500
            mb-3
            line-clamp-1
            "
          >
            {task.description || "No description provided"}
          </p>


          {/* Meta row */}
          <div className="flex items-center gap-4 text-[12px]">

            {/* Deadline */}
            <div
              className={`
              flex items-center gap-1.5
              ${isOverdue ? "text-red-600 font-medium" : "text-slate-500"}
              `}
            >
              <FiClock size={13} />
              {timeRemaining}
            </div>


            {/* Marks */}
            <div className="flex items-center gap-1.5 text-slate-500">
              <FiFileText size={13} />
              {task.maxMarks} marks
            </div>


            {/* Score */}
            {submission?.marks !== undefined &&
              submission?.marks !== null && (

                <div className="text-slate-700 font-medium">
                  {submission.marks}/{task.maxMarks}
                </div>

              )}

          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="flex flex-col items-end justify-between gap-2">

          {/* Due date */}
          <div className="text-[11px] text-slate-400 whitespace-nowrap">
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>


          {/* Submit button */}
          {canSubmit && (

            <button
              onClick={() => setIsModalOpen(true)}
              className="
              flex items-center gap-1.5
              px-3 py-1.5
              rounded-lg
              bg-slate-900
              text-white
              text-[12px]
              font-medium
              hover:bg-slate-800
              shadow-sm
              hover:shadow
              transition-all duration-200
              "
            >
              <FiUpload size={13} />
              Submit
            </button>

          )}

        </div>

      </div>

    </div>


    {/* Modal unchanged */}
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
