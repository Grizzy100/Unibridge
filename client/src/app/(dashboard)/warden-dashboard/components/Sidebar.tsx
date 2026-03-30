"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  FiLogOut,
  FiAlertCircle,
  FiMapPin,
  FiX,
  FiSettings,
} from "react-icons/fi"
import { HiAcademicCap } from "react-icons/hi2";
import { TbSmartHome } from "react-icons/tb";
import { RiPassValidLine } from "react-icons/ri";
import { SiProtonmail } from "react-icons/si";
import { clearAuth } from "../../../../../lib/auth";
import { cn } from "../../../../../lib/utils";
import { Button } from "../../../../../components/ui/button";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isExpanded?: boolean;
}

export default function Sidebar({ isOpen = false, onClose, isExpanded = true }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const mainItems = [
    { label: "Home", path: "/warden-dashboard", icon: TbSmartHome },
    { label: "Outpass", path: "/warden-dashboard/outpass", icon: RiPassValidLine },
    { label: "Mail", path: "/warden-dashboard/mail", icon: SiProtonmail },
  ]

  const upcomingItems = [
    { label: "Hostel Assign", icon: FiMapPin },
    { label: "Complaints", icon: FiAlertCircle },
  ]

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transition-all duration-300 ease-in-out md:translate-x-0 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden",
        isOpen ? "translate-x-0" : "-translate-x-full",
        isExpanded ? "md:w-64" : "md:w-[80px]"
      )}
      aria-expanded={isOpen}
    >
      <div className={cn("h-14 sm:h-16 flex items-center px-3 sm:px-6 border-b border-gray-200 pt-[max(0px,env(safe-area-inset-top))] transition-all duration-300", isExpanded ? "justify-between" : "justify-between md:justify-center")}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 shrink-0 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm">
            <HiAcademicCap className="text-white text-[15px]" />
          </div>
          <span className={cn("font-semibold text-base text-slate-900 whitespace-nowrap tracking-tight", !isExpanded && "md:hidden")}>
            WardenHub
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden p-3 -mr-2"
          onClick={onClose}
          aria-label="Close Sidebar"
        >
          <FiX className="w-5 h-5" />
        </Button>
      </div>

      <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1.5 sm:space-y-2 overflow-y-auto w-full">
        <div className={cn("text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2.5 whitespace-nowrap", !isExpanded && "md:hidden")}>
          Dashboard
        </div>

        {mainItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="group w-full"
            >
              <div
                className={cn(
                  "flex items-center gap-2.5 py-2 rounded-lg text-[13px] sm:text-[14px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  isExpanded ? "px-3 justify-start" : "px-3 md:px-0 justify-start md:justify-center"
                )}
                title={!isExpanded ? item.label : undefined}
              >
                <div
                  className={cn(
                    "relative flex h-5 w-5 shrink-0 items-center justify-center transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                  )}
                >
                  <Icon className="text-lg transition-colors duration-200" />
                </div>
                <span className={cn("flex-1 text-left whitespace-nowrap tracking-wide", !isExpanded && "md:hidden")}>
                  {item.label}
                </span>
              </div>
            </button>
          )
        })}

        <div className={cn("text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 pt-4 pb-1 whitespace-nowrap", !isExpanded && "md:hidden")}>
          Management
        </div>

        {upcomingItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className="flex items-center gap-2.5 py-2 rounded-lg text-[13px] sm:text-[14px] font-medium text-slate-400 cursor-not-allowed group"
              title={!isExpanded ? item.label : undefined}
            >
              <div className="relative flex h-5 w-5 shrink-0 items-center justify-center transition-colors text-slate-300">
                <Icon className="text-lg" />
              </div>
              <span className={cn("flex-1 text-left whitespace-nowrap tracking-wide", !isExpanded && "md:hidden")}>
                {item.label}
              </span>
              <span className={cn("ml-auto text-[11px] italic", !isExpanded && "md:hidden")}>soon</span>
            </div>
          )
        })}
      </nav>

      <div className="px-4 py-4 mt-auto border-t border-slate-200 pb-[max(2rem,env(safe-area-inset-bottom))] flex flex-col gap-1">
        <button
          title={!isExpanded ? "Settings" : undefined}
          className={cn(
            "group w-full flex items-center gap-3 py-2.5 rounded-lg text-[14px] font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent transition-all",
            isExpanded ? "px-3 justify-start" : "px-3 md:px-0 justify-start md:justify-center"
          )}
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center transition-colors text-slate-400 group-hover:text-slate-700">
            <FiSettings className="text-lg" />
          </span>
          <span className={cn("whitespace-nowrap tracking-wide", !isExpanded && "md:hidden")}>Settings</span>
        </button>

        <button
          title={!isExpanded ? "Logout" : undefined}
          onClick={() => {
            clearAuth();
            router.push("/login/warden");
          }}
          className={cn(
            "group w-full flex items-center gap-3 py-2.5 rounded-lg text-[14px] font-medium text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent transition-all duration-200",
            isExpanded ? "px-3 justify-start" : "px-3 md:px-0 justify-start md:justify-center"
          )}
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center transition-colors text-red-400 group-hover:text-red-600">
            <FiLogOut className="text-lg" />
          </span>
          <span className={cn("whitespace-nowrap tracking-wide", !isExpanded && "md:hidden")}>Logout</span>
        </button>
      </div>
    </aside>
  )
}
