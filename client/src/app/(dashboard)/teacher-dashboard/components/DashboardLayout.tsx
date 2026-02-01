//client\src\app\(dashboard)\teacher-dashboard\components\DashboardLayout.tsx
"use client"

import { ReactNode } from "react"
import { Toaster } from "react-hot-toast"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
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

      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
