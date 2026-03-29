//client\src\app\(dashboard)\teacher-dashboard\components\Sidebar.tsx
"use client"

import { usePathname, useRouter } from "next/navigation"
import { FiHome, FiCalendar, FiSettings, FiLogOut } from "react-icons/fi"
import { MdOutlineTaskAlt } from "react-icons/md"
import { FiMail } from "react-icons/fi"
import { FaGraduationCap } from "react-icons/fa6"
import { clearAuth } from "../../../../../lib/auth"

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
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <FaGraduationCap className="text-white text-sm" />
          </div>
          <span className="font-semibold text-base text-gray-900">TeacherHub</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
          Main
        </div>
        {items.map((it) => {
          const Icon = it.icon
          const active = pathname === it.path
          return (
            <button
              key={it.path}
              onClick={() => router.push(it.path)}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors
                  ${active ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600"}`}
              >
                <Icon className="text-base" />
              </span>
              <span>{it.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200 pb-8 flex flex-col gap-1">
        <button className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <FiSettings className="text-base" />
          </span>
          <span>Settings</span>
        </button>

        <button 
          onClick={() => {
            clearAuth();
            router.push('/login/teacher');
          }}
          className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-500 group-hover:bg-red-100 transition-colors">
            <FiLogOut className="text-base" />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
