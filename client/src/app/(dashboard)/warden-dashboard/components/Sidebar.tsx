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
import { clearAuth } from "../../../../../lib/auth";

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
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-200">
        <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <HiAcademicCap className="text-white text-base" />
        </div>
        <span className="font-semibold text-base text-gray-900">WardenHub</span>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
          Dashboard
        </div>

        {mainItems.map((it) => {
          const Icon = it.icon
          const active = pathname === it.path

          return (
            <button
              key={it.path}
              onClick={() => router.push(it.path)}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors
                  ${active ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600"}`}
              >
                <Icon className="text-base" />
              </span>
              {it.label}
            </button>
          )
        })}

        {/* Upcoming / Disabled */}
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 pt-5 pb-1">
          Management
        </div>

        {upcomingItems.map((it) => {
          const Icon = it.icon
          return (
            <div
              key={it.label}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 cursor-not-allowed"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                <Icon className="text-base" />
              </span>
              {it.label}
              <span className="ml-auto text-xs italic">soon</span>
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-gray-200 pb-8">
        <button
          onClick={() => {
            clearAuth();
            router.push("/login/warden");
          }}
          className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-500 group-hover:bg-red-100 transition-colors">
            <FiLogOut className="text-base" />
          </span>
          Logout
        </button>
      </div>
    </aside>
  )
}
