//client\src\app\(dashboard)\warden-dashboard\components\outpass\OutpassList.tsx
"use client"

import { useEffect, useState } from "react"
import { BsArchive } from "react-icons/bs"

import { wardenOutpassAPI } from "../../../../../../lib/outpass"
import OutpassCard from "./OutpassCard"
import LoadingScreen from "../common/LoadingScreen"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../../../../components/ui/pagination"

const PAGE_SIZE = 5

export default function OutpassList({
  studentId,
  filterType,
  mode,
}: {
  studentId?: string
  filterType?: string
  mode?: "PENDING_ONLY"
}) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [page, setPage] = useState(1)

  // Replace the load() function in OutpassList.tsx
async function load() {
  try {
    setLoading(true);

    let list: any[] = [];
    
    // ✅ FIX: Use correct logic based on mode
    if (mode === "PENDING_ONLY") {
      // Queue: Only PARENT_APPROVED (waiting for warden)
      const res = await wardenOutpassAPI.getAll();
      list = res?.data ?? [];
      list = list.filter((o) => o.status === "PARENT_APPROVED"); // ✅ Correct status
    } else if (studentId) {
      // Museum: Specific student history
      const res = await wardenOutpassAPI.getStudentHistory(studentId, { 
        status: filterType === "APPROVED" ? "APPROVED" : undefined 
      });
      list = res?.data ?? [];
    } else {
      // Default: All pending for warden
      const res = await wardenOutpassAPI.getAll();
      list = res?.data ?? [];
    }

    setData(list);
    setPage(1);
  } catch (err) {
    console.error("[OutpassList] Failed to load outpasses", err);
    setData([]);
  } finally {
    setLoading(false);
  }
}


  useEffect(() => {
    load()
  }, [studentId, filterType])

  // Pagination logic
  const totalPages = Math.ceil(data.length / PAGE_SIZE)
  const paginated = data.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  /* ---------------- STATES ---------------- */

  if (loading) {
    return <LoadingScreen label="Loading outpass requests..." />
  }

  if (data.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-500">
        <BsArchive size={72} className="text-gray-400" />

        <h3 className="text-sm font-semibold text-gray-700">
          No outpass requests
        </h3>

        <p className="text-sm text-gray-500">
          There are currently no pending outpass requests.
        </p>
      </div>
    )
  }

  /* ---------------- QUEUE ---------------- */

  return (
    <div className="flex flex-col h-full">
      {/* Queue list */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {paginated.map((o) => (
          <OutpassCard key={o.id} outpass={o} reload={load} />
        ))}
      </div>

      {/* Pagination footer */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 bg-gray-50 py-3">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() =>
                    setPage((p) => Math.max(1, p - 1))
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={page === i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
