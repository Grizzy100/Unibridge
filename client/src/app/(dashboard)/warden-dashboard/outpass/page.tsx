// client/src/app/(dashboard)/warden-dashboard/outpass/page.tsx
"use client"

import { useState } from "react"
import OutpassSearchBar from "../components/outpass/OutpassSearchBar"
import StudentProfileCard from "../components/outpass/StudentProfileCard"
import OutpassList from "../components/outpass/OutpassList"
import OutpassFilter from "../components/outpass/OutpassFilter"

export default function OutpassPage() {
  const [student, setStudent] = useState<any>(null)
  const [filter, setFilter] = useState("ALL")

  return (
    <div className="space-y-3 sm:space-y-4">
      <OutpassSearchBar onSelect={setStudent} />

      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 min-w-0">
        <StudentProfileCard student={student} />

        <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
          <div className="flex justify-end">
            <OutpassFilter value={filter} onChange={setFilter} />
          </div>
          <OutpassList studentId={student?.id} filterType={filter} />
        </div>
      </div>
    </div>
  )
}

