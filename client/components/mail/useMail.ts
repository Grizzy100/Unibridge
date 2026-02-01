// client/components/mail/useMail.ts
"use client"

import { useEffect, useState } from "react"
import {
  fetchFolder,
  markAsRead,
  toggleStar,
  moveToArchive,
  moveToTrash,
} from "../../lib/mail"
import { mapFolderResponseToList } from "./map"
import { getUser } from "../../lib/auth"
import type { Mail, MailFolderKey, MessageType } from "./types"

export function useMail() {
  const [folder, setFolder] = useState<MailFolderKey>("inbox")
  const [type, setType] = useState<MessageType>("GENERAL")
  const [mails, setMails] = useState<Mail[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    
    async function loadMessages() {
      setLoading(true)
      setError(null)

      try {
        const user = getUser()
        if (!user?.id) {
          throw new Error("User not authenticated")
        }

        const response = await fetchFolder(folder, {
          type: type === "GENERAL" ? undefined : type,
          page: 1,
          limit: 50,
        })

        if (!mounted) return

        const mapped = mapFolderResponseToList(response.data, user.id)
        setMails(mapped.items)

        // Auto-select first mail if none selected
        if (!activeId && mapped.items.length > 0) {
          setActiveId(mapped.items[0].id)
        }
      } catch (err: any) {
        if (!mounted) return
        
        console.error("[useMail] Failed to load messages:", err)
        setError(err.message || "Failed to load messages")
        setMails([])
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadMessages()

    return () => {
      mounted = false
    }
  }, [folder, type])

  const activeMail = mails.find((m) => m.id === activeId) || null

  async function openMail(id: string) {
    setActiveId(id)
    
    const mail = mails.find((m) => m.id === id)
    if (!mail) return

    // Mark as read if unread
    if (mail.unread) {
      try {
        await markAsRead(id)
        setMails((prev) =>
          prev.map((m) => (m.id === id ? { ...m, unread: false } : m))
        )
      } catch (err) {
        console.error("[useMail] Failed to mark as read:", err)
      }
    }
  }

  async function star(id: string) {
    // Optimistic update
    setMails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    )

    try {
      await toggleStar(id)
    } catch (err) {
      console.error("[useMail] Failed to toggle star:", err)
      
      // Revert on error
      setMails((prev) =>
        prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
      )
    }
  }

  async function archive(id: string) {
    try {
      await moveToArchive(id)
      setMails((prev) => prev.filter((m) => m.id !== id))
      
      // Select next mail if current was archived
      if (activeId === id) {
        const remaining = mails.filter((m) => m.id !== id)
        setActiveId(remaining.length > 0 ? remaining[0].id : null)
      }
    } catch (err) {
      console.error("[useMail] Failed to archive:", err)
      setError("Failed to archive message")
    }
  }

  async function trash(id: string) {
    try {
      await moveToTrash(id)
      setMails((prev) => prev.filter((m) => m.id !== id))
      
      // Select next mail if current was trashed
      if (activeId === id) {
        const remaining = mails.filter((m) => m.id !== id)
        setActiveId(remaining.length > 0 ? remaining[0].id : null)
      }
    } catch (err) {
      console.error("[useMail] Failed to move to trash:", err)
      setError("Failed to move message to trash")
    }
  }

  return {
    folder,
    setFolder,
    type,
    setType,
    mails,
    activeMail,
    activeId,
    openMail,
    loading,
    error,
    actions: {
      star,
      archive,
      trash,
    },
  }
}
