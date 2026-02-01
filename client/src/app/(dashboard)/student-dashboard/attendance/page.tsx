'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '../components/DashboardLayout'
import CourseAttendanceCard from './components/CourseAttendanceCard'
import { getUser } from '../../../../../lib/auth'
import { getUserCourses } from '../../../../../lib/courses'
import { sessionAPI, AttendanceSession } from '../../../../../lib/attendance'

interface CourseWithSession {
  id: string
  courseCode: string
  courseName: string
  credits: number
  activeSession?: AttendanceSession
}

export default function AttendancePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<CourseWithSession[]>([])
  const [error, setError] = useState<string | null>(null)

  const POLL_MS = 4000
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const user = getUser()
    if (!user || user.role !== 'STUDENT') {
      router.replace('/login/student')
      return
    }

    const load = async () => {
      try {
        setError(null)

        const enrolledCourses = await getUserCourses()

        if (!enrolledCourses || enrolledCourses.length === 0) {
          setCourses([])
          return
        }

        const courseIds = enrolledCourses.map((c: any) => c.id)
        const activeSessions = await sessionAPI.getActiveSessions(courseIds)

        const withSessions: CourseWithSession[] = enrolledCourses.map((course: any) => {
          const activeSession = activeSessions.find((s) => s.courseId === course.id)
          return {
            id: course.id,
            courseCode: course.courseCode,
            courseName: course.courseName,
            credits: course.credits,
            activeSession,
          }
        })

        setCourses(withSessions)
      } catch (err: any) {
        console.error('[AttendancePage] Error loading:', err)
        setError(err?.message || 'Failed to load courses')
      } finally {
        setLoading(false)
      }
    }

    load()
    intervalRef.current = window.setInterval(load, POLL_MS)

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [router])

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6 pb-20">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Attendance</h1>
          <p className="text-slate-600 mt-1">Your enrolled classes are shown below</p>
        </div>

        {loading ? (
          <div className="min-h-[250px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto" />
              <p className="mt-4 text-slate-600">Loading classes...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 font-semibold">Could not load classes</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <p className="text-xs text-red-500 mt-2">Auto retrying</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="min-h-[250px] flex items-center justify-center">
            <p className="text-slate-500 text-sm">You are not enrolled in any courses</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <CourseAttendanceCard
                key={course.id}
                course={course}
                onRefresh={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}







// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import DashboardLayout from '../components/DashboardLayout';
// import CourseAttendanceCard from './components/CourseAttendanceCard';
// import { getUser } from '../../../../../lib/auth';
// import { getUserCourses } from '../../../../../lib/courses';
// import { sessionAPI, AttendanceSession } from '../../../../../lib/attendance';
// import { RefreshCw, Clock, AlertCircle } from 'lucide-react';

// interface CourseWithSession {
//   id: string;
//   courseCode: string;
//   courseName: string;
//   credits: number;
//   activeSession?: AttendanceSession;
// }

// export default function AttendancePage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [courses, setCourses] = useState<CourseWithSession[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const user = getUser();
//     if (!user || user.role !== 'STUDENT') {
//       router.replace('/login/student');
//       return;
//     }

//     loadCoursesAndSessions();
//   }, [router]);

//   const loadCoursesAndSessions = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const enrolledCourses = await getUserCourses();

//       if (!enrolledCourses || enrolledCourses.length === 0) {
//         setCourses([]);
//         setLoading(false);
//         return;
//       }

//       const courseIds = enrolledCourses.map((c: any) => c.id);
//       const activeSessions = await sessionAPI.getActiveSessions(courseIds);

//       const coursesWithSessions: CourseWithSession[] = enrolledCourses.map((course: any) => {
//         const activeSession = activeSessions.find((s) => s.courseId === course.id);
//         return {
//           id: course.id,
//           courseCode: course.courseCode,
//           courseName: course.courseName,
//           credits: course.credits,
//           activeSession,
//         };
//       });

//       setCourses(coursesWithSessions);
//     } catch (err: any) {
//       console.error('[AttendancePage] Error loading data:', err);
//       setError(err?.message || 'Failed to load courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex items-center justify-center min-h-[500px]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-900 mx-auto" />
//             <p className="mt-4 text-slate-600 font-medium">Loading classes...</p>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardLayout>
//         <div className="max-w-7xl mx-auto p-6">
//           <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
//             <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
//             <p className="text-red-800 font-bold text-lg mb-2">Error Loading Classes</p>
//             <p className="text-red-600 text-sm mb-4">{error}</p>
//             <button
//               onClick={loadCoursesAndSessions}
//               className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (courses.length === 0) {
//     return (
//       <DashboardLayout>
//         <div className="max-w-7xl mx-auto p-6">
//           <h1 className="text-3xl font-bold text-slate-900 mb-6">Student Classes</h1>
//           <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
//             <Clock className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
//             <p className="text-yellow-900 font-bold text-xl mb-2">No Courses Enrolled</p>
//             <p className="text-yellow-700">
//               You are not enrolled in any courses yet. Contact your admin.
//             </p>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   const activeCount = courses.filter((c) => c.activeSession).length;

//   return (
//     <DashboardLayout>
//       <div className="max-w-7xl mx-auto p-6 pb-20">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-900 mb-2">Student Classes</h1>
//             {activeCount > 0 ? (
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
//                 <p className="text-green-600 font-semibold text-lg">
//                   {activeCount} Active Session{activeCount > 1 ? 's' : ''} Available
//                 </p>
//               </div>
//             ) : (
//               <p className="text-slate-600 text-lg">No active sessions right now</p>
//             )}
//           </div>

//           <button
//             onClick={loadCoursesAndSessions}
//             className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-lg hover:shadow-xl"
//           >
//             <RefreshCw className="w-4 h-4" />
//             Refresh
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {courses.map((course) => (
//             <CourseAttendanceCard
//               key={course.id}
//               course={course}
//               onRefresh={loadCoursesAndSessions}
//             />
//           ))}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }
