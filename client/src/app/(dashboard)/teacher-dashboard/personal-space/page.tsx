//client\src\app\(dashboard)\teacher-dashboard\personal-space\page.tsx
"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { teacherApi, TeacherCourse } from "../../../../../lib/teacherApi"
import LoadingScreen from "../components/common/LoadingScreen"
import CourseCard from "../components/personal/CourseCard"
import QrSessionModal from "../components/personal/QrSessionModal"

export default function PersonalSpace() {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<TeacherCourse[]>([])
  const [activeCourse, setActiveCourse] = useState<TeacherCourse | null>(null)

  useEffect(() => {
    teacherApi.auth.ensureTeacher()

    let ignore = false
    async function load() {
      try {
        setLoading(true)
        const list = await teacherApi.courses.my()
        if (!ignore) setCourses(list)
      } catch (e: any) {
        toast.error(e.message || "Failed to load courses")
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  if (loading) return <LoadingScreen label="Loading your courses..." />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Personal Space</h1>
        <p className="text-sm text-slate-500 mt-1">Your courses and attendance tools.</p>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-sm text-slate-600">
          No courses found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} onTakeAttendance={() => setActiveCourse(c)} />
          ))}
        </div>
      )}

      {activeCourse ? (
        <QrSessionModal course={activeCourse} onClose={() => setActiveCourse(null)} />
      ) : null}
    </div>
  )
}
