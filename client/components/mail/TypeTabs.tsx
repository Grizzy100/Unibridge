// client/components/mail/TypeTabs.tsx
"use client"

import { FiChevronDown } from "react-icons/fi"
import type { MessageType } from "./types"
import { MESSAGE_TYPE_LABEL } from "./types"


interface TypeTabsProps {
  type: MessageType
  setType: (t: MessageType) => void
} 


const PRIMARY_TYPES: MessageType[] = [
  "GENERAL",
  "NOTICE",
  "ASSIGNMENT",
  "ATTENDANCE",
  "OUTPASS",
  "ANNOUNCEMENT",
]

const MORE_TYPES: MessageType[] = [
  "DISCIPLINE",
  "FEE",
  "HOSTEL",
  "MESS",
  "SPORTS",
  "PLACEMENT",
  "INTERNSHIP",
  "EVENT",
  "WORKSHOP",
  "SEMINAR",
  "MAINTENANCE",
]

export default function TypeTabs({
  type,
  setType,
}: {
  type: MessageType
  setType: (t: MessageType) => void
}) {
  // If current type is not in primary types, show it in dropdown
  const dropdownValue = PRIMARY_TYPES.includes(type) ? "" : type

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Primary type buttons */}
      <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white p-1">
        {PRIMARY_TYPES.map((t) => {
          const active = t === type
          return (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`h-7 px-2.5 rounded-md text-[11px] font-semibold transition ${
                active
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {MESSAGE_TYPE_LABEL[t]}
            </button>
          )
        })}
      </div>

      {/* More types dropdown */}
      <div className="relative">
        <select
          value={dropdownValue}
          onChange={(e) => {
            const value = e.target.value
            if (value) {
              setType(value as MessageType)
            }
          }}
          className="h-9 pl-3 pr-8 rounded-md text-[11px] font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          <option value="">More</option>
          {MORE_TYPES.map((t) => (
            <option key={t} value={t}>
              {MESSAGE_TYPE_LABEL[t]}
            </option>
          ))}
        </select>
        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
      </div>
    </div>
  )
}
