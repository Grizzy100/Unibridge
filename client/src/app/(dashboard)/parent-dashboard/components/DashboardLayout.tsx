"use client"

import { useState } from 'react';
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Desktop expanded sidebar backdrop */}
      {isSidebarExpanded && (
        <div
          className="hidden md:block fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarExpanded(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isExpanded={isSidebarExpanded} />

      <div className="flex-1 flex flex-col md:pl-[80px] transition-all duration-300">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          toggleSidebarExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
          isSidebarExpanded={isSidebarExpanded}
        />
        <main className="p-4 sm:p-6 lg:p-8 pb-[max(1rem,env(safe-area-inset-bottom))] max-w-7xl mx-auto w-full flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
