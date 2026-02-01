"use client"

import AttachmentPreview from "./AttachmentPreview"
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
  <div className="rounded-xl border bg-white px-6 py-4">
    <div className="grid grid-cols-[1fr_auto] gap-6">

      {/* ───────── LEFT CONTENT ───────── */}
      <div className="space-y-3">

        {/* Header */}
        <div className="flex justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {outpass.student?.name || "Unknown Student"}
            </div>
            <div className="text-xs text-slate-500">
              {outpass.student?.enrollmentNumber}
            </div>
          </div>

          <div className="text-xs font-medium text-slate-400 uppercase">
            {outpass.type.replace("_", " ")}
          </div>
        </div>

        {/* ───────── DATES ───────── */}
<div className="grid grid-cols-2 gap-6 text-sm">
  <div>
    <div className="text-xs text-slate-500">From</div>
    <div className="font-medium text-slate-800">{fromDate}</div>
  </div>

  <div>
    <div className="text-xs text-slate-500">To</div>
    <div className="font-medium text-slate-800">{toDate}</div>
  </div>
</div>

{/* ───────── ATTACHMENT ───────── */}
{outpass.proofUrl && (
  <div className="flex items-center justify-between rounded-lg border bg-slate-50 px-4 py-3">
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-200 text-slate-700">
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


        {/* Reason */}
        <div className="text-xs text-slate-500 italic">
          {outpass.reason}
        </div>
      </div>

      {/* ───────── RIGHT ACTIONS ───────── */}
      {showActions && (
        <div className="flex flex-col justify-center gap-2">
          <button
            onClick={() => act("APPROVE")}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Approve
          </button>

          <button
            onClick={() => act("REJECT")}
            className="rounded-md border px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Reject
          </button>
        </div>
      )}

      {!showActions && (
        <div className="text-xs text-slate-500 italic self-center">
          {outpass.wardenApproval === "APPROVED"
            ? "Approved by warden"
            : "Rejected by warden"}
        </div>
      )}
    </div>
  </div>
)

}
