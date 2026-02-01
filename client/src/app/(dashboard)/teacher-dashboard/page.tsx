//client\src\app\(dashboard)\teacher-dashboard\page.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import HomeTabNav from "./components/HomeTabNav"
import { getToken, getUser } from "../../../../lib/auth"
import PersonalSpace from "./personal-space/page"

export default function TeacherDashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const auth = useMemo(() => {
    if (!mounted) return { ok: false, loading: true }
    const u = getUser()
    const t = getToken()
    const ok = !!u && !!t && u.role === "TEACHER"
    return { ok, loading: false }
  }, [mounted])

  useEffect(() => {
    if (!auth.loading && !auth.ok) router.replace("/login/teacher")
  }, [auth.loading, auth.ok, router])

  if (!mounted || auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
      </div>
    )
  }

  if (!auth.ok) return null

  return (
    <div className="max-w-7xl mx-auto p-6 pb-20 space-y-6">
      <HomeTabNav />
      <PersonalSpace />
    </div>
  )
}
