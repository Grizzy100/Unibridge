//client\src\app\(dashboard)\warden-dashboard\components\outpass\OutpassSearchBar.tsx
"use client"

import { useState } from "react"
import { wardenOutpassAPI } from "../../../../../../lib/outpass"

export default function OutpassSearchBar({ onSelect }: any) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])

  async function search(q: string) {
    setQuery(q)
    if (q.length < 2) return setResults([])

    try {
      const res = await wardenOutpassAPI.searchStudents(q)
      setResults(res.data || [])
    } catch {
      setResults([])
    }
  }

  return (
    <div className="relative w-full">

      <input
        value={query}
        onChange={(e) => search(e.target.value)}
        placeholder="Search students..."
        className="
          w-full
          border border-slate-200 rounded-xl
          px-4 py-2.5
          text-[13px] sm:text-sm
          text-slate-700 placeholder:text-slate-400
          bg-white
          focus:outline-none focus:ring-2 focus:ring-slate-900/10
        "
      />

      {results.length > 0 && (
        <div className="
          absolute w-full mt-1.5
          bg-white border border-slate-200
          rounded-xl shadow-lg
          z-20 max-h-60 overflow-auto
        ">
          {results.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                onSelect({
                  id: s.id,
                  name: `${s.firstName} ${s.lastName}`,
                  email: s.email,
                  enrollmentNumber: s.enrollmentNumber,
                })
                setQuery("")
                setResults([])
              }}
              className="
                w-full text-left px-4 py-2.5
                text-[13px] sm:text-sm text-slate-700
                hover:bg-slate-50 transition
              "
            >
              <div>{s.firstName} {s.lastName}</div>
              <div className="text-[11px] text-slate-500">
                {s.email}
                {s.enrollmentNumber && ` · ${s.enrollmentNumber}`}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}