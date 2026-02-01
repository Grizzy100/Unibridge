"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { teacherApi, AttendanceSession } from "../../../../../lib/teacherApi"
import LoadingScreen from "../components/common/LoadingScreen"

export default function TeacherAttendancePage() {
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<AttendanceSession[]>([])
  const [stats, setStats] = useState<Record<string, any>>({})

  async function load() {
    try {
      setLoading(true)
      const list = await teacherApi.attendance.mySessions()
      setSessions(list)
    } catch (e: any) {
      toast.error(e.message || "Failed to load sessions")
    } finally {
      setLoading(false)
    }
  }

  async function loadStats(sessionId: string) {
    try {
      const s = await teacherApi.attendance.stats(sessionId)
      setStats((prev) => ({ ...prev, [sessionId]: s }))
    } catch (e: any) {
      toast.error(e.message || "Failed to load stats")
    }
  }

  async function end(sessionId: string) {
    try {
      await teacherApi.attendance.end(sessionId)
      toast("Session ended")
      await load()
    } catch (e: any) {
      toast.error(e.message || "Failed to end session")
    }
  }

  useEffect(() => {
    teacherApi.auth.ensureTeacher()
    load()
  }, [])

  if (loading) return <LoadingScreen label="Loading sessions..." />

  return (
    <div className="max-w-7xl mx-auto p-6 pb-20 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
        <p className="text-sm text-slate-500 mt-1">Your attendance sessions history and stats.</p>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-sm text-slate-600">
          No sessions yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {sessions.map((s) => {
            const stat = stats[s.id]
            return (
              <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">{s.courseId}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(s.createdAt).toLocaleString("en-IN")}
                    </p>
                    <span
                      className={`inline-flex mt-3 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        s.status === "ACTIVE"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => loadStats(s.id)}
                      className="h-9 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold"
                    >
                      Stats
                    </button>

                    {s.status === "ACTIVE" ? (
                      <button
                        onClick={() => end(s.id)}
                        className="h-9 px-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold"
                      >
                        End
                      </button>
                    ) : null}
                  </div>
                </div>

                {stat ? (
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <Stat label="Total" value={stat.total} />
                    <Stat label="Present" value={stat.present} />
                    <Stat label="Absent" value={stat.absent} />
                  </div>
                ) : (
                  <div className="mt-5 text-xs text-slate-500">Click “Stats” to load summary.</div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <p className="text-[11px] font-semibold text-slate-500">{label}</p>
      <p className="text-sm font-bold text-slate-900 mt-1">{value ?? "-"}</p>
    </div>
  )
}
