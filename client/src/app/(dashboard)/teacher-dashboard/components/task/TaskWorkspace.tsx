// // client/src/app/(dashboard)/teacher-dashboard/components/task/TaskWorkspace.tsx
// "use client"

// import { useEffect, useMemo, useRef, useState } from "react"
// import toast from "react-hot-toast"
// import LoadingScreen from "../common/LoadingScreen"
// import CourseSelect from "./CourseSelect"
// import TaskEmptyState from "./TaskEmptyState"
// import TaskCard, { UiTask } from "./TaskCard"
// import StudentSubmissionList, { UiStudentRow } from "./StudentSubmissionList"
// import CreateTaskModal from "./CreateTaskModal"
// import StudentSubmissionTooltip from "./StudentSubmissionTooltip"

// import { getCourseTasks, getTaskSubmissionsForTeacher, Task, TaskSubmission } from "../../../../../../lib/task"
// import { teacherApi } from "../../../../../../lib/teacherApi"

// type CourseStudent = {
//   id: string
//   userId?: string
//   firstName?: string
//   lastName?: string
//   name?: string
//   enrollmentNumber?: string | null
// }

// function studentName(s: CourseStudent) {
//   if (s.name) return s.name
//   const a = s.firstName || ""
//   const b = s.lastName || ""
//   const full = `${a} ${b}`.trim()
//   return full || "Student"
// }

// async function fetchCourseStudents(courseId: string) {
//   const token = localStorage.getItem("token") || ""
//   const base = process.env.NEXT_PUBLIC_USER_SERVICE_URL || "http://localhost:3001"

//   const res = await fetch(`${base}/api/courses/${courseId}/students`, {
//     headers: { Authorization: `Bearer ${token}` },
//   })

//   const json = await res.json().catch(() => null)
//   if (!res.ok) throw new Error(json?.message || "Failed to load students")
//   return (json?.data || []) as CourseStudent[]
// }

// function uiStatus(task: UiTask, submission: TaskSubmission | null, nowMs: number) {
//   const due = new Date(submission?.customDueDate || task.dueDate).getTime()

//   if (!submission || submission.status === "PENDING") {
//     if (nowMs > due) return { text: "Overdue", tone: "danger" as const }
//     return { text: "Pending", tone: "muted" as const }
//   }

//   if (submission.status === "LATE") return { text: "Late", tone: "danger" as const }
//   if (submission.status === "SUBMITTED") return { text: "Submitted", tone: "ok" as const }
//   if (submission.status === "RESUBMITTING") return { text: "Resubmitting", tone: "info" as const }
//   return { text: `Graded ${submission.marks ?? 0}/${task.maxMarks ?? 5}`, tone: "ok" as const }
// }

// function canOpenTooltip(submission: TaskSubmission | null) {
//   if (!submission) return false
//   if (submission.status === "PENDING") return false
//   if (submission.status === "GRADED") return false
//   return submission.status === "SUBMITTED" || submission.status === "LATE" || submission.status === "RESUBMITTING"
// }

// export default function TaskWorkspace() {
//   const [loading, setLoading] = useState(true)

//   const [courseId, setCourseId] = useState("")
//   const [tasks, setTasks] = useState<UiTask[]>([])
//   const [selectedTaskId, setSelectedTaskId] = useState("")

//   const [students, setStudents] = useState<CourseStudent[]>([])
//   const [createOpen, setCreateOpen] = useState(false)

//   const [submissionsByTask, setSubmissionsByTask] = useState<Record<string, Record<string, TaskSubmission>>>({})

//   const [nowMs, setNowMs] = useState(() => Date.now())
//   useEffect(() => {
//     const id = window.setInterval(() => setNowMs(Date.now()), 60 * 1000)
//     return () => window.clearInterval(id)
//   }, [])

//   const [hoverOpen, setHoverOpen] = useState(false)
//   const [hoverRow, setHoverRow] = useState<UiStudentRow | null>(null)
//   const hoverAnchorRef = useRef<DOMRect | null>(null)

//   const openTimerRef = useRef<number | null>(null)
//   const closeTimerRef = useRef<number | null>(null)

//   const selectedTask = useMemo(
//     () => tasks.find((t) => t.id === selectedTaskId) || null,
//     [tasks, selectedTaskId]
//   )

//   async function loadTasks(cid: string) {
//     try {
//       setLoading(true)

