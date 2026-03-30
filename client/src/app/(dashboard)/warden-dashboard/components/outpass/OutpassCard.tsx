"use client"

import { wardenOutpassAPI } from "../../../../../../lib/outpass"
import { showError, showSuccess } from "../../../../../../lib/toast"

export default function OutpassCard({ outpass, reload }: any) {
  const fromDate = new Date(outpass.outgoingDate).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  })

  const toDate = new Date(outpass.returningDate).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  })

  const showActions =
    outpass.parentApproval === "APPROVED" &&
    outpass.wardenApproval === "PENDING"

  async function act(type: "APPROVE" | "REJECT") {
    try {
      let comment: string | undefined

      if (type === "REJECT") {
        const input = prompt("Reason for rejection")
        if (!input || input.trim().length < 5) {
          showError("Please enter a valid rejection reason")
          return
        }
        comment = input.trim()
      }

      await wardenOutpassAPI.approveOrReject(outpass.id, type, comment)
      showSuccess(`Outpass ${type.toLowerCase()}ed`)
      reload()
    } catch (err: any) {
      showError(err.message || "Action failed")
    }
  }

  return (
    <div className="
      bg-white border border-slate-200 rounded-2xl
      p-4 sm:p-5
      transition hover:shadow-sm
    ">

      {/* MAIN GRID */}
      <div className="
        flex flex-col gap-4
        lg:grid lg:grid-cols-[1fr_auto] lg:gap-6
      ">

        {/* LEFT */}
        <div className="space-y-3">

          {/* HEADER */}
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm sm:text-[15px] font-semibold text-slate-900">
                {outpass.student?.name || "Unknown Student"}
              </div>
              <div className="text-xs text-slate-500">
                {outpass.student?.enrollmentNumber}
              </div>
            </div>

            <div className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wide">
              {outpass.type.replace("_", " ")}
            </div>
          </div>

          {/* DATES */}
          <div className="
  grid grid-cols-2 gap-2 sm:gap-3
">

  {/* FROM */}
  <div className="min-w-0">
    <span className="block text-[10px] sm:text-xs text-slate-400">
      From
    </span>
    <div className="
      font-medium text-slate-800
      text-[12px] sm:text-sm
      leading-tight truncate
    ">
      {fromDate}
    </div>
  </div>

  {/* TO */}
  <div className="min-w-0">
    <span className="block text-[10px] sm:text-xs text-slate-400">
      To
    </span>
    <div className="
      font-medium text-slate-800
      text-[12px] sm:text-sm
      leading-tight truncate
    ">
      {toDate}
    </div>
  </div>

</div>

          {/* ATTACHMENT */}
          {outpass.proofUrl && (
            <div className="
              flex items-center justify-between
              border border-slate-200 rounded-xl
              px-3 py-2.5
              bg-slate-50
            ">
              <div className="flex items-center gap-3">

                <div className="h-8 w-8 flex items-center justify-center rounded-md bg-slate-200 text-slate-700 text-sm">
                  📎
                </div>

                <div>
                  <div className="text-sm font-medium text-slate-800">
                    Proof attachment
                  </div>
                  <div className="text-xs text-slate-500">
                    {outpass.proofUrl.endsWith(".pdf") ? "PDF document" : "Image file"}
                  </div>
                </div>
              </div>

              <a
                href={outpass.proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-slate-900 hover:underline"
              >
                Open
              </a>
            </div>
          )}

          {/* REASON */}
          <div className="text-xs text-slate-500 italic">
            {outpass.reason}
          </div>

        </div>

        {/* RIGHT ACTIONS */}
        <div className="
          flex flex-row sm:flex-row gap-2
          lg:flex-col lg:justify-end
        ">

          {showActions ? (
            <>
              <button
                onClick={() => act("APPROVE")}
                className="
                  flex-1 lg:flex-none
                  px-4 py-2
                  text-sm font-medium
                  rounded-lg
                  bg-slate-900 text-white
                  hover:bg-slate-800 transition
                "
              >
                Approve
              </button>

              <button
                onClick={() => act("REJECT")}
                className="
                  flex-1 lg:flex-none
                  px-4 py-2
                  text-sm
                  rounded-lg
                  border border-slate-200
                  text-slate-700
                  hover:bg-slate-100 transition
                "
              >
                Reject
              </button>
            </>
          ) : (
            <div className="text-xs text-slate-500 italic self-center">
              {outpass.wardenApproval === "APPROVED"
                ? "Approved by warden"
                : "Rejected by warden"}
            </div>
          )}

        </div>

      </div>
    </div>
  )
}