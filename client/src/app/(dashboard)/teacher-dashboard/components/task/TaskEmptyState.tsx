//client\src\app\(dashboard)\teacher-dashboard\components\task\TaskEmptyState.tsx
"use client"

export default function TaskEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-lg font-bold text-slate-900">Create a task</p>
      <p className="text-sm text-slate-500 mt-2">
        No tasks found for this course. Create the first task and track submissions.
      </p>
      <button
        onClick={onCreate}
        className="mt-5 h-10 px-4 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold"
      >
        Create Task
      </button>
    </div>
  )
}
