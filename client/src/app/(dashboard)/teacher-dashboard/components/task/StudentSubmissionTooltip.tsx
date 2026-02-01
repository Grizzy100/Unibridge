// // client/src/app/(dashboard)/teacher-dashboard/components/task/StudentSubmissionTooltip.tsx
// "use client"

// import { useEffect, useMemo, useState } from "react"
// import toast from "react-hot-toast"
// import type { Task, TaskSubmission } from "../../../../../../lib/task"
// import { gradeSubmission } from "../../../../../../lib/task"
// import type { UiStudentRow } from "./StudentSubmissionList"
// import SubmissionPreviewModal from "./SubmissionPreviewModal"

// export default function StudentSubmissionTooltip({
//   open,
//   anchorRect,
//   onRequestClose,
//   onKeepOpen,
//   row,
//   task,
//   submission,
//   onGraded,
// }: {
//   open: boolean
//   anchorRect: DOMRect | null
//   onRequestClose: () => void
//   onKeepOpen: () => void
//   row: UiStudentRow | null
//   task: Task | null
//   submission: TaskSubmission | null
//   onGraded: () => void
// }) {
//   const [saving, setSaving] = useState(false)
//   const [draftMarks, setDraftMarks] = useState<number>(0)

//   const [previewOpen, setPreviewOpen] = useState(false)
//   const [previewUrl, setPreviewUrl] = useState("")
//   const [previewMime, setPreviewMime] = useState<string | undefined>(undefined)
//   const [previewTitle, setPreviewTitle] = useState("")
//   const [previewSubtitle, setPreviewSubtitle] = useState("")

//   useEffect(() => {
//     setDraftMarks(submission?.marks ?? 0)
//   }, [submission?.id])

//   const tooltipWidth = 280

//   const pos = useMemo(() => {
//     if (!anchorRect) return { top: -9999, left: -9999, arrowLeft: 24 }

//     const gap = 10
//     const padding = 12

//     const top = anchorRect.bottom + window.scrollY + gap

//     const rowCenterX = anchorRect.left + window.scrollX + anchorRect.width / 2
//     const desiredLeft = rowCenterX - tooltipWidth / 2

//     const minLeft = window.scrollX + padding
//     const maxLeft = window.scrollX + window.innerWidth - tooltipWidth - padding
//     const left = Math.min(Math.max(desiredLeft, minLeft), maxLeft)

//     const arrowLeft = Math.max(18, Math.min(tooltipWidth - 18, rowCenterX - left))

//     return { top, left, arrowLeft }
//   }, [anchorRect])

//   function canGradeNow() {
//     if (!submission) return false
//     if (submission.status === "GRADED") return false
//     if (submission.status === "PENDING") return false
//     return submission.status === "SUBMITTED" || submission.status === "LATE" || submission.status === "RESUBMITTING"
//   }

//   function handleGrade(delta: number) {
//     if (!task || !row) return
//     if (!canGradeNow()) return

//     const max = task.maxMarks ?? 5
//     const next = Math.max(0, Math.min(max, draftMarks + delta))
//     setDraftMarks(next)
//   }

//   async function saveGrade() {
//     if (!task || !row) return
//     if (!canGradeNow()) return
//     if (!submission) return

//     try {
//       setSaving(true)

//       const studentId = row.submissionKey
//       await gradeSubmission(task.id, studentId, { marks: draftMarks })

//       toast.success("Graded")
//       onGraded()
//       onRequestClose()
//     } catch (e: any) {
//       toast.error(e.message || "Failed to grade")
//     } finally {
//       setSaving(false)
//     }
//   }

//   function openPreview() {
//     const url = submission?.answerFileUrl || ""
//     if (!url) {
//       toast.error("No submission file found")
//       return
//     }

//     setPreviewUrl(url)
//     setPreviewMime(submission?.answerFileType)
//     setPreviewTitle(row?.name ? `${row.name} - Submission` : "Submission")
//     setPreviewSubtitle(row?.enrollmentNumber || "")
//     setPreviewOpen(true)
//     onRequestClose()
//   }

//   const visible = open && !!row && !!task && !!anchorRect && !!submission && canGradeNow()

//   return (
//     <>
//       <div className="fixed inset-0 z-50 pointer-events-none" style={{ display: visible ? "block" : "none" }}>
//         <div
//           className="absolute pointer-events-auto"
//           style={{ top: pos.top, left: pos.left }}
//           onMouseEnter={onKeepOpen}
//           onMouseLeave={onRequestClose}
//         >
//           <div className="relative h-4">
//             <div
//               className="absolute -top-1 h-4 w-4 rotate-45 bg-white border-l border-t border-slate-200 shadow-sm"
//               style={{ left: pos.arrowLeft - 8 }}
//             />
//           </div>

