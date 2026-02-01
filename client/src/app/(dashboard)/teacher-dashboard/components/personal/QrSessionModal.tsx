"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import QRCode from "react-qr-code"
import { AttendanceSession, teacherApi, TeacherCourse } from "../../../../../../lib/teacherApi"

export default function QrSessionModal({
  course,
  onClose,
}: {
  course: TeacherCourse
  onClose: () => void
}) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<AttendanceSession | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const timerRef = useRef<any>(null)
  const refreshingRef = useRef(false)

  const qrValue = useMemo(() => session?.qrCode || "", [session?.qrCode])

  async function loadOrStart() {
    try {
      setLoading(true)

      const existing = await teacherApi.attendance.myActiveForCourse(course.id)
      if (existing && existing.status === "ACTIVE") {
        setSession(existing)
        toast.success("Active session loaded")
        return
      }

      const created = await teacherApi.attendance.start(course.id)
      setSession(created)
      toast.success("Attendance session started")
    } catch (e: any) {
      toast.error(e.message || "Failed to start session")
      onClose()
    } finally {
      setLoading(false)
    }
  }

  async function refreshNow() {
    if (!session?.id) return
    if (refreshingRef.current) return

    try {
      refreshingRef.current = true
      setRefreshing(true)
      const updated = await teacherApi.attendance.refreshQr(session.id)
      setSession(updated)
      toast.success("QR refreshed")
    } catch (e: any) {
      toast.error(e.message || "QR refresh failed")
    } finally {
      setRefreshing(false)
      refreshingRef.current = false
    }
  }

  async function endSession() {
    if (!session?.id) return
    try {
      await teacherApi.attendance.end(session.id)
      toast("Session ended")
      onClose()
    } catch (e: any) {
      toast.error(e.message || "Failed to end session")
    }
  }

  useEffect(() => {
    loadOrStart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id])

  useEffect(() => {
    if (!session?.id) return

    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      refreshNow()
    }, 30000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id])

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">Attendance QR</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {course.courseCode} • {course.courseName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-9 px-3 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="min-h-[320px] flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900 mx-auto" />
                <p className="mt-4 text-sm text-slate-600">Preparing session...</p>
              </div>
            </div>
          ) : !session ? (
            <div className="text-sm text-slate-600">No active session.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="rounded-2xl border border-slate-200 p-4 bg-white flex items-center justify-center">
                <div className="bg-white p-3 rounded-xl">
                  <QRCode value={qrValue} size={180} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-500">Session</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">{session.status}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    QR expires at:{" "}
                    <span className="font-semibold text-slate-800">
                      {new Date(session.qrExpiresAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={refreshNow}
                    disabled={refreshing}
                    className="flex-1 h-10 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold disabled:opacity-60"
                  >
                    {refreshing ? "Refreshing..." : "Refresh QR"}
                  </button>

                  <button
                    onClick={endSession}
                    className="flex-1 h-10 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold"
                  >
                    End Session
                  </button>
                </div>

                <p className="text-xs text-slate-500">
                  Auto refresh runs every 30 seconds while this modal is open.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
