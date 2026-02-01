//client\src\app\(dashboard)\teacher-dashboard\components\HomeTabNav.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function HomeTabNav() {
  const pathname = usePathname()

  const isPersonal =
    pathname === "/teacher-dashboard" ||
    pathname.startsWith("/teacher-dashboard/personal-space")

  const isMail = pathname.startsWith("/teacher-dashboard/mail")

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6">
        <div className="flex gap-6 border-b border-gray-200">
          <Link
            href="/teacher-dashboard/personal-space"
            className={`py-3 text-sm font-semibold border-b-2 transition-colors ${
              isPersonal ? "border-slate-900 text-slate-900" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Personal Space
          </Link>

          <Link
            href="/teacher-dashboard/mail"
            className={`py-3 text-sm font-semibold border-b-2 transition-colors ${
              isMail ? "border-slate-900 text-slate-900" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Mail
          </Link>
        </div>
      </div>
    </div>
  )
}