//           <div className="w-[280px] rounded-2xl border border-slate-200 bg-white shadow-lg p-3">
//             <div className="flex items-start justify-between gap-3">
//               <div className="min-w-0">
//                 <p className="text-sm font-bold text-slate-900 truncate">{row?.name || "Student"}</p>
//                 <p className="text-xs text-slate-500 mt-0.5">{row?.enrollmentNumber || "-"}</p>
//               </div>

//               <button
//                 onClick={onRequestClose}
//                 className="text-xs font-semibold text-slate-500 hover:text-slate-800"
//               >
//                 Close
//               </button>
//             </div>

//             <div className="mt-2 text-xs text-slate-600">
//               <p className="font-semibold text-slate-800">Status</p>
//               <p className="mt-0.5">{row?.statusText}</p>
//             </div>

//             <div className="mt-3 flex items-center gap-2">
//               <button
//                 className="h-7 px-3 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 disabled:opacity-60"
//                 onClick={openPreview}
//                 disabled={!submission?.answerFileUrl}
//               >
//                 View
//               </button>

//               <div className="ml-auto flex items-center gap-2">
//                 <button
//                   className="h-7 w-8 rounded-xl border border-slate-200 text-sm font-bold hover:bg-slate-50 disabled:opacity-60"
//                   onClick={() => handleGrade(-1)}
//                   disabled={saving || !canGradeNow()}
//                 >
//                   -
//                 </button>

//                 <div className="min-w-[40px] text-center text-sm font-bold text-slate-900">{draftMarks}</div>

//                 <button
//                   className="h-7 w-8 rounded-xl border border-slate-200 text-sm font-bold hover:bg-slate-50 disabled:opacity-60"
//                   onClick={() => handleGrade(1)}
//                   disabled={saving || !canGradeNow()}
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             <button
//               className="mt-3 w-full h-9 rounded-2xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60"
//               onClick={saveGrade}
//               disabled={saving || !canGradeNow()}
//             >
//               Save grade
//             </button>
//           </div>
//         </div>
//       </div>

//       <SubmissionPreviewModal
//         open={previewOpen}
//         url={previewUrl}
//         mimeType={previewMime}
//         title={previewTitle}
//         subtitle={previewSubtitle}
//         onClose={() => setPreviewOpen(false)}
//       />
//     </>
//   )
// }









// client/src/app/(dashboard)/teacher-dashboard/components/task/StudentSubmissionTooltip.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import type { Task, TaskSubmission } from "../../../../../../lib/task"
import { gradeSubmission, TaskAPIError } from "../../../../../../lib/task"
import type { UiStudentRow } from "./StudentSubmissionList"
import SubmissionPreviewModal from "./SubmissionPreviewModal"

