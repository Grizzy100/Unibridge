//client\src\app\(dashboard)\teacher-dashboard\components\Sidebar.tsx
"use client"

import { usePathname, useRouter } from "next/navigation"
import { FiHome, FiCalendar, FiSettings } from "react-icons/fi"
import { MdOutlineTaskAlt } from "react-icons/md"
import { FiMail } from "react-icons/fi"
import { FaGraduationCap } from "react-icons/fa6"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const items = [
    { icon: FiHome, label: "Home", path: "/teacher-dashboard" },
    { icon: MdOutlineTaskAlt, label: "Task", path: "/teacher-dashboard/task" },
    { icon: FiCalendar, label: "Attendance", path: "/teacher-dashboard/attendance" },
    { icon: FiMail, label: "Mail", path: "/teacher-dashboard/mail" },
  ]

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <FaGraduationCap className="text-white text-sm" />
          </div>
          <span className="font-bold text-base text-slate-900">Unibridge</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((it) => {
          const Icon = it.icon
          const active = pathname === it.path
          return (
            <button
              key={it.path}
              onClick={() => router.push(it.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors
                ${active ? "bg-slate-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <Icon className="text-lg" />
              <span>{it.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
          <FiSettings className="text-lg" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}
