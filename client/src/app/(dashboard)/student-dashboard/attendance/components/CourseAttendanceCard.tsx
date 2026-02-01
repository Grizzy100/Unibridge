// // client/src/app/(dashboard)/student-dashboard/attendance/components/CourseAttendanceCard.tsx
// 'use client';

// import { useState } from 'react';
// import { FiBook, FiClock } from 'react-icons/fi';
// import { IoQrCodeOutline } from 'react-icons/io5';
// import { MapPin } from 'lucide-react';
// import QrScannerModal from './QrScannerModal';
// import { formatTime, AttendanceSession } from '../../../../../../lib/attendance';
// import toast from 'react-hot-toast';

// interface CourseAttendanceCardProps {
//   course: {
//     id: string;
//     courseCode: string;
//     courseName: string;
//     credits: number;
//     activeSession?: AttendanceSession;
//   };
//   onRefresh: () => void;
// }

// export default function CourseAttendanceCard({ course, onRefresh }: CourseAttendanceCardProps) {
//   const [showScanner, setShowScanner] = useState(false);
//   const [hasActiveOutpass] = useState(false); // TODO: Fetch from API

//   const hasActiveSession = course.activeSession && course.activeSession.status === 'ACTIVE';

//   const handleScanClick = () => {
//     if (hasActiveSession) {
//       setShowScanner(true);
//     } else {
//       toast('⏰ No active attendance session for this course', {
//         duration: 3000,
//         icon: '🔒',
//       });
//     }
//   };

//   return (
//     <>
//       <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-2xl hover:border-slate-300 transition-all duration-300 transform hover:-translate-y-1">
//         {/* Course Header */}
//         <div className="flex items-start gap-4 mb-5">
//           <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
//             <FiBook className="text-white text-xl" />
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="font-bold text-slate-900 text-base leading-tight mb-1 truncate">
//               {course.courseName}
//             </h3>
//             <p className="text-xs text-slate-500 font-mono">{course.courseCode}</p>
//             <p className="text-xs text-slate-400 mt-1">{course.credits} Credits</p>
//           </div>
//         </div>

//         {/* Session Status */}
//         {hasActiveSession ? (
//           <div className="space-y-4">
//             {/* Location */}
//             {course.activeSession!.location && (
//               <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
//                 <MapPin className="w-4 h-4 text-slate-500" />
//                 <span className="font-medium">{course.activeSession!.location}</span>
//               </div>
//             )}

//             {/* Time Info */}
//             <div className="flex items-center gap-2 text-xs text-slate-600 bg-blue-50 px-3 py-2 rounded-lg">
//               <FiClock className="text-sm text-blue-600" />
//               <span className="font-medium">
//                 {formatTime(course.activeSession!.sessionStartTime)} - {formatTime(course.activeSession!.sessionEndTime)}
//               </span>
//             </div>

//             {/* Live Badge */}
//             <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-3 flex items-center justify-center gap-2 shadow-sm">
//               <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
//               <span className="text-sm font-bold text-green-700">Attendance Open</span>
//             </div>

//             {/* Mark Attendance Button */}
//             <button
//               onClick={handleScanClick}
//               disabled={hasActiveOutpass}
//               className={`w-full py-3.5 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
//                 hasActiveOutpass
//                   ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 hover:shadow-2xl transform hover:-translate-y-0.5'
//               }`}
//             >
//               <IoQrCodeOutline className="text-xl" />
//               Mark Attendance
//             </button>

//             {hasActiveOutpass && (
//               <p className="text-xs text-red-600 text-center font-medium">
//                 🚫 Active outpass - cannot mark attendance
//               </p>
//             )}
//           </div>
//         ) : (
//           <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5 text-center">
//             <FiClock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//             <p className="text-sm text-gray-600 font-medium">Attendance Not Open</p>
//             <p className="text-xs text-gray-400 mt-1">Wait for teacher to start session</p>
//           </div>
//         )}
//       </div>

