// client/components/mail/ComposePanel.tsx
"use client"

import { useMemo, useState, useEffect } from "react"
import { toast } from "sonner"
import { FiPaperclip, FiSend, FiX, FiAlertCircle, FiArrowLeft } from "react-icons/fi"
import type { MessageType, Mail } from "./types"
import { MESSAGE_TYPE_LABEL } from "./types"
import {
  sendMail,
  replyToMessage,
  getCurrentUserRole,
  MailAPIError,
  type MessageTarget,
} from "../../lib/mail"
import { formatDateCompact } from "./utils"

// ✅ FIXED: Add replyTo to interface
interface ComposePanelProps {
  onClose: () => void
  onSent: () => void
  replyTo?: Mail | null  // ✅ ADD THIS LINE
}

export default function ComposePanel({
  onClose,
  onSent,
  replyTo,  // ✅ ADD THIS PARAMETER
}: ComposePanelProps) {
  const role = getCurrentUserRole()
  
  // ✅ Check if this is a reply
  const isReply = !!replyTo

  const [toEmail, setToEmail] = useState("")
  const [ccEmail, setCcEmail] = useState("")
  const [bccEmail, setBccEmail] = useState("")
  const [type, setType] = useState<MessageType>("GENERAL")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ✅ Reset fields when replyTo changes or component mounts
  useEffect(() => {
    if (replyTo) {
      setToEmail(replyTo.fromEmail || "")
      setSubject(
        replyTo.subject.startsWith("Re: ")
          ? replyTo.subject
          : `Re: ${replyTo.subject}`
      )
      setBody(
        `\n\n------- Original Message -------\nFrom: ${replyTo.fromName} <${replyTo.fromEmail}>\nDate: ${formatDateCompact(replyTo.createdAt)}\nSubject: ${replyTo.subject}\n\n${replyTo.body}`
      )
    } else {
      // Reset for new compose
      setToEmail("")
      setCcEmail("")
      setBccEmail("")
      setSubject("")
      setBody("")
      setFiles([])
      setError(null)
    }
  }, [replyTo])

  const buildTargets = useMemo(() => {
    const norm = (s: string) => s.trim().toLowerCase()
    const to = norm(toEmail)
    const cc = norm(ccEmail)
    const bcc = norm(bccEmail)

    return {
      targets: to ? [{ kind: "EMAIL" as const, value: to }] : [],
      ccTargets: cc ? [{ kind: "EMAIL" as const, value: cc }] : [],
      bccTargets: bcc ? [{ kind: "EMAIL" as const, value: bcc }] : [],
    }
  }, [toEmail, ccEmail, bccEmail])

  function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  }

  async function handleSend() {
    setError(null)

    // ✅ Handle reply separately
    if (isReply && replyTo) {
      if (!body.trim()) {
        return setError("Reply body is required")
      }

      const maxSize = 10 * 1024 * 1024
      const tooBig = files.filter((f) => f.size > maxSize)
      if (tooBig.length) {
        return setError(
          `Files exceed 10MB: ${tooBig.map((f) => f.name).join(", ")}`
        )
      }

      try {
        setSending(true)

        const messageId = replyTo.messageId || replyTo.id
        console.log("[ComposePanel] Sending reply to:", messageId)

        await replyToMessage(messageId, body.trim(), false, files)

        console.log("[ComposePanel] Reply sent successfully")
        toast.success("Reply sent successfully")

        setToEmail("")
        setSubject("")
        setBody("")
        setFiles([])
        onSent()
      } catch (e: any) {
        console.error("[ComposePanel] Failed to send reply:", e)

        if (e instanceof MailAPIError) {
          if (e.statusCode === 401) {
            setError("Session expired. Please login again.")
            toast.error("Session expired")
          } else {
            setError(e.message || "Failed to send reply")
            toast.error(e.message || "Failed to send reply")
          }
        } else {
          setError(e.message || "Failed to send reply")
          toast.error(e.message || "Failed to send reply")
        }
      } finally {
        setSending(false)
      }

      return
    }

    // ✅ Validation for new message
    if (!toEmail.trim()) {
      return setError("To email is required")
    }
    if (!isValidEmail(toEmail)) {
      return setError("Enter a valid To email (e.g., xyz@unibridge.edu.in)")
    }
    if (ccEmail.trim() && !isValidEmail(ccEmail)) {
      return setError("Enter a valid CC email")
    }
    if (bccEmail.trim() && !isValidEmail(bccEmail)) {
      return setError("Enter a valid BCC email")
    }

    if (!subject.trim()) {
      return setError("Subject is required")
    }
    if (!body.trim()) {
      return setError("Body is required")
    }

    const maxSize = 10 * 1024 * 1024
    const tooBig = files.filter((f) => f.size > maxSize)
    if (tooBig.length) {
      return setError(
        `Files exceed 10MB: ${tooBig.map((f) => f.name).join(", ")}`
      )
    }

    try {
      setSending(true)

      const payload = {
        targets: buildTargets.targets as MessageTarget[],
        ccTargets: buildTargets.ccTargets as MessageTarget[],
        bccTargets: buildTargets.bccTargets as MessageTarget[],
        subject: subject.trim(),
        body: body.trim(),
        type,
        attachments: files,
      }

      console.log("[ComposePanel] Sending mail:", {
        role,
        targets: payload.targets,
      })

      await sendMail(payload)

      console.log("[ComposePanel] Mail sent successfully")
      toast.success("Mail sent successfully")

      setToEmail("")
      setCcEmail("")
      setBccEmail("")
      setSubject("")
      setBody("")
      setFiles([])
      setType("GENERAL")
      onSent()
    } catch (e: any) {
      console.error("[ComposePanel] Failed to send mail:", e)

      if (e instanceof MailAPIError) {
        if (e.statusCode === 401) {
          setError("Session expired. Please login again.")
          toast.error("Session expired")
        } else if (e.statusCode === 400) {
          setError(e.message || "Invalid recipient. Please check the email address.")
          toast.error(e.message || "Invalid recipient")
        } else {
          setError(e.message || "Failed to send mail")
          toast.error(e.message || "Failed to send mail")
        }
      } else {
        setError(e.message || "Failed to send mail")
        toast.error(e.message || "Failed to send mail")
      }
    } finally {
      setSending(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return
    const newFiles = Array.from(e.target.files)
    setFiles((prev) => [...prev, ...newFiles])
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <section className="bg-white flex flex-col min-w-0 h-full overflow-hidden">
      <div className="h-12 px-2 sm:px-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Mobile Back Button */}
          <button
            onClick={onClose}
            disabled={sending}
            className="lg:hidden h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-60 -ml-1 mr-1"
            title="Back"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <div className="text-sm font-semibold text-slate-900">
            {isReply ? "Reply to message" : "New message"}
          </div>
        </div>
        <button
          onClick={onClose}
          disabled={sending}
          className="hidden lg:flex h-9 w-9 rounded-xl hover:bg-slate-50 items-center justify-center text-slate-600 disabled:opacity-60"
          title="Close"
        >
          <FiX />
        </button>
      </div>

      <div className="p-5 space-y-4 overflow-y-auto flex-1 min-h-0">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 flex items-start gap-2">
            <FiAlertCircle className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ✅ Show reply context */}
        {isReply && replyTo && (
          <div className="text-xs bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <span className="font-semibold text-blue-800">Replying to:</span>{" "}
            <span className="text-blue-600">{replyTo.fromName}</span>
            {" · "}
            <span className="text-blue-500">{replyTo.subject}</span>
          </div>
        )}

        {role && (
          <div className="text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
            Sending as <span className="font-semibold text-slate-800">{role}</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="grid grid-cols-[56px_1fr] items-center gap-3">
            <label className="text-xs font-semibold text-slate-600">To</label>
            <input
              type="email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              disabled={sending || isReply}  
              className="h-9 border border-slate-200 rounded px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-50 disabled:opacity-60"
              placeholder="Enter email"
            />
          </div>

          <div className="grid grid-cols-[56px_1fr] items-center gap-3">
            <label className="text-xs font-semibold text-slate-600">CC</label>
            <input
              type="email"
              value={ccEmail}
              onChange={(e) => setCcEmail(e.target.value)}
              disabled={sending}
              className="h-9 border border-slate-200 rounded px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-50 disabled:opacity-60"
              placeholder="optional"
            />
          </div>

          <div className="grid grid-cols-[56px_1fr] items-center gap-3">
            <label className="text-xs font-semibold text-slate-600">BCC</label>
            <input
              type="email"
              value={bccEmail}
              onChange={(e) => setBccEmail(e.target.value)}
              disabled={sending}
              className="h-9 border border-slate-200 rounded px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-50 disabled:opacity-60"
              placeholder="optional"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-600">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MessageType)}
              disabled={sending}
              className="mt-1 w-full h-9 border border-slate-200 rounded px-3 text-sm bg-white disabled:bg-slate-50 disabled:opacity-60"
            >
              {Object.keys(MESSAGE_TYPE_LABEL).map((k) => (
                <option key={k} value={k}>
                  {MESSAGE_TYPE_LABEL[k as MessageType]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={sending}
              className="mt-1 w-full h-9 border border-slate-200 rounded px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-50 disabled:opacity-60"
              placeholder="Add a subject"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={sending}
            className="mt-1 w-full min-h-[240px] rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-50 disabled:opacity-60"
            placeholder="Write your message..."
          />
        </div>

        <div className="flex items-center gap-3">

          <div className="text-xs text-slate-500 truncate">
            {files.length ? `${files.length} file(s) selected` : "No attachments"}
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">
                    {f.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {(f.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  disabled={sending}
                  className="text-red-600 hover:text-red-800 text-xs font-semibold disabled:opacity-60"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER FIXED TO BOTTOM */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer hover:text-slate-900 border border-slate-300 px-3 py-1.5 rounded-lg bg-white shadow-sm transition-colors">
            <FiPaperclip />
            <span>Attach File</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={sending}
            />
          </label>

          <div className="text-xs text-slate-500 truncate">
            {files.length ? `${files.length} file(s)` : ""}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            disabled={sending}
            className="h-9 px-4 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 bg-white shadow-sm disabled:opacity-60 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSend}
            disabled={sending}
            className="h-9 px-5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 shadow-sm disabled:opacity-60 inline-flex items-center gap-2 transition-colors"
          >
            {sending ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <FiSend />
                <span>{isReply ? "Send Reply" : "Send Mail"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
