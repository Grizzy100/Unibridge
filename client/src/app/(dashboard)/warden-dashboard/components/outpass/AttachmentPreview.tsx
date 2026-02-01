// client/src/app/(dashboard)/warden-dashboard/components/outpass/AttachmentPreview.tsx
import { FiFileText, FiExternalLink } from "react-icons/fi"

export default function AttachmentPreview({
  url,
  mimeType,
}: {
  url: string
  mimeType?: string
}) {
  return (
    <div className="flex items-center justify-between rounded-md border bg-slate-50 px-3 py-2 text-sm">
      <div className="flex items-center gap-2 text-slate-700">
        <FiFileText className="text-slate-400" />
        <span className="font-medium">Proof document</span>
        <span className="text-xs text-slate-500">
          {mimeType === "application/pdf" ? "PDF" : "Image"}
        </span>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
      >
        Open
        <FiExternalLink />
      </a>
    </div>
  )
}

