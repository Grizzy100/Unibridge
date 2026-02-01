//client\src\app\(dashboard)\teacher-dashboard\components\task\CourseSelect.tsx
"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { teacherApi, TeacherCourse } from "../../../../../../lib/teacherApi"

export default function CourseSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (courseId: string) => void
}) {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<TeacherCourse[]>([])

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        teacherApi.auth.ensureTeacher()
        const list = await teacherApi.courses.my()
        setCourses(list)

        if (!value && list.length > 0) {
          onChange(list[0].id)
        }
      } catch (e: any) {
        toast.error(e.message || "Failed to load courses")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-w-[280px]">
      <select
        value={value}
        disabled={loading || courses.length === 0}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none"
      >
        {loading ? <option>Loading courses...</option> : null}
        {!loading && courses.length === 0 ? <option>No courses</option> : null}
        {!loading &&
          courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.courseCode} - {c.courseName}
            </option>
          ))}
      </select>
    </div>
  )
}