//       setSelectedTaskId("")
//       setTasks([])
//       setStudents([])
//       setSubmissionsByTask({})

//       closeTooltipImmediate()

//       const res = await getCourseTasks(cid)
//       const list = (res.data || []) as Task[]

//       const mapped: UiTask[] = list.map((t) => ({
//         id: t.id,
//         courseId: t.courseId,
//         title: t.title,
//         dueDate: t.dueDate,
//         createdAt: t.createdAt,
//         maxMarks: t.maxMarks,
//       }))

//       setTasks(mapped)
//       if (mapped.length > 0) setSelectedTaskId(mapped[0].id)
//     } catch (e: any) {
//       toast.error(e.message || "Failed to load tasks")
//       setTasks([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function loadStudents(cid: string) {
//     try {
//       const list = await fetchCourseStudents(cid)
//       setStudents(list)
//     } catch (e: any) {
//       toast.error(e.message || "Failed to load students")
//       setStudents([])
//     }
//   }

//   async function loadSubmissions(taskId: string) {
//     if (!taskId) return
//     if (submissionsByTask[taskId]) return

//     try {
//       const res = await getTaskSubmissionsForTeacher(taskId)
//       const list = (res.data || []) as TaskSubmission[]

//       const map: Record<string, TaskSubmission> = {}
//       for (const s of list) map[s.studentId] = s

//       setSubmissionsByTask((prev) => ({ ...prev, [taskId]: map }))
//     } catch (e: any) {
//       toast.error(e.message || "Failed to load submissions")
//       setSubmissionsByTask((prev) => ({ ...prev, [taskId]: {} }))
//     }
//   }

//   function refreshSelectedTaskSubmissions() {
//     if (!selectedTaskId) return
//     setSubmissionsByTask((prev) => {
//       const copy = { ...prev }
//       delete copy[selectedTaskId]
//       return copy
//     })
//     loadSubmissions(selectedTaskId)
//   }

//   function closeTooltipImmediate() {
//     if (openTimerRef.current) window.clearTimeout(openTimerRef.current)
//     if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
//     openTimerRef.current = null
//     closeTimerRef.current = null

//     setHoverOpen(false)
//     setHoverRow(null)
//     hoverAnchorRef.current = null
//   }

//   function scheduleCloseTooltip() {
//     if (openTimerRef.current) {
//       window.clearTimeout(openTimerRef.current)
//       openTimerRef.current = null
//     }
//     if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)

//     closeTimerRef.current = window.setTimeout(() => {
//       setHoverOpen(false)
//       setHoverRow(null)
//       hoverAnchorRef.current = null
//     }, 120)
//   }

//   function openTooltip(row: UiStudentRow, rect: DOMRect) {
//     if (!selectedTask) return

//     const m = submissionsByTask[selectedTask.id] || {}
//     const submission = m[row.submissionKey] || null

//     if (!canOpenTooltip(submission)) return

//     hoverAnchorRef.current = rect

//     if (closeTimerRef.current) {
//       window.clearTimeout(closeTimerRef.current)
//       closeTimerRef.current = null
//     }

//     if (openTimerRef.current) window.clearTimeout(openTimerRef.current)
//     openTimerRef.current = window.setTimeout(() => {
//       setHoverRow((prev) => (prev?.id === row.id ? prev : row))
//       setHoverOpen(true)
//     }, 70)
//   }

//   function keepTooltipOpen() {
//     if (closeTimerRef.current) {
//       window.clearTimeout(closeTimerRef.current)
//       closeTimerRef.current = null
//     }
//   }

//   useEffect(() => {
//     teacherApi.auth.ensureTeacher()
//   }, [])

//   useEffect(() => {
//     if (!courseId) return
//     loadTasks(courseId)
//     loadStudents(courseId)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [courseId])

//   useEffect(() => {
//     if (!selectedTaskId) return
//     loadSubmissions(selectedTaskId)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedTaskId])

//   const rows: UiStudentRow[] = useMemo(() => {
//     if (!selectedTask) return []
//     const m = submissionsByTask[selectedTask.id] || {}
//     const knownIds = new Set(Object.keys(m))

//     return students.map((s) => {
//       const profileId = s.id || ""
//       const userId = s.userId || ""

//       const submissionKey = knownIds.has(profileId) ? profileId : knownIds.has(userId) ? userId : profileId || userId

