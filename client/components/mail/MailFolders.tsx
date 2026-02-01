// client/components/mail/MailFolders.tsx
"use client"

import {
  FiInbox,
  FiSend,
  FiFileText,
  FiTrash2,
  FiArchive,
  FiPlus,
} from "react-icons/fi"
import type { MailFolderKey } from "./types"


interface MailFoldersProps {
  folder: MailFolderKey
  setFolder: (k: MailFolderKey) => void
  counts: Record<MailFolderKey, number>
  onCompose: () => void
}


const items: { key: MailFolderKey; label: string; icon: any }[] = [
  { key: "inbox", label: "Inbox", icon: FiInbox },
  { key: "sent", label: "Sent", icon: FiSend },
  { key: "drafts", label: "Drafts", icon: FiFileText },
  { key: "archived", label: "Archive", icon: FiArchive },
  { key: "trash", label: "Trash", icon: FiTrash2 },
]

export default function MailFolders({
  folder,
  setFolder,
  counts,
  onCompose,
}: {
  folder: MailFolderKey
  setFolder: (k: MailFolderKey) => void
  counts: Record<MailFolderKey, number>
  onCompose: () => void
}) {
  return (
    <aside className="bg-white border-r border-slate-200 flex flex-col">
      {/* Compose button */}
      <div className="p-3">
        <button
          onClick={onCompose}
          className="w-full h-9 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2"
        >
          <FiPlus />
          Compose
        </button>
      </div>

      {/* Folders label */}
      <div className="px-3 pb-2">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Folders
        </p>
      </div>

      {/* Folder list */}
      <nav className="px-2 pb-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const active = folder === item.key

          return (
            <button
              key={item.key}
              onClick={() => setFolder(item.key)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm transition ${
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon className="text-base opacity-90 flex-shrink-0" />
                <span className="font-medium truncate">{item.label}</span>
              </span>

              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  active
                    ? "bg-white/15 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {counts[item.key] ?? 0}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Footer tip */}
      <div className="mt-auto p-3 border-t border-slate-200">
        <p className="text-[11px] text-slate-500">
          Tip: Archive keeps mail but removes it from inbox.
        </p>
      </div>
    </aside>
  )
}
