//client\src\app\(dashboard)\teacher-dashboard\components\task\TaskCard.tsx
"use client"

export type UiTask = {
  id: string
  courseId: string
  title: string
  dueDate: string
  createdAt: string
  maxMarks?: number
  submittedCount?: number
  totalStudents?: number
}

export default function TaskCard({
  task,
  selected,
  onClick,
}: {
  task: UiTask
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 bg-white shadow-sm transition ${
        selected ? "border-slate-900" : "border-slate-200 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">{task.title}</p>

          <p className="text-xs text-slate-500 mt-1">
            Due: {new Date(task.dueDate).toLocaleString("en-IN")}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Created: {new Date(task.createdAt).toLocaleString("en-IN")}
          </p>

          {typeof task.maxMarks === "number" ? (
            <p className="text-xs text-slate-500 mt-1">Max marks: {task.maxMarks}</p>
          ) : null}
        </div>

        <div className="shrink-0 text-right">
          {typeof task.submittedCount === "number" && typeof task.totalStudents === "number" ? (
            <div className="text-xs font-semibold text-slate-700">
              {task.submittedCount}/{task.totalStudents}
            </div>
          ) : (
            <div className="text-xs text-slate-400"> </div>
          )}
        </div>
      </div>
    </button>
  )
}
