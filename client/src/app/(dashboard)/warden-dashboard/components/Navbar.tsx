"use client";

import { FiSearch, FiUser, FiMenu } from "react-icons/fi";
import { BiMenuAltLeft, BiMenuAltRight } from "react-icons/bi";
import NotificationBell from "../../../../../components/NotificationBell";

interface NavbarProps {
  onMenuClick?: () => void;
  toggleSidebarExpand?: () => void;
  isSidebarExpanded?: boolean;
}

export default function Navbar({ onMenuClick, toggleSidebarExpand, isSidebarExpanded = true }: NavbarProps) {
  return (
    <header className="h-14 sm:h-16 bg-white/85 backdrop-blur-xl border-b border-gray-200/60 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-20">
      <div className="flex flex-1 items-center gap-2 sm:gap-4 min-w-0">
        {/* Mobile Hamburger Menu */}
        <button
          onClick={onMenuClick}
            className="md:hidden p-2 -ml-1 text-gray-500 hover:bg-gray-100/50 hover:text-slate-900 rounded-lg transition-colors"
          aria-label="Open sidebar"
        >
            <FiMenu className="text-lg" />
        </button>

        {/* Desktop Expand/Collapse toggle */}
        {toggleSidebarExpand && (
          <button
            onClick={toggleSidebarExpand}
            className="hidden md:flex p-2 -ml-2 text-gray-500 hover:bg-gray-100/50 hover:text-slate-900 rounded-lg transition-colors"
            aria-label="Toggle Sidebar"
          >
            {isSidebarExpanded ? <BiMenuAltLeft className="text-2xl" /> : <BiMenuAltRight className="text-2xl" />}
          </button>
        )}

        <div className="flex-1 max-w-md min-w-0">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:py-2.5 focus-within:ring-2 focus-within:ring-slate-900/10 transition-colors">
            <FiSearch className="text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search students, outpasses..."
              className="w-full bg-transparent text-[13px] sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3 sm:gap-4 shrink-0 pl-2">
        <NotificationBell />
        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shadow-sm">
          <FiUser className="text-white text-sm" />
        </div>
      </div>
    </header>
  );
}
