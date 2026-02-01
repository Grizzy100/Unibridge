// client\src\app\(dashboard)\teacher-dashboard\components\task\StudentSubmissionList.tsx
"use client"

export type UiStudentRow = {
  id: string
  name: string
  enrollmentNumber?: string | null
  statusText: string
  statusTone: "ok" | "danger" | "info" | "muted"
  profileId: string
  userId: string
  submissionKey: string
}

function badgeClass(tone: UiStudentRow["statusTone"]) {
  if (tone === "ok") return "bg-emerald-50 text-emerald-700 border-emerald-200"
  if (tone === "danger") return "bg-rose-50 text-rose-700 border-rose-200"
  if (tone === "info") return "bg-sky-50 text-sky-700 border-sky-200"
  return "bg-slate-50 text-slate-700 border-slate-200"
}

export default function StudentSubmissionList({
  rows,
  onHoverRow,
  onLeaveList,
}: {
  rows: UiStudentRow[]
  onHoverRow?: (row: UiStudentRow, rect: DOMRect) => void
  onLeaveList?: () => void
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        No students found for this course.
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
      onMouseLeave={() => {
        if (onLeaveList) onLeaveList()
      }}
    >
      <div className="px-5 py-3 border-b border-slate-200">
        <p className="text-sm font-bold text-slate-900">Students</p>
        <p className="text-xs text-slate-500 mt-0.5">Hover a student to view/grade</p>
      </div>

      <div className="max-h-[520px] overflow-auto">
        {rows.map((s) => (
          <div
            key={s.id}
            className="px-5 py-3 border-b border-slate-100 flex items-center justify-between"
            onMouseEnter={(e) => {
              if (!onHoverRow) return
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
              onHoverRow(s, rect)
            }}
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{s.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.enrollmentNumber || "-"}</p>
            </div>

            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badgeClass(
                s.statusTone
              )}`}
            >
              {s.statusText}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
