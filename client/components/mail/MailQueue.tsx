// //client\components\mail\MailQueue.tsx
"use client"

import { FiSearch, FiStar } from "react-icons/fi"
import type { MailFolderKey, MessageType, Mail } from "./types"
import { formatDateCompact, initials } from "./utils"
import TypeTabs from "./TypeTabs"

interface MailQueueProps {
  folder: MailFolderKey
  mails: Mail[]
  query: string
  setQuery: (v: string) => void
  activeId: string | null
  onSelect: (id: string) => void
  type: MessageType
  setType: (t: MessageType) => void
  onToggleStar: (id: string) => void
  loading?: boolean
}

export default function MailQueue({
  folder,
  mails,
  query,
  setQuery,
  activeId,
  onSelect,
  type,
  setType,
  onToggleStar,
  loading,
}: MailQueueProps) {
  return (
    <section className="bg-white border-r border-slate-200 min-w-0 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-200">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 capitalize">
              {folder}
            </h2>
            <p className="text-xs text-slate-500">{mails.length} messages</p>
          </div>
        </div>

        <div className="mt-3">
          <TypeTabs type={type} setType={setType} />
        </div>

        <div className="mt-3 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mails..."
            className="w-full pl-9 pr-3 h-10 border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
          />
        </div>
      </div>

      {/* Mail list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-100 p-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-200 animate-pulse" />
                  <div className="min-w-0 flex-1">
                    <div className="h-3 w-32 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-48 bg-slate-200 rounded mt-2 animate-pulse" />
                    <div className="h-3 w-64 bg-slate-200 rounded mt-2 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : mails.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-slate-500">No mails found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your filters or search
            </p>
          </div>
        ) : (
          mails.map((mail) => {
            const active = mail.id === activeId
            const isSentFolder = folder === "sent"

            // ✅ Correct, type-safe display logic
            const primaryText = isSentFolder
              ? mail.subject
              : mail.fromName

            const secondaryText = isSentFolder
              ? "To: Recipients"
              : mail.subject

            return (
              <div
                key={mail.id}
                className={`relative w-full px-4 py-3 border-b border-slate-100 transition ${
                  active ? "bg-slate-50" : "hover:bg-slate-50"
                }`}
              >
                <button
                  onClick={() => onSelect(mail.id)}
                  className="w-full text-left"
                >
                  <div className="flex gap-3">
                    {/* Unread dot */}
                    <div className="pt-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          mail.unread ? "bg-blue-500" : "bg-transparent"
                        }`}
                      />
                    </div>

                    {/* Avatar */}
                    <div className="h-9 w-9 rounded-full bg-slate-900/10 flex items-center justify-center text-slate-700 text-xs font-semibold flex-shrink-0">
                      {initials(mail.fromName)}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 pr-10">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-sm truncate ${
                            mail.unread
                              ? "font-semibold text-slate-900"
                              : "font-medium text-slate-800"
                          }`}
                        >
                          {primaryText}
                        </p>
                        <p className="text-xs text-slate-500 flex-shrink-0">
                          {formatDateCompact(mail.createdAt)}
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-slate-900 truncate mt-0.5">
                        {secondaryText}
                      </p>

                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {mail.preview}
                      </p>

                      {mail.important && (
                        <span className="inline-flex mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                          Important
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Star */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleStar(mail.id)
                  }}
                  className="absolute right-3 top-4 h-9 w-9 rounded-xl hover:bg-slate-100 flex items-center justify-center"
                >
                  <FiStar
                    className={
                      mail.starred
                        ? "text-amber-500 fill-amber-500"
                        : "text-slate-300"
                    }
                  />
                </button>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}






