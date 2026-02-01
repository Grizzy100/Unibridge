// //client\src\app\(dashboard)\teacher-dashboard\components\task\CreateTaskModal.tsx
// "use client"

// import { useState } from "react"
// import toast from "react-hot-toast"
// import { createTask } from "../../../../../../lib/task"

// export default function CreateTaskModal({
//   courseId,
//   onClose,
//   onCreated,
// }: {
//   courseId: string
//   onClose: () => void
//   onCreated: () => void
// }) {
//   const [title, setTitle] = useState("")
//   const [dueDate, setDueDate] = useState("")
//   const [saving, setSaving] = useState(false)

//   async function submit() {
//     try {
//       if (!courseId) {
//         toast.error("Select a course")
//         return
//       }
//       if (!title.trim()) {
//         toast.error("Title is required")
//         return
//       }
//       if (!dueDate) {
//         toast.error("Due date is required")
//         return
//       }

//       setSaving(true)
//       await createTask({
//         courseId,
//         title: title.trim(),
//         dueDate: new Date(dueDate).toISOString(),
//       })
//       toast.success("Task created")
//       onCreated()
//     } catch (e: any) {
//       toast.error(e.message || "Failed to create task")
//     } finally {
//       setSaving(false)
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
//       <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
//         <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
//           <div>
//             <p className="text-sm font-bold text-slate-900">Create Task</p>
//             <p className="text-xs text-slate-500 mt-0.5">For selected course</p>
//           </div>

//           <button
//             onClick={onClose}
//             className="h-9 px-3 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-50"
//           >
//             Close
//           </button>
//         </div>

//         <div className="p-6 space-y-4">
//           <div>
//             <p className="text-xs font-semibold text-slate-500">Title</p>
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="mt-1 w-full h-10 rounded-2xl border border-slate-200 px-3 text-sm outline-none"
//               placeholder="Task title"
//             />
//           </div>

//           <div>
//             <p className="text-xs font-semibold text-slate-500">Due date</p>
//             <input
//               type="datetime-local"
//               value={dueDate}
//               onChange={(e) => setDueDate(e.target.value)}
//               className="mt-1 w-full h-10 rounded-2xl border border-slate-200 px-3 text-sm outline-none"
//             />
//           </div>

//           <button
//             onClick={submit}
//             disabled={saving}
//             className="w-full h-11 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold disabled:opacity-60"
//           >
//             {saving ? "Creating..." : "Create Task"}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }





// client/src/app/(dashboard)/teacher-dashboard/components/task/CreateTaskModal.tsx
"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { createTask, TaskAPIError } from "../../../../../../lib/task"

export default function CreateTaskModal({
  courseId,
  onClose,
  onCreated,
}: {
  courseId: string
  onClose: () => void
  onCreated: () => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [maxMarks, setMaxMarks] = useState("5")
  const [dueDate, setDueDate] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    setError(null)

    try {
      // Validation
      if (!courseId) {
        setError("Select a course")
        return
      }
      if (!title.trim()) {
        setError("Title is required")
        return
      }
      if (!dueDate) {
        setError("Due date is required")
        return
      }

      const marks = parseInt(maxMarks)
      if (isNaN(marks) || marks < 1 || marks > 100) {
        setError("Max marks must be between 1 and 100")
        return
      }

      setSaving(true)

      console.log("📤 [Create Task] Creating task:", { courseId, title, dueDate, maxMarks: marks })

      await createTask({
        courseId,
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: new Date(dueDate).toISOString(),
        maxMarks: marks,
      })

      console.log("✅ [Create Task] Task created successfully")
      toast.success("Task created successfully")
      onCreated()
    } catch (e: any) {
      console.error("❌ [Create Task] Failed:", e)
      
      if (e instanceof TaskAPIError) {
        if (e.statusCode === 401) {
          setError("Session expired. Please login again.")
        } else {
          setError(e.message || "Failed to create task")
        }
      } else {
        setError(e.message || "Failed to create task")
      }
      
      toast.error(e.message || "Failed to create task")
    } finally {
      setSaving(false)
    }
  }

  // Set minimum date to now
  const minDateTime = new Date().toISOString().slice(0, 16)

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">Create Task</p>
            <p className="text-xs text-slate-500 mt-0.5">For selected course</p>
          </div>

          <button
            onClick={onClose}
            disabled={saving}
            className="h-9 px-3 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
          >
            Close
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <p className="text-xs font-semibold text-slate-700">
              Title <span className="text-red-500">*</span>
            </p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full h-10 rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Assignment 1: Data Structures"
              disabled={saving}
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-semibold text-slate-700">Description (Optional)</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full h-20 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Brief description of the task..."
              disabled={saving}
              maxLength={500}
            />
          </div>

          {/* Max Marks */}
          <div>
            <p className="text-xs font-semibold text-slate-700">
              Max Marks <span className="text-red-500">*</span>
            </p>
            <input
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(e.target.value)}
              className="mt-1 w-full h-10 rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="5"
              min="1"
              max="100"
              disabled={saving}
            />
          </div>

          {/* Due Date */}
          <div>
            <p className="text-xs font-semibold text-slate-700">
              Due date <span className="text-red-500">*</span>
            </p>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={minDateTime}
              className="mt-1 w-full h-10 rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              disabled={saving}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={submit}
            disabled={saving}
            className="w-full h-11 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              "Create Task"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