//       {showScanner && hasActiveSession && (
//         <QrScannerModal
//           courseId={course.id}
//           courseName={course.courseName}
//           courseCode={course.courseCode}
//           onClose={() => setShowScanner(false)}
//           onSuccess={() => {
//             setShowScanner(false);
//             onRefresh();
//           }}
//         />
//       )}
//     </>
//   );
// }



'use client'

import { useEffect, useMemo, useState } from 'react'
import { FiBook, FiClock } from 'react-icons/fi'
import { IoQrCodeOutline } from 'react-icons/io5'
import { MapPin } from 'lucide-react'
import QrScannerModal from './QrScannerModal'
import { AttendanceSession, formatTime } from '../../../../../../lib/attendance'
import { getUser, getToken } from '../../../../../../lib/auth'

const OUTPASS_URL =
  process.env.NEXT_PUBLIC_OUTPASS_SERVICE_URL || 'http://localhost:3003'

interface CourseAttendanceCardProps {
  course: {
    id: string
    courseCode: string
    courseName: string
    credits: number
    activeSession?: AttendanceSession
  }
  onRefresh: () => void
}

export default function CourseAttendanceCard({ course, onRefresh }: CourseAttendanceCardProps) {
  const [showScanner, setShowScanner] = useState(false)
  const [checkingOutpass, setCheckingOutpass] = useState(false)
  const [hasActiveOutpass, setHasActiveOutpass] = useState(false)

  const activeSession = course.activeSession
  const hasActiveSession = !!activeSession && activeSession.status === 'ACTIVE'

  const timeText = useMemo(() => {
    if (!activeSession) return ''
    return `${formatTime(activeSession.sessionStartTime)} - ${formatTime(activeSession.sessionEndTime)}`
  }, [activeSession])

  useEffect(() => {
    const run = async () => {
      if (!hasActiveSession || !activeSession) {
        setHasActiveOutpass(false)
        setCheckingOutpass(false)
        return
      }

      const user = getUser()
      const token = getToken()

      if (!user?.id || !token) {
        setHasActiveOutpass(false)
        setCheckingOutpass(false)
        return
      }

      try {
        setCheckingOutpass(true)

        const url = new URL(`${OUTPASS_URL}/api/outpass/check-active/${user.id}`)
        url.searchParams.set('date', activeSession.sessionStartTime)

        const res = await fetch(url.toString(), {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          setHasActiveOutpass(false)
          return
        }

        const data = await res.json()
        setHasActiveOutpass(!!data?.hasActiveOutpass)
      } catch {
        setHasActiveOutpass(false)
      } finally {
        setCheckingOutpass(false)
      }
    }

    run()
  }, [hasActiveSession, activeSession?.sessionStartTime])

  const canShowMarkButton = hasActiveSession && !checkingOutpass && !hasActiveOutpass

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center flex-shrink-0">
              <FiBook className="text-white text-xl" />
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-slate-900 truncate">
                {course.courseName}{' '}
                <span className="text-xs text-slate-500 font-normal">({course.courseCode})</span>
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                {hasActiveSession && activeSession ? (
                  <>
                    <span className="inline-flex items-center gap-1">
                      <FiClock className="text-slate-500" />
                      {timeText}
                    </span>

                    {activeSession.location ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {activeSession.location}
                      </span>
                    ) : null}

                    <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Live
                    </span>

                    {checkingOutpass ? (
                      <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
                        Checking outpass
                      </span>
                    ) : null}
                  </>
                ) : (
                  <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
                    Attendance not open
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            {hasActiveOutpass ? null : canShowMarkButton ? (
              <button
                onClick={() => setShowScanner(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
              >
                <IoQrCodeOutline className="text-lg" />
                Mark attendance
              </button>
            ) : (
              <div className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-500 text-sm font-semibold">
                {hasActiveSession ? (checkingOutpass ? 'Checking' : 'Not available') : 'Not available'}
              </div>
            )}
          </div>
        </div>
      </div>

      {showScanner && canShowMarkButton && (
        <QrScannerModal
          courseId={course.id}
          courseName={course.courseName}
          courseCode={course.courseCode}
          onClose={() => setShowScanner(false)}
          onSuccess={() => {
            setShowScanner(false)
            onRefresh()
          }}
        />
      )}
    </>
  )
}



