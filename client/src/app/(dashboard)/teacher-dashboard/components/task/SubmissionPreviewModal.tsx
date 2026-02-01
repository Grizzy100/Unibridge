// client/src/app/(dashboard)/teacher-dashboard/components/task/SubmissionPreviewModal.tsx
"use client"

import { useEffect, useMemo } from "react"

function inferType(url: string, mimeType?: string) {
  const u = (url || "").toLowerCase()
  const m = (mimeType || "").toLowerCase()

  const isImage =
    m.startsWith("image/") ||
    u.includes("/image/upload/") ||
    u.endsWith(".png") ||
    u.endsWith(".jpg") ||
    u.endsWith(".jpeg") ||
    u.endsWith(".webp") ||
    u.endsWith(".gif")

  const isPdf =
    m.includes("pdf") ||
    u.endsWith(".pdf") ||
    u.includes(".pdf") ||
    (u.includes("/raw/upload/") && u.includes("pdf"))

  const isVideo =
    m.startsWith("video/") ||
    u.includes("/video/upload/") ||
    u.endsWith(".mp4") ||
    u.endsWith(".webm")

  return { isImage, isPdf, isVideo }
}

export default function SubmissionPreviewModal({
  open,
  url,
  mimeType,
  title,
  subtitle,
  onClose,
}: {
  open: boolean
  url: string
  mimeType?: string
  title: string
  subtitle?: string
  onClose: () => void
}) {
  const safeUrl = url || ""

  const { isImage, isPdf, isVideo } = useMemo(() => inferType(safeUrl, mimeType), [safeUrl, mimeType])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (open) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="absolute inset-0 p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500">Submission preview</p>
              <p className="text-lg font-bold text-slate-900 truncate">{title}</p>
              {subtitle ? <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p> : null}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <a
                href={safeUrl}
                target="_blank"
                rel="noreferrer"
                className="h-6 px-2 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-50"
              >
                Open file
              </a>

              <button
                onClick={onClose}
                className="h-7 px-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 overflow-hidden min-h-[70vh]">
              {!safeUrl ? (
                <div className="h-[70vh] flex items-center justify-center text-slate-600 text-sm">
                  No file URL available.
                </div>
              ) : isImage ? (
                <div className="h-[70vh] flex items-center justify-center p-4">
                  <img
                    src={safeUrl}
                    alt="Submission"
                    className="max-h-full max-w-full rounded-2xl shadow-sm border border-slate-200 bg-white object-contain"
                  />
                </div>
              ) : isVideo ? (
                <div className="h-[70vh] flex items-center justify-center p-4">
                  <video controls className="max-h-full max-w-full rounded-2xl border border-slate-200 bg-black">
                    <source src={safeUrl} />
                  </video>
                </div>
              ) : isPdf ? (
                <div className="h-[70vh]">
                  <iframe src={safeUrl} className="w-full h-full" title="PDF Preview" />
                </div>
              ) : (
                <div className="h-[70vh] flex flex-col items-center justify-center text-center p-8">
                  <p className="text-base font-bold text-slate-900">Preview not supported here</p>
                  <p className="text-sm text-slate-600 mt-2">
                    This file type can’t be previewed in the browser. Use “Open file”.
                  </p>

                  <a
                    href={safeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 h-10 px-4 rounded-2xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
                  >
                    Open file
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