export default function StudentSubmissionTooltip({
  open,
  anchorRect,
  onRequestClose,
  onKeepOpen,
  row,
  task,
  submission,
  onGraded,
}: {
  open: boolean
  anchorRect: DOMRect | null
  onRequestClose: () => void
  onKeepOpen: () => void
  row: UiStudentRow | null
  task: Task | null
  submission: TaskSubmission | null
  onGraded: () => void
}) {
  const [saving, setSaving] = useState(false)
  const [draftMarks, setDraftMarks] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")
  const [previewMime, setPreviewMime] = useState<string | undefined>(undefined)
  const [previewTitle, setPreviewTitle] = useState("")
  const [previewSubtitle, setPreviewSubtitle] = useState("")

  useEffect(() => {
    setDraftMarks(submission?.marks ?? 0)
    setError(null)
  }, [submission?.id])

  const tooltipWidth = 280

  const pos = useMemo(() => {
    if (!anchorRect) return { top: -9999, left: -9999, arrowLeft: 24 }

    const gap = 10
    const padding = 12

    const top = anchorRect.bottom + window.scrollY + gap

    const rowCenterX = anchorRect.left + window.scrollX + anchorRect.width / 2
    const desiredLeft = rowCenterX - tooltipWidth / 2

    const minLeft = window.scrollX + padding
    const maxLeft = window.scrollX + window.innerWidth - tooltipWidth - padding
    const left = Math.min(Math.max(desiredLeft, minLeft), maxLeft)

    const arrowLeft = Math.max(18, Math.min(tooltipWidth - 18, rowCenterX - left))

    return { top, left, arrowLeft }
  }, [anchorRect])

  function canGradeNow() {
    if (!submission) return false
    if (submission.status === "GRADED") return false
    if (submission.status === "PENDING") return false
    return submission.status === "SUBMITTED" || submission.status === "LATE" || submission.status === "RESUBMITTING"
  }

  function handleGrade(delta: number) {
    if (!task || !row) return
    if (!canGradeNow()) return
    setError(null)

    const max = task.maxMarks ?? 5
    const next = Math.max(0, Math.min(max, draftMarks + delta))
    setDraftMarks(next)
  }

  async function saveGrade() {
    if (!task || !row) return
    if (!canGradeNow()) return
    if (!submission) return
    setError(null)

    try {
      setSaving(true)

      const studentId = row.submissionKey
      console.log(`📤 [Tooltip] Grading submission for student ${studentId}: ${draftMarks}/${task.maxMarks}`)

      await gradeSubmission(task.id, studentId, { marks: draftMarks })

      console.log("✅ [Tooltip] Graded successfully")
      toast.success("Graded successfully")
      onGraded()
      onRequestClose()
    } catch (e: any) {
      console.error("❌ [Tooltip] Failed to grade:", e)
      
      if (e instanceof TaskAPIError) {
        if (e.statusCode === 401) {
          setError("Session expired. Please login again.")
          toast.error("Session expired. Please login again.")
        } else {
          setError(e.message || "Failed to grade")
          toast.error(e.message || "Failed to grade")
        }
      } else {
        setError(e.message || "Failed to grade")
        toast.error(e.message || "Failed to grade")
      }
    } finally {
      setSaving(false)
    }
  }

  function openPreview() {
    const url = submission?.answerFileUrl || ""
    if (!url) {
      toast.error("No submission file found")
      return
    }

    setPreviewUrl(url)
    setPreviewMime(submission?.answerFileType)
    setPreviewTitle(row?.name ? `${row.name} - Submission` : "Submission")
    setPreviewSubtitle(row?.enrollmentNumber || "")
    setPreviewOpen(true)
    onRequestClose()
  }

  const visible = open && !!row && !!task && !!anchorRect && !!submission && canGradeNow()

  return (
    <>
      <div className="fixed inset-0 z-50 pointer-events-none" style={{ display: visible ? "block" : "none" }}>
        <div
          className="absolute pointer-events-auto"
          style={{ top: pos.top, left: pos.left }}
          onMouseEnter={onKeepOpen}
          onMouseLeave={onRequestClose}
        >
          <div className="relative h-4">
            <div
              className="absolute -top-1 h-4 w-4 rotate-45 bg-white border-l border-t border-slate-200 shadow-sm"
              style={{ left: pos.arrowLeft - 8 }}
            />
          </div>

          <div className="w-[280px] rounded-2xl border border-slate-200 bg-white shadow-lg p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{row?.name || "Student"}</p>
                <p className="text-xs text-slate-500 mt-0.5">{row?.enrollmentNumber || "-"}</p>
              </div>

              <button
                onClick={onRequestClose}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            {error && (
              <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                {error}
              </div>
            )}

            <div className="mt-2 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">Status</p>
              <p className="mt-0.5">{row?.statusText}</p>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                className="h-7 px-3 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 disabled:opacity-60"
                onClick={openPreview}
                disabled={!submission?.answerFileUrl}
              >
                View
              </button>

              <div className="ml-auto flex items-center gap-2">
                <button
                  className="h-7 w-8 rounded-xl border border-slate-200 text-sm font-bold hover:bg-slate-50 disabled:opacity-60"
                  onClick={() => handleGrade(-1)}
                  disabled={saving || !canGradeNow()}
                >
                  -
                </button>

                <div className="min-w-[40px] text-center text-sm font-bold text-slate-900">{draftMarks}</div>

                <button
                  className="h-7 w-8 rounded-xl border border-slate-200 text-sm font-bold hover:bg-slate-50 disabled:opacity-60"
                  onClick={() => handleGrade(1)}
                  disabled={saving || !canGradeNow()}
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="mt-3 w-full h-9 rounded-2xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60 flex items-center justify-center gap-2"
              onClick={saveGrade}
              disabled={saving || !canGradeNow()}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save grade"
              )}
            </button>
          </div>
        </div>
      </div>

      <SubmissionPreviewModal
        open={previewOpen}
        url={previewUrl}
        mimeType={previewMime}
        title={previewTitle}
        subtitle={previewSubtitle}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  )
}
