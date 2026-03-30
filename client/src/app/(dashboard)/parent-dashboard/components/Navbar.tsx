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
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex-1 flex max-w-xl gap-2 sm:gap-4 items-center">        
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100/50 hover:text-slate-900 rounded-lg transition-colors"
          aria-label="Open Sidebar"
        >
          <FiMenu className="text-xl" />
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

        <div className="relative group flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search records, attendance..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all hover:bg-gray-50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-6">
        <NotificationBell />
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium text-gray-900 leading-none">Parent</span>
            <span className="text-xs text-gray-500 mt-1">Priya</span>
          </div>
          <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
            <FiUser className="text-white text-sm" />
          </div>
        </div>
      </div>
    </header>
  );
}
