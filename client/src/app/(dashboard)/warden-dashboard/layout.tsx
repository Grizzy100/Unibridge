//client/src/app/(dashboard)/warden-dashboard/layout.tsx
// client/src/app/(dashboard)/warden-dashboard/layout.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "./components/DashbaordLayout"
import { getUser } from "../../../../lib/auth"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const user = getUser()

    // 🚫 Block non-warden users immediately
    if (!user || user.role !== "WARDEN") {
      router.replace("/login/warden")
    }
  }, [router])

  return <DashboardLayout>{children}</DashboardLayout>
}

