// client/components/mail/MailWorkspace.tsx
"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { toast } from "sonner"
import MailFolders from "./MailFolders"
import MailQueue from "./MailQueue"
import MailViewer from "./MailViewer"
import ComposePanel from "./ComposePanel"

import { RiSendPlane2Line, RiFolder3Line } from "react-icons/ri"
import { FiX, FiMenu, FiArrowLeft } from "react-icons/fi"

import type { MailFolderKey, MessageType, Mail } from "./types"
import {
  fetchFolder,
  markAsRead,
  moveToArchive,
  moveToTrash,
  toggleStar,
  MailAPIError,
} from "../../lib/mail"
import { mapFolderResponseToList } from "./map"
import { getUser } from "../../lib/auth"

type ViewMode = "READ" | "COMPOSE" | "REPLY"  // ✅ Added REPLY

export default function MailWorkspace() {
  const [folder, setFolder] = useState<MailFolderKey>("inbox")
  const [type, setType] = useState<MessageType>("GENERAL")
  const [query, setQuery] = useState("")
  const [activeId, setActiveId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("READ")
  const [replyToMail, setReplyToMail] = useState<Mail | null>(null)  // ✅ NEW

  const [currentUserId, setCurrentUserId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<Mail[]>([])
  const [counts, setCounts] = useState<Record<MailFolderKey, number>>({
    inbox: 0,
    sent: 0,
    drafts: 0,
    trash: 0,
    archived: 0,
  })

  // Folders Sidebar mobile state
  const [mobileFoldersOpen, setMobileFoldersOpen] = useState(false)

  // ✅ Action loading states
  const [archiving, setArchiving] = useState(false)
  const [trashing, setTrashing] = useState(false)

  // Load user on mount
  useEffect(() => {
    const user = getUser()
    if (!user?.id) {
      console.error("[MailWorkspace] User not found")
      toast.error("Please login to access mail")
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      return
    }
    console.log(`[MailWorkspace] User loaded: ${user.role} (${user.id})`)
    setCurrentUserId(user.id)
  }, [])

  // Filter messages locally
  const locallyFiltered = useMemo(() => {
    const searchQuery = query.trim().toLowerCase()
    return list.filter((mail) => {
      if (type !== "GENERAL" && mail.type !== type) {
        return false
      }
      if (!searchQuery) return true
      return (
        mail.subject.toLowerCase().includes(searchQuery) ||
        mail.preview.toLowerCase().includes(searchQuery) ||
        mail.fromName.toLowerCase().includes(searchQuery)
      )
    })
  }, [list, query, type])

  // Get active mail
  const activeMail = useMemo(() => {
    if (!locallyFiltered.length) return null
    if (activeId) {
      return locallyFiltered.find((m) => m.id === activeId) || locallyFiltered[0]
    }
    return locallyFiltered[0]
  }, [locallyFiltered, activeId])

  // ✅ Load folder with useCallback
  const loadFolder = useCallback(async () => {
    if (!currentUserId) return

    setLoading(true)

    try {
      console.log(`[MailWorkspace] Loading folder: ${folder}`)
      const response = await fetchFolder(folder, {
        page: 1,
        limit: 50,
      })

      const mapped = mapFolderResponseToList(response.data, currentUserId)
      console.log(`[MailWorkspace] Loaded ${mapped.items.length} messages`)
      setList(mapped.items)
    } catch (err: any) {
      console.error("[MailWorkspace] Failed to load folder:", err)
      setList([])

      if (err instanceof MailAPIError && err.statusCode === 401) {
        toast.error("Session expired. Please login again.")
      } else {
        toast.error(err.message || "Failed to load messages")
      }
    } finally {
      setLoading(false)
    }
  }, [folder, currentUserId])

  // ✅ Load folder counts with useCallback
  const loadCounts = useCallback(async () => {
    if (!currentUserId) return

    const folders: MailFolderKey[] = [
      "inbox",
      "sent",
      "drafts",
      "trash",
      "archived",
    ]
    const newCounts: Record<MailFolderKey, number> = { ...counts }

    await Promise.all(
      folders.map(async (folderKey) => {
        try {
          const response = await fetchFolder(folderKey, {
            page: 1,
            limit: 1,
          })
          
          const apiData = response.data
          newCounts[folderKey] = 
            apiData.total || 
            apiData.count || 
            apiData.pagination?.total || 
            apiData.messages?.length || 
            0
        } catch (err) {
          console.error(
            `[MailWorkspace] Failed to load count for ${folderKey}:`,
            err
          )
          newCounts[folderKey] = 0
        }
      })
    )

    setCounts(newCounts)
  }, [currentUserId])

  // Load folder on change
  useEffect(() => {
    if (!currentUserId) return
    
    loadFolder()
    loadCounts()
  }, [folder, currentUserId, loadFolder, loadCounts])

  // ✅ Mark active mail as read with proper cleanup
  useEffect(() => {
    if (!activeMail || !activeMail.unread || viewMode !== "READ") return

    let cancelled = false
    const timer = setTimeout(async () => {
      if (cancelled) return

      try {
        const messageId = activeMail.messageId || activeMail.id
        console.log(`[MailWorkspace] Marking as read: ${messageId}`)
        await markAsRead(messageId)
        
        if (!cancelled) {
          setList((prev) =>
            prev.map((m) =>
              m.id === activeMail.id ? { ...m, unread: false } : m
            )
          )
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[MailWorkspace] Failed to mark as read:", err)
        }
      }
    }, 500)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [activeMail?.id, activeMail?.unread, viewMode])

  // Handlers
  function handleCompose() {
    setViewMode("COMPOSE")
    setReplyToMail(null)
    setActiveId(null)
  }

  // ✅ NEW: Handle reply
  function handleReply() {
    if (!activeMail) {
      toast.error("No message selected")
      return
    }
    setReplyToMail(activeMail)
    setViewMode("REPLY")
  }

  function handleSelect(id: string) {
    setActiveId(id)
    setViewMode("READ")
  }

  async function handleToggleStar(id: string) {
    const mail = list.find((m) => m.id === id)
    if (!mail) return

    // Optimistic update
    setList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    )

    try {
      const messageId = mail.messageId || mail.id
      console.log(`[MailWorkspace] Toggling star: ${messageId}`)
      await toggleStar(messageId)
    } catch (err: any) {
      console.error("[MailWorkspace] Failed to toggle star:", err)
      // Revert on error
      setList((prev) =>
        prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
      )
      toast.error("Failed to update star")
    }
  }

  // ✅ Archive handler with proper error handling
  async function handleArchive() {
    if (archiving) return
    
    if (!activeMail) {
      toast.error("No message selected")
      return
    }

    const messageId = activeMail.messageId || activeMail.id
    if (!messageId) {
      toast.error("Invalid message ID")
      return
    }

    setArchiving(true)
    try {
      console.log(`[MailWorkspace] Archiving: ${messageId}`)
      await moveToArchive(messageId)
      
      setList((prev) => prev.filter((m) => m.id !== activeMail.id))
      setActiveId(null)
      toast.success("Message archived successfully")
      loadCounts()
    } catch (err: any) {
      console.error("[MailWorkspace] Failed to archive:", err)
      toast.error(err.message || "Failed to archive message")
    } finally {
      setArchiving(false)
    }
  }

  // ✅ Trash handler with proper error handling
  async function handleTrash() {
    if (trashing) return
    
    if (!activeMail) {
      toast.error("No message selected")
      return
    }

    const messageId = activeMail.messageId || activeMail.id
    if (!messageId) {
      toast.error("Invalid message ID")
      return
    }

    setTrashing(true)
    try {
      console.log(`[MailWorkspace] Moving to trash: ${messageId}`)
      await moveToTrash(messageId)
      
      setList((prev) => prev.filter((m) => m.id !== activeMail.id))
      setActiveId(null)
      toast.success("Message moved to trash")
      loadCounts()
    } catch (err: any) {
      console.error("[MailWorkspace] Failed to move to trash:", err)
      toast.error(err.message || "Failed to move to trash")
    } finally {
      setTrashing(false)
    }
  }

  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm relative group">

      {/* Mobile Folders Overlay */}
      {mobileFoldersOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden transition-opacity"
          onClick={() => setMobileFoldersOpen(false)}
        />
      )}

      <div className="flex h-full relative">
        
        {/* Folders (Genie menu on mobile, built-in sidebar on lg) */}
        <div className={`
          fixed lg:static z-50 overflow-hidden
          bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+3.5rem)] right-4 lg:bottom-auto lg:right-auto lg:top-0 lg:left-0
          h-auto lg:h-full w-[220px] sm:w-[240px] lg:w-[220px]
          rounded-2xl lg:rounded-none shadow-2xl lg:shadow-none
          origin-bottom-right lg:origin-center border border-slate-200 lg:border-y-0 lg:border-l-0
          bg-white
          transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${mobileFoldersOpen ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-12 pointer-events-none lg:scale-100 lg:translate-y-0 lg:opacity-100 lg:pointer-events-auto"}
        `}>
          <MailFolders
            folder={folder}
            setFolder={(newFolder) => {
              setFolder(newFolder)
              setType("GENERAL")
              setQuery("")
              setActiveId(null)
              setViewMode("READ")
              setReplyToMail(null)
              setMobileFoldersOpen(false)
            }}
            counts={counts}
            onCompose={() => {
              handleCompose()
              setMobileFoldersOpen(false)
            }}
          />
        </div>

        {/* List / Queue View (Hidden on mobile if reading or composing) */}
        <div className={`
          flex-1 lg:w-[360px] lg:flex-none border-r border-slate-200 h-full
          ${(viewMode !== "READ" || activeId) ? "hidden lg:block w-full lg:w-[360px]" : "block w-full lg:w-[360px]"}
        `}>
          <MailQueue
            folder={folder}
            mails={locallyFiltered}
            query={query}
            setQuery={setQuery}
            activeId={activeMail?.id || null}
            onSelect={handleSelect}
            type={type}
            setType={setType}
            onToggleStar={handleToggleStar}
            loading={loading}
          />
        </div>

        {/* Detail / Compose View (Hidden on mobile if queue is showing) */}
        <div className={`
          flex-1 h-full min-w-0
          ${(viewMode === "READ" && !activeId) ? "hidden lg:block" : "block"}
        `}>
          {viewMode === "COMPOSE" || viewMode === "REPLY" ? (
            <ComposePanel
              replyTo={viewMode === "REPLY" ? replyToMail : null}
              onClose={() => {
                setViewMode("READ")
                setReplyToMail(null)
              }}
              onSent={() => {
                setViewMode("READ")
                setReplyToMail(null)

                if (viewMode === "REPLY") {
                  loadFolder()
                } else {
                  setFolder("sent")
                }

                loadCounts()
              }}
            />
          ) : (
            <MailViewer
              mail={activeMail}
              onReply={handleReply}
              onArchive={handleArchive}
              onTrash={handleTrash}
              onStar={() => {
                if (activeMail) handleToggleStar(activeMail.id)
              }}
              onClose={() => setActiveId(null)}
            />
          )}
        </div>
      </div>

      {/* Floating Action Buttons for Mobile (Only show on Mail Queue page) */}
      {viewMode === "READ" && !activeId && (
        <div className="lg:hidden fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-4 flex flex-col gap-2.5 z-50 pb-1">
          <button 
            onClick={() => setMobileFoldersOpen(true)}
            className="w-11 h-11 bg-white text-slate-700 shadow-md rounded-full flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition"
          >
             <RiFolder3Line className="text-[19px] translate-y-[1px]" />
          </button>
          <button 
             onClick={handleCompose}
             className="w-12 h-12 bg-slate-900 text-white shadow-lg rounded-full flex items-center justify-center hover:bg-slate-800 transition"
          >
             <RiSendPlane2Line className="text-[21px] -ml-0.5 translate-y-[1px]" />
          </button>
        </div>
      )}

    </div>
  )
}










