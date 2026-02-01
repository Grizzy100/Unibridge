//client\src\app\(dashboard)\warden-dashboard\components\DashbaordLayout.tsx
// components/DashboardLayout.tsx
"use client"

import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        {/* 👇 Full-height scrollable content */}
        <main className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
          {children}
        </main>
      </div>
    </div>
  )
}