//       const submission = submissionKey ? m[submissionKey] || null : null
//       const st = uiStatus(selectedTask, submission, nowMs)

//       return {
//         id: submissionKey || profileId || userId || "",
//         name: studentName(s),
//         enrollmentNumber: s.enrollmentNumber ?? null,
//         statusText: st.text,
//         statusTone: st.tone,
//         profileId,
//         userId,
//         submissionKey,
//       }
//     })
//   }, [students, selectedTask, submissionsByTask, nowMs])

//   const activeSubmission = useMemo(() => {
//     if (!selectedTask || !hoverRow) return null
//     const m = submissionsByTask[selectedTask.id] || {}
//     return m[hoverRow.submissionKey] || null
//   }, [hoverRow, selectedTask, submissionsByTask])

//   const tooltipTask: Task | null = useMemo(() => {
//     if (!selectedTask) return null
//     return {
//       id: selectedTask.id,
//       courseId: selectedTask.courseId,
//       teacherId: "",
//       title: selectedTask.title,
//       dueDate: selectedTask.dueDate,
//       maxMarks: selectedTask.maxMarks ?? 5,
//       createdAt: selectedTask.createdAt,
//       updatedAt: selectedTask.createdAt,
//     } as Task
//   }, [selectedTask])

//   return (
//     <div className="max-w-7xl mx-auto p-6 pb-20 space-y-6">
//       <div className="flex items-start justify-between gap-4 flex-wrap">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
//           <p className="text-sm text-slate-500 mt-1">Create course tasks and track submissions.</p>
//         </div>

