// client/src/app/(dashboard)/warden-dashboard/page.tsx
"use client"

import OutpassList from "./components/outpass/OutpassList"

export default function WardenHome() {
  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Pending Outpass Requests
        </h1>
        <p className="text-sm text-gray-500">
          Review and take action on student outpass requests
        </p>
      </div>

      {/* Queue Container */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden">
        <OutpassList mode="PENDING_ONLY" />
      </div>
    </div>
  )
}

