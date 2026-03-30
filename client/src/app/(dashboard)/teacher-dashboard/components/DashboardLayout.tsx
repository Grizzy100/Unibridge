//client\src\app\(dashboard)\teacher-dashboard\components\DashboardLayout.tsx
"use client"

import { ReactNode, useState } from "react"
import { Toaster } from "react-hot-toast"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0f172a",
            color: "#fff",
            padding: "14px 16px",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "600",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          },
          success: { style: { background: "#16a34a" } },
          error: { style: { background: "#ef4444" } },
        }}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

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
        <main className="p-4 sm:p-6 lg:p-8 pb-[max(1rem,env(safe-area-inset-bottom))] max-w-7xl mx-auto w-full flex-1">{children}</main>
      </div>
    </div>
  )
}

