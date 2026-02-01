// // client/src/app/(dashboard)/student-dashboard/task/components/TaskCard.tsx
// 'use client';

// import { Task } from '../../../../../../lib/task';
// import { FiClock, FiCheckCircle, FiAlertCircle, FiFileText } from 'react-icons/fi';
// import { useEffect, useState } from 'react';

// interface TaskCardProps {
//   task: Task;
//   courseCode: string;
//   onSubmitClick: () => void;
// }

// export default function TaskCard({ task, courseCode, onSubmitClick }: TaskCardProps) {
//   const submission = task.submissions?.[0];
//   const status = submission?.status || 'PENDING';
//   const [timeRemaining, setTimeRemaining] = useState('');
//   const [isUrgent, setIsUrgent] = useState(false);

//   useEffect(() => {
//     const updateTimer = () => {
//       const dueDate = new Date(submission?.customDueDate || task.dueDate);
//       const now = new Date();
//       const diff = dueDate.getTime() - now.getTime();

//       if (diff < 0) {
//         setTimeRemaining('Overdue');
//         setIsUrgent(true);
//         return;
//       }

//       const hours = Math.floor(diff / (1000 * 60 * 60));
//       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

//       if (hours < 1) {
//         setIsUrgent(true);
//         if (minutes <= 5) {
//           setTimeRemaining(`${minutes} min left`);
//         } else if (minutes <= 30) {
//           setTimeRemaining(`${minutes} min left`);
//         } else {
//           setTimeRemaining(`${minutes} min left`);
//         }
//       } else if (hours < 2) {
//         setIsUrgent(true);
//         setTimeRemaining(`${hours}h ${minutes}m left`);
//       } else if (hours < 6) {
//         setIsUrgent(true);
//         setTimeRemaining(`${hours} hours left`);
//       } else if (hours < 12) {
//         setTimeRemaining(`${hours} hours left`);
//         setIsUrgent(false);
//       } else {
//         const days = Math.floor(hours / 24);
//         setIsUrgent(false);
//         if (days > 0) {
//           setTimeRemaining(`${days} day${days > 1 ? 's' : ''} left`);
//         } else {
//           setTimeRemaining(`${hours} hours left`);
//         }
//       }
//     };

//     updateTimer();
//     const interval = setInterval(updateTimer, 60000);
//     return () => clearInterval(interval);
//   }, [task.dueDate, submission?.customDueDate]);

//   const getStatusConfig = () => {
//     switch (status) {
//       case 'GRADED':
//         return {
//           icon: FiCheckCircle,
//           label: 'Graded',
//           bgColor: 'bg-green-50',
//           textColor: 'text-green-700',
//           borderColor: 'border-green-200',
//         };
//       case 'SUBMITTED':
//         return {
//           icon: FiCheckCircle,
//           label: 'Submitted',
//           bgColor: 'bg-blue-50',
//           textColor: 'text-blue-700',
//           borderColor: 'border-blue-200',
//         };
//       case 'LATE':
//         return {
//           icon: FiAlertCircle,
//           label: 'Late',
//           bgColor: 'bg-red-50',
//           textColor: 'text-red-700',
//           borderColor: 'border-red-200',
//         };
//       case 'RESUBMITTING':
//         return {
//           icon: FiAlertCircle,
//           label: 'Resubmit',
//           bgColor: 'bg-yellow-50',
//           textColor: 'text-yellow-700',
//           borderColor: 'border-yellow-200',
//         };
//       default:
//         return null;
//     }
//   };

//   const statusConfig = getStatusConfig();
//   const canSubmit = !submission || submission.status === 'PENDING' || submission.status === 'RESUBMITTING';

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 p-6">
//       <div className="flex items-start justify-between gap-4">
//         <div className="flex-1 min-w-0">
//           {/* Course Badge */}
//           <div className="inline-flex items-center gap-2 mb-3">
//             <span className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-full uppercase tracking-wide">
//               {courseCode}
//             </span>
//             {isUrgent && status === 'PENDING' && (
//               <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
//                 <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
//                 Urgent
//               </span>
//             )}
//           </div>

//           {/* Task Title */}
//           <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
//             {task.title}
//           </h3>

//           {/* Description */}
//           <p className="text-sm text-gray-600 mb-4 line-clamp-2">
//             {task.description || 'No description provided'}
//           </p>

//           {/* Meta Info */}
//           <div className="flex flex-wrap items-center gap-4 text-sm">
//             {/* Deadline Timer */}
//             <div className={`flex items-center gap-2 ${isUrgent ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
//               <FiClock />
//               <span>{timeRemaining}</span>
//             </div>

//             {/* Max Marks */}
//             <div className="flex items-center gap-2 text-gray-600">
//               <FiFileText />
//               <span>{task.maxMarks} marks</span>
//             </div>

