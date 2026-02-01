"use client"

import type { TeacherCourse } from "../../../../../../lib/teacherApi"

export default function CourseCard({
  course,
  onTakeAttendance,
}: {
  course: TeacherCourse
  onTakeAttendance: () => void
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold text-slate-900 truncate">{course.courseName}</div>
          <div className="text-sm text-slate-500 mt-1">
            {course.courseCode} • Sem {course.semester} • {course.credits} credits
          </div>
        </div>

        <button
          onClick={onTakeAttendance}
          className="h-10 px-4 rounded-2xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
        >
          Take Attendance
        </button>
      </div>
    </div>
  )
}
