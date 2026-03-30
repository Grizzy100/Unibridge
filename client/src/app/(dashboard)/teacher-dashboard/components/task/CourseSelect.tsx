//client\src\app\(dashboard)\teacher-dashboard\components\task\CourseSelect.tsx
"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { teacherApi, TeacherCourse } from "../../../../../../lib/teacherApi"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../components/ui/select"

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
    <div className="w-full sm:min-w-[280px] max-w-[170px] sm:max-w-max">
      <Select
        value={value}
        onValueChange={onChange}
        disabled={loading || courses.length === 0}
      >
        <SelectTrigger className="h-9 sm:h-10 w-full rounded-2xl border-slate-200 bg-white/80 backdrop-blur-md px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-white hover:border-slate-300 hover:shadow focus:ring-slate-400 focus:ring-offset-0 disabled:opacity-50">
          <SelectValue placeholder="Select a course" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-200 bg-white/95 backdrop-blur-xl shadow-lg mt-1 z-50">
          {loading && (
            <SelectItem value="loading" disabled className="text-xs sm:text-sm text-slate-500">
              Loading courses...
            </SelectItem>
          )}
          {!loading && courses.length === 0 && (
            <SelectItem value="empty" disabled className="text-xs sm:text-sm text-slate-500">
              No courses
            </SelectItem>
          )}
          {!loading &&
            courses.map((c) => (
              <SelectItem
                key={c.id}
                value={c.id}
                className="text-xs sm:text-sm font-medium text-slate-700 cursor-pointer rounded-lg hover:bg-slate-100 focus:bg-slate-100"
              >
                {c.courseCode} - {c.courseName}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      </div>
  )
}