//             {/* Marks (if graded) */}
//             {submission?.marks !== undefined && submission?.marks !== null && (
//               <div className="flex items-center gap-2">
//                 <span className="text-gray-600">Score:</span>
//                 <span className="font-bold text-gray-900">
//                   {submission.marks}/{task.maxMarks}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Side Actions */}
//         <div className="flex flex-col items-end gap-3">
//           {/* Status Badge */}
//           {statusConfig && (
//             <div className={`flex items-center gap-2 px-3 py-1.5 ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} rounded-full text-sm font-medium`}>
//               <statusConfig.icon className="text-base" />
//               <span>{statusConfig.label}</span>
//             </div>
//           )}

//           {/* Submit Button */}
//           {canSubmit && (
//             <button
//               onClick={onSubmitClick}
//               className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors duration-200"
//             >
//               Add Submission
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




// client/src/app/(dashboard)/student-dashboard/task/components/TaskCard.tsx
'use client';

import { Task } from '../../../../../../lib/task';
import { FiClock, FiCheckCircle, FiAlertCircle, FiFileText } from 'react-icons/fi';
import { useEffect, useState } from 'react';

interface TaskCardProps {
  task: Task;
  courseCode: string;
  onSubmitClick: () => void;
}

export default function TaskCard({ task, courseCode, onSubmitClick }: TaskCardProps) {
  const submission = task.submissions?.[0];
  const status = submission?.status || 'PENDING';
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const dueDate = new Date(submission?.customDueDate || task.dueDate);
      const now = new Date();
      const diff = dueDate.getTime() - now.getTime();

      // ✅ FIXED: Only show "Overdue" if status is LATE (submitted after deadline)
      if (status === 'LATE') {
        setTimeRemaining('Submitted Late');
        setIsUrgent(true);
        return;
      }

      // ✅ If submitted on time (SUBMITTED or GRADED), show "Submitted"
      if (status === 'SUBMITTED' || status === 'GRADED') {
        setTimeRemaining('Submitted');
        setIsUrgent(false);
        return;
      }

      // ✅ For PENDING tasks - show time remaining or overdue
      if (diff < 0) {
        setTimeRemaining('Overdue');
        setIsUrgent(true);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours < 1) {
        setIsUrgent(true);
        if (minutes <= 5) {
          setTimeRemaining(`${minutes} min left`);
        } else if (minutes <= 30) {
          setTimeRemaining(`${minutes} min left`);
        } else {
          setTimeRemaining(`${minutes} min left`);
        }
      } else if (hours < 2) {
        setIsUrgent(true);
        setTimeRemaining(`${hours}h ${minutes}m left`);
      } else if (hours < 6) {
        setIsUrgent(true);
        setTimeRemaining(`${hours} hours left`);
      } else if (hours < 12) {
        setTimeRemaining(`${hours} hours left`);
        setIsUrgent(false);
      } else {
        const days = Math.floor(hours / 24);
        setIsUrgent(false);
        if (days > 0) {
          setTimeRemaining(`${days} day${days > 1 ? 's' : ''} left`);
        } else {
          setTimeRemaining(`${hours} hours left`);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [task.dueDate, submission?.customDueDate, status]); // ✅ Added status dependency

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
          label: 'Late Submission', // ✅ More descriptive
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
        };
      case 'RESUBMITTING':
        return {
          icon: FiAlertCircle,
          label: 'Resubmit',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200',
        };
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig();
  const canSubmit = !submission || submission.status === 'PENDING' || submission.status === 'RESUBMITTING';

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Course Badge */}
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-full uppercase tracking-wide">
              {courseCode}
            </span>
            {/* ✅ FIXED: Only show "Urgent" for PENDING tasks that are urgent */}
            {isUrgent && status === 'PENDING' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                Urgent
              </span>
            )}
          </div>

          {/* Task Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
            {task.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {task.description || 'No description provided'}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {/* Deadline Timer */}
            <div className={`flex items-center gap-2 ${
              status === 'LATE' 
                ? 'text-red-600 font-semibold' 
                : isUrgent && status === 'PENDING'
                ? 'text-red-600 font-semibold' 
                : 'text-gray-600'
            }`}>
              <FiClock />
              <span>{timeRemaining}</span>
            </div>

            {/* Max Marks */}
            <div className="flex items-center gap-2 text-gray-600">
              <FiFileText />
              <span>{task.maxMarks} marks</span>
            </div>

            {/* Marks (if graded) */}
            {submission?.marks !== undefined && submission?.marks !== null && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Score:</span>
                <span className="font-bold text-gray-900">
                  {submission.marks}/{task.maxMarks}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex flex-col items-end gap-3">
          {/* Status Badge */}
          {statusConfig && (
            <div className={`flex items-center gap-2 px-3 py-1.5 ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} rounded-full text-sm font-medium`}>
              <statusConfig.icon className="text-base" />
              <span>{statusConfig.label}</span>
            </div>
          )}

          {/* Submit Button */}
          {canSubmit && (
            <button
              onClick={onSubmitClick}
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors duration-200"
            >
              Add Submission
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
