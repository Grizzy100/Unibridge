// client/components/mail/MailWorkspace.tsx
"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { toast } from "sonner"
import MailFolders from "./MailFolders"
import MailQueue from "./MailQueue"
import MailViewer from "./MailViewer"
import ComposePanel from "./ComposePanel"

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
  const [currentUserRole, setCurrentUserRole] = useState<string>("")
  const [parentViewTab, setParentViewTab] = useState<"MY_MAIL" | "WARD_MAIL">("MY_MAIL")
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<Mail[]>([])
  const [counts, setCounts] = useState<Record<MailFolderKey, number>>({
    inbox: 0,
    sent: 0,
    drafts: 0,
    trash: 0,
    archived: 0,
  })
  
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
    setCurrentUserRole(user.role || "")
  }, [])

  // Filter messages locally
  const locallyFiltered = useMemo(() => {
    const searchQuery = query.trim().toLowerCase()
    return list.filter((mail) => {
      // Role based view filtering for parents
      if (currentUserRole === "PARENT") {
        if (parentViewTab === "MY_MAIL" && mail.isMirrored) {
          return false
        }
        if (parentViewTab === "WARD_MAIL" && !mail.isMirrored) {
          return false
        }
      }

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
  }, [list, query, type, currentUserRole, parentViewTab])

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
    <div className="h-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm relative">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_360px_1fr] h-full">
        <MailFolders
          folder={folder}
          setFolder={(newFolder) => {
            setFolder(newFolder)
            setType("GENERAL")
            setQuery("")
            setActiveId(null)
            setViewMode("READ")
            setReplyToMail(null)
          }}
          counts={counts}
          onCompose={handleCompose}
        />

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
          currentUserRole={currentUserRole}
          parentViewTab={parentViewTab}
          setParentViewTab={setParentViewTab}
        />

        {/* ✅ Show compose panel for both COMPOSE and REPLY modes */}
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
          />
        )}
      </div>
    </div>
  )
}










