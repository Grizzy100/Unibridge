//client\src\app\(dashboard)\warden-dashboard\components\outpass\OutpassSearchBar.tsx
"use client"

import { useState } from "react"
import { wardenOutpassAPI } from "../../../../../../lib/outpass";

export default function OutpassSearchBar({ onSelect }: any) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  async function search(q: string) {
    setQuery(q);
    if (q.length < 2) return setResults([]);

    // ✅ FIX: Use outpass service search, NOT /api/users/search
    try {
      const res = await wardenOutpassAPI.searchStudents(q);
      setResults(res.data || []);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    }
  }

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => search(e.target.value)}
        placeholder="Search student by name, email or enrollment"
        className="w-full border rounded-xl px-4 py-2 text-sm"
      />
      {results.length > 0 && (
        <div className="absolute w-full bg-white border rounded-xl shadow mt-1 z-10 max-h-60 overflow-auto">
          {results.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                onSelect({ 
                  id: s.id, 
                  name: `${s.firstName} ${s.lastName}`, 
                  email: s.email,
                  enrollmentNumber: s.enrollmentNumber 
                });
                setQuery("");
                setResults([]);
              }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              {s.firstName} {s.lastName} — {s.email}
              {s.enrollmentNumber && <span className="block text-xs text-gray-500">#{s.enrollmentNumber}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
