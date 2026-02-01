//client\lib\teacherApi.ts
"use client"

import toast from "react-hot-toast"
import { getToken, getUser, logout } from "./auth"

const USER_SERVICE = process.env.NEXT_PUBLIC_USER_SERVICE_URL || "http://localhost:3001"
const ATT_SERVICE = process.env.NEXT_PUBLIC_ATTENDANCE_SERVICE_URL || "http://localhost:3004"

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE"

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

function redirectTeacherLogin() {
  logout()
  window.location.href = "http://localhost:3000/login/teacher"
}

async function request<T>(url: string, init?: { method?: HttpMethod; body?: any; timeoutMs?: number }) {
  const method = init?.method || "GET"
  const timeoutMs = init?.timeoutMs ?? 15000
  const token = getToken()

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: init?.body ? JSON.stringify(init.body) : undefined,
      signal: controller.signal,
    })

    const json = await res.json().catch(() => null)

    if (res.status === 401 || res.status === 403) {
      toast.error("Session expired. Login again.")
      redirectTeacherLogin()
      throw new ApiError("Unauthorized", res.status)
    }

    if (!res.ok) throw new ApiError(json?.message || json?.error || `Request failed (${res.status})`, res.status)

    return (json?.data ?? json) as T
  } catch (e: any) {
    if (e?.name === "AbortError") throw new ApiError("Request timeout", 408)
    if (e instanceof ApiError) throw e
    throw new ApiError(e?.message || "Network error", 0)
  } finally {
    clearTimeout(timer)
  }
}

export type TeacherCourse = {
  id: string
  courseCode: string
  courseName: string
  semester: number
  credits: number
}

export type SessionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED"

export type AttendanceSession = {
  id: string
  teacherId: string
  courseId: string
  sessionStartTime: string
  sessionEndTime: string
  qrCode: string
  qrExpiresAt: string
  status: SessionStatus
  createdAt: string
}

export type SessionStats = {
  sessionId: string
  total: number
  present: number
  absent: number
}

export const teacherApi = {
  auth: {
    ensureTeacher: () => {
      const u = getUser()
      const t = getToken()
      if (!u || !t || u.role !== "TEACHER") redirectTeacherLogin()
    },
  },

  courses: {
    my: async (): Promise<TeacherCourse[]> => {
      const u = getUser()
      if (!u?.id) return []
      // ✅ change ONLY if your user-service teacher courses route differs
      return request<TeacherCourse[]>(`${USER_SERVICE}/api/teachers/${u.id}/courses`)
    },
  },

  attendance: {
    mySessions: async (): Promise<AttendanceSession[]> => {
      return request<AttendanceSession[]>(`${ATT_SERVICE}/api/sessions/my`)
    },

    myActiveForCourse: async (courseId: string): Promise<AttendanceSession | null> => {
      return request<AttendanceSession | null>(`${ATT_SERVICE}/api/sessions/my-active-session?courseId=${courseId}`)
    },

    start: async (courseId: string): Promise<AttendanceSession> => {
      return request<AttendanceSession>(`${ATT_SERVICE}/api/sessions/start`, {
        method: "POST",
        body: { courseId },
      })
    },

    refreshQr: async (sessionId: string): Promise<AttendanceSession> => {
      return request<AttendanceSession>(`${ATT_SERVICE}/api/sessions/${sessionId}/qr/refresh`, {
        method: "PATCH",
      })
    },

    end: async (sessionId: string): Promise<AttendanceSession> => {
      return request<AttendanceSession>(`${ATT_SERVICE}/api/sessions/${sessionId}/expire`, {
        method: "PATCH",
      })
    },

    stats: async (sessionId: string): Promise<SessionStats> => {
      return request<SessionStats>(`${ATT_SERVICE}/api/sessions/${sessionId}/stats`)
    },
  },
}
