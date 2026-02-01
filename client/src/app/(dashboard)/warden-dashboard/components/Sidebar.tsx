"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  FiHome,
  FiMail,
  FiLogOut,
  FiAlertCircle,
  FiMapPin,
} from "react-icons/fi"
import { HiAcademicCap } from "react-icons/hi2";
import { MdOutlineTaskAlt } from "react-icons/md"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const mainItems = [
    { label: "Home", path: "/warden-dashboard", icon: FiHome },
    { label: "Outpass", path: "/warden-dashboard/outpass", icon: MdOutlineTaskAlt },
    { label: "Mail", path: "/warden-dashboard/mail", icon: FiMail },
  ]

  const upcomingItems = [
    { label: "Hostel Assign", icon: FiMapPin },
    { label: "Complaints", icon: FiAlertCircle },
  ]

  return (
    <aside className="w-60 bg-white border-r flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-6 font-bold text-lg tracking-tight">
        <HiAcademicCap className="text-slate-900 text-2xl" />
        <span>UniBridge</span>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 space-y-1">
        <div className="px-3 pt-2 pb-1 text-xs font-semibold text-slate-400 uppercase">
          Dashboard
        </div>

        {mainItems.map((it) => {
          const Icon = it.icon
          const active = pathname === it.path

          return (
            <button
              key={it.path}
              onClick={() => router.push(it.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
            >
              <Icon className="text-base" />
              {it.label}
            </button>
          )
        })}

        {/* Upcoming / Disabled */}
        <div className="px-3 pt-5 pb-1 text-xs font-semibold text-slate-400 uppercase">
          Management
        </div>

        {upcomingItems.map((it) => {
          const Icon = it.icon
          return (
            <div
              key={it.label}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 cursor-not-allowed"
            >
              <Icon className="text-base" />
              {it.label}
              <span className="ml-auto text-xs italic">soon</span>
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t">
        <button
          onClick={() => router.push("/login")}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-100"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </aside>
  )
}