//         <div className="flex items-center gap-3">
//           <CourseSelect value={courseId} onChange={setCourseId} />
//           <button
//             onClick={() => setCreateOpen(true)}
//             disabled={!courseId}
//             className="h-10 px-4 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold disabled:opacity-60"
//           >
//             Create Task
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <LoadingScreen label="Loading tasks..." />
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             {tasks.length === 0 ? (
//               <TaskEmptyState onCreate={() => setCreateOpen(true)} />
//             ) : (
//               <div className="space-y-3">
//                 {tasks.map((t) => (
//                   <TaskCard
//                     key={t.id}
//                     task={t}
//                     selected={t.id === selectedTaskId}
//                     onClick={() => {
//                       setSelectedTaskId(t.id)
//                       closeTooltipImmediate()
//                     }}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="space-y-4">
//             {!selectedTask ? (
//               <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
//                 Select a task to view students.
//               </div>
//             ) : (
//               <>
//                 <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//                   <p className="text-xs font-semibold text-slate-500">Selected task</p>
//                   <p className="text-lg font-bold text-slate-900 mt-1">{selectedTask.title}</p>
//                   <p className="text-xs text-slate-500 mt-2">
//                     Due:{" "}
//                     <span className="font-semibold text-slate-800">
//                       {new Date(selectedTask.dueDate).toLocaleString("en-IN")}
//                     </span>
//                   </p>
//                 </div>

//                 <StudentSubmissionList
//                   rows={rows}
//                   onHoverRow={(row, rect) => openTooltip(row, rect)}
//                   onLeaveList={() => scheduleCloseTooltip()}
//                 />
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {createOpen ? (
//         <CreateTaskModal
//           courseId={courseId}
//           onClose={() => setCreateOpen(false)}
//           onCreated={() => {
//             setCreateOpen(false)
//             if (courseId) loadTasks(courseId)
//           }}
//         />
//       ) : null}

//       <StudentSubmissionTooltip
//         open={hoverOpen}
//         anchorRect={hoverAnchorRef.current}
//         onRequestClose={() => scheduleCloseTooltip()}
//         onKeepOpen={() => keepTooltipOpen()}
//         row={hoverRow}
//         task={tooltipTask}
//         submission={activeSubmission}
//         onGraded={refreshSelectedTaskSubmissions}
//       />
//     </div>
//   )
// }




// client/src/app/(dashboard)/teacher-dashboard/components/task/TaskWorkspace.tsx
"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import { getToken, getUser } from "../../../../../../lib/auth"
import LoadingScreen from "../common/LoadingScreen"
import CourseSelect from "./CourseSelect"
import TaskEmptyState from "./TaskEmptyState"
import TaskCard, { UiTask } from "./TaskCard"
import StudentSubmissionList, { UiStudentRow } from "./StudentSubmissionList"
import CreateTaskModal from "./CreateTaskModal"
import StudentSubmissionTooltip from "./StudentSubmissionTooltip"

import { getCourseTasks, getTaskSubmissionsForTeacher, Task, TaskSubmission, TaskAPIError } from "../../../../../../lib/task"
import { teacherApi } from "../../../../../../lib/teacherApi"

type CourseStudent = {
  id: string
  userId?: string
  firstName?: string
  lastName?: string
  name?: string
  enrollmentNumber?: string | null
}

function studentName(s: CourseStudent) {
  if (s.name) return s.name
  const a = s.firstName || ""
  const b = s.lastName || ""
  const full = `${a} ${b}`.trim()
  return full || "Student"
}

/**
 * Fetch students enrolled in a course
 */
async function fetchCourseStudents(courseId: string): Promise<CourseStudent[]> {
  const token = getToken()
  const base = process.env.NEXT_PUBLIC_USER_SERVICE_URL || "http://localhost:3001"

  if (!token) {
    throw new Error("Authentication required")
  }

  console.log(`📤 [Task Workspace] Fetching students for course: ${courseId}`)

  const res = await fetch(`${base}/api/courses/${courseId}/students`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  })

  if (res.status === 401) {
    throw new TaskAPIError("Session expired", 401, "TOKEN_EXPIRED")
  }

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    console.error(`❌ [Task Workspace] Failed to fetch students:`, json)
    throw new Error(json?.message || "Failed to load students")
  }

  const json = await res.json()
  console.log(`✅ [Task Workspace] Loaded ${json?.data?.length || 0} students`)
  return (json?.data || []) as CourseStudent[]
}

/**
 * Calculate UI status for student submission
 */
function uiStatus(task: UiTask, submission: TaskSubmission | null, nowMs: number) {
  const deadlineMs = new Date(
    submission?.customDueDate || task.dueDate
  ).getTime()

  // 1️⃣ No submission yet
  if (!submission || submission.status === "PENDING") {
    if (nowMs > deadlineMs) {
      return { text: "Overdue", tone: "danger" as const }
    }
    return { text: "Pending", tone: "muted" as const }
  }

  // 2️⃣ Submitted AFTER deadline → always Overdue (even if graded)
  const submittedAtMs = submission.submittedAt
    ? new Date(submission.submittedAt).getTime()
    : null

  if (submittedAtMs && submittedAtMs > deadlineMs) {
    return { text: "Overdue", tone: "danger" as const }
  }

  // 3️⃣ Normal flow
  if (submission.status === "SUBMITTED") {
    return { text: "Submitted", tone: "ok" as const }
  }

  if (submission.status === "RESUBMITTING") {
    return { text: "Resubmitting", tone: "info" as const }
  }

  if (submission.status === "GRADED") {
    return {
      text: `Graded ${submission.marks ?? 0}/${task.maxMarks ?? 5}`,
      tone: "ok" as const,
    }
  }

  // fallback
  return { text: "Unknown", tone: "muted" as const }
}


/**
 * Check if tooltip should open for submission
 */
function canOpenTooltip(submission: TaskSubmission | null) {
  if (!submission) return false
  if (submission.status === "PENDING") return false
  if (submission.status === "GRADED") return false
  return submission.status === "SUBMITTED" || submission.status === "LATE" || submission.status === "RESUBMITTING"
}

export default function TaskWorkspace() {
  const [loading, setLoading] = useState(true)

  const [courseId, setCourseId] = useState("")
  const [tasks, setTasks] = useState<UiTask[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState("")

  const [students, setStudents] = useState<CourseStudent[]>([])
  const [createOpen, setCreateOpen] = useState(false)

  const [submissionsByTask, setSubmissionsByTask] = useState<Record<string, Record<string, TaskSubmission>>>({})

  // Update current time every minute
  const [nowMs, setNowMs] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 60 * 1000)
    return () => window.clearInterval(id)
  }, [])

  // Tooltip state
  const [hoverOpen, setHoverOpen] = useState(false)
  const [hoverRow, setHoverRow] = useState<UiStudentRow | null>(null)
  const hoverAnchorRef = useRef<DOMRect | null>(null)

  const openTimerRef = useRef<number | null>(null)
  const closeTimerRef = useRef<number | null>(null)

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) || null,
    [tasks, selectedTaskId]
  )

  /**
   * Load tasks for selected course
   */
  async function loadTasks(cid: string) {
    try {
      setLoading(true)

      // Reset state
      setSelectedTaskId("")
      setTasks([])
      setStudents([])
      setSubmissionsByTask({})
      closeTooltipImmediate()

      console.log(`📤 [Task Workspace] Loading tasks for course: ${cid}`)

      const res = await getCourseTasks(cid)
      const list = (res.data || []) as Task[]

      // 🔥 ADD THIS
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )

      const mapped: UiTask[] = list.map((t) => ({
        id: t.id,
        courseId: t.courseId,
        title: t.title,
        dueDate: t.dueDate,
        createdAt: t.createdAt,
        maxMarks: t.maxMarks,
      }))


      setTasks(mapped)
      if (mapped.length > 0) setSelectedTaskId(mapped[0].id)

      console.log(`✅ [Task Workspace] Loaded ${mapped.length} tasks`)
    } catch (e: any) {
      console.error("❌ [Task Workspace] Failed to load tasks:", e)
      
      if (e instanceof TaskAPIError && e.statusCode === 401) {
        toast.error("Session expired. Please login again.")
      } else {
        toast.error(e.message || "Failed to load tasks")
      }
      
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Load students enrolled in course
   */
  async function loadStudents(cid: string) {
    try {
      console.log(`📤 [Task Workspace] Loading students for course: ${cid}`)
      const list = await fetchCourseStudents(cid)
      setStudents(list)
      console.log(`✅ [Task Workspace] Loaded ${list.length} students`)
    } catch (e: any) {
      console.error("❌ [Task Workspace] Failed to load students:", e)
      
      if (e instanceof TaskAPIError && e.statusCode === 401) {
        toast.error("Session expired. Please login again.")
      } else {
        toast.error(e.message || "Failed to load students")
      }
      
      setStudents([])
    }
  }

  /**
   * Load submissions for a task
   */
  async function loadSubmissions(taskId: string) {
    if (!taskId) return
    if (submissionsByTask[taskId]) return

    try {
      console.log(`📤 [Task Workspace] Loading submissions for task: ${taskId}`)
      const res = await getTaskSubmissionsForTeacher(taskId)
      const list = (res.data || []) as TaskSubmission[]

      const map: Record<string, TaskSubmission> = {}
      for (const s of list) map[s.studentId] = s

      setSubmissionsByTask((prev) => ({ ...prev, [taskId]: map }))
      console.log(`✅ [Task Workspace] Loaded ${list.length} submissions`)
    } catch (e: any) {
      console.error("❌ [Task Workspace] Failed to load submissions:", e)
      
      if (e instanceof TaskAPIError && e.statusCode === 401) {
        toast.error("Session expired. Please login again.")
      } else {
        toast.error(e.message || "Failed to load submissions")
      }
      
      setSubmissionsByTask((prev) => ({ ...prev, [taskId]: {} }))
    }
  }

  /**
   * Refresh submissions for selected task
   */
  function refreshSelectedTaskSubmissions() {
    if (!selectedTaskId) return
    setSubmissionsByTask((prev) => {
      const copy = { ...prev }
      delete copy[selectedTaskId]
      return copy
    })
    loadSubmissions(selectedTaskId)
  }

  /**
   * Close tooltip immediately
   */
  function closeTooltipImmediate() {
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current)
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
    openTimerRef.current = null
    closeTimerRef.current = null

    setHoverOpen(false)
    setHoverRow(null)
    hoverAnchorRef.current = null
  }

  /**
   * Schedule tooltip close
   */
  function scheduleCloseTooltip() {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)

    closeTimerRef.current = window.setTimeout(() => {
      setHoverOpen(false)
      setHoverRow(null)
      hoverAnchorRef.current = null
    }, 120)
  }

  /**
   * Open tooltip for student row
   */
  function openTooltip(row: UiStudentRow, rect: DOMRect) {
    if (!selectedTask) return

    const m = submissionsByTask[selectedTask.id] || {}
    const submission = m[row.submissionKey] || null

    if (!canOpenTooltip(submission)) return

    hoverAnchorRef.current = rect

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    if (openTimerRef.current) window.clearTimeout(openTimerRef.current)
    openTimerRef.current = window.setTimeout(() => {
      setHoverRow((prev) => (prev?.id === row.id ? prev : row))
      setHoverOpen(true)
    }, 70)
  }

  /**
   * Keep tooltip open
   */
  function keepTooltipOpen() {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  // Ensure teacher authentication
  useEffect(() => {
    teacherApi.auth.ensureTeacher()
  }, [])

  // Load tasks and students when course changes
  useEffect(() => {
    if (!courseId) return
    loadTasks(courseId)
    loadStudents(courseId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  // Load submissions when task is selected
  useEffect(() => {
    if (!selectedTaskId) return
    loadSubmissions(selectedTaskId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTaskId])

  /**
   * Build student rows with submission data
   */
  const rows: UiStudentRow[] = useMemo(() => {
    if (!selectedTask) return []
    const m = submissionsByTask[selectedTask.id] || {}
    const knownIds = new Set(Object.keys(m))

    return students.map((s) => {
      const profileId = s.id || ""
      const userId = s.userId || ""

      const submissionKey = knownIds.has(profileId) ? profileId : knownIds.has(userId) ? userId : profileId || userId

      const submission = submissionKey ? m[submissionKey] || null : null
      const st = uiStatus(selectedTask, submission, nowMs)

      return {
        id: submissionKey || profileId || userId || "",
        name: studentName(s),
        enrollmentNumber: s.enrollmentNumber ?? null,
        statusText: st.text,
        statusTone: st.tone,
        profileId,
        userId,
        submissionKey,
      }
    })
  }, [students, selectedTask, submissionsByTask, nowMs])

  /**
   * Get active submission for tooltip
   */
  const activeSubmission = useMemo(() => {
    if (!selectedTask || !hoverRow) return null
    const m = submissionsByTask[selectedTask.id] || {}
    return m[hoverRow.submissionKey] || null
  }, [hoverRow, selectedTask, submissionsByTask])

  /**
   * Build task object for tooltip
   */
  const tooltipTask: Task | null = useMemo(() => {
    if (!selectedTask) return null
    return {
      id: selectedTask.id,
      courseId: selectedTask.courseId,
      teacherId: "",
      title: selectedTask.title,
      dueDate: selectedTask.dueDate,
      maxMarks: selectedTask.maxMarks ?? 5,
      createdAt: selectedTask.createdAt,
      updatedAt: selectedTask.createdAt,
    } as Task
  }, [selectedTask])

  return (
    <div className="max-w-7xl mx-auto p-6 pb-20 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">Create course tasks and track submissions.</p>
        </div>

        <div className="flex items-center gap-3">
          <CourseSelect value={courseId} onChange={setCourseId} />
          <button
            onClick={() => setCreateOpen(true)}
            disabled={!courseId}
            className="h-10 px-4 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Create Task
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingScreen label="Loading tasks..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks List */}
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <TaskEmptyState onCreate={() => setCreateOpen(true)} />
            ) : (
              <div className="space-y-3">
                {tasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    selected={t.id === selectedTaskId}
                    onClick={() => {
                      setSelectedTaskId(t.id)
                      closeTooltipImmediate()
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Students List */}
          <div className="space-y-4">
            {!selectedTask ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
                Select a task to view students.
              </div>
            ) : (
              <>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500">Selected task</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">{selectedTask.title}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Due:{" "}
                    <span className="font-semibold text-slate-800">
                      {new Date(selectedTask.dueDate).toLocaleString("en-IN")}
                    </span>
                  </p>
                </div>

                <StudentSubmissionList
                  rows={rows}
                  onHoverRow={(row, rect) => openTooltip(row, rect)}
                  onLeaveList={() => scheduleCloseTooltip()}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {createOpen && (
        <CreateTaskModal
          courseId={courseId}
          onClose={() => setCreateOpen(false)}
          onCreated={() => {
            setCreateOpen(false)
            if (courseId) loadTasks(courseId)
          }}
        />
      )}

      {/* Submission Tooltip */}
      <StudentSubmissionTooltip
        open={hoverOpen}
        anchorRect={hoverAnchorRef.current}
        onRequestClose={() => scheduleCloseTooltip()}
        onKeepOpen={() => keepTooltipOpen()}
        row={hoverRow}
        task={tooltipTask}
        submission={activeSubmission}
        onGraded={refreshSelectedTaskSubmissions}
      />
    </div>
  )
}
