// // client/components/mail/ComposePanel.tsx
// "use client"

// import { useMemo, useState } from "react"
// import { FiPaperclip, FiSend, FiX, FiAlertCircle } from "react-icons/fi"
// import type { MessageType, Mail } from "./types"
// import { MESSAGE_TYPE_LABEL } from "./types"
// import {
//   sendMail,
//   replyToMessage,
//   getCurrentUserRole,
//   MailAPIError,
//   type MessageTarget,
// } from "../../lib/mail"
// import { formatDateCompact } from "./utils"

// interface ComposePanelProps {
//   onClose: () => void
//   onSent: () => void
//   replyTo?: Mail | null
// }

// type RecipientMode = "EMAIL" | "ROLE"

// export default function ComposePanel({
//   onClose,
//   onSent,
//   replyTo,
// }: ComposePanelProps) {
//   const role = getCurrentUserRole()
//   const isStudent = role === "STUDENT"

//   // Check if this is a reply
//   const isReply = !!replyTo

//   // Different UI modes based on role
//   const [mode] = useState<RecipientMode>(isStudent ? "ROLE" : "EMAIL")

//   // Email mode fields (Teacher/Warden)
//   const [toEmail, setToEmail] = useState(
//     isReply && replyTo?.fromEmail ? replyTo.fromEmail : ""
//   )
//   const [ccEmail, setCcEmail] = useState("")
//   const [bccEmail, setBccEmail] = useState("")

//   // Role mode fields (Student)
//   const [toRole, setToRole] = useState<"TEACHER" | "WARDEN">("TEACHER")

//   // Common fields
//   const [type, setType] = useState<MessageType>("GENERAL")
//   const [subject, setSubject] = useState(
//     isReply && replyTo?.subject
//       ? replyTo.subject.startsWith("Re: ")
//         ? replyTo.subject
//         : `Re: ${replyTo.subject}`
//       : ""
//   )
//   const [body, setBody] = useState(
//     isReply && replyTo
//       ? `\n\n--- Original Message ---\nFrom: ${replyTo.fromName}\nDate: ${formatDateCompact(replyTo.createdAt)}\n\n${replyTo.body}`
//       : ""
//   )
//   const [files, setFiles] = useState<File[]>([])
//   const [sending, setSending] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const buildTargets = useMemo(() => {
//     if (isStudent && mode === "ROLE") {
//       // Student sending to teacher/warden by role
//       return {
//         targets: [{ kind: "ROLE" as const, value: toRole }],
//         ccTargets: [],
//         bccTargets: [],
//       }
//     }

//     // Email mode (teacher/warden/admin)
//     const norm = (s: string) => s.trim()
//     const to = norm(toEmail)
//     const cc = norm(ccEmail)
//     const bcc = norm(bccEmail)

//     return {
//       targets: to ? [{ kind: "EMAIL" as const, value: to }] : [],
//       ccTargets: cc ? [{ kind: "EMAIL" as const, value: cc }] : [],
//       bccTargets: bcc ? [{ kind: "EMAIL" as const, value: bcc }] : [],
//     }
//   }, [isStudent, mode, toEmail, ccEmail, bccEmail, toRole])

//   function isValidEmail(email: string): boolean {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
//   }

//   async function handleSend() {
//     setError(null)

//     // Handle reply separately
//     if (isReply && replyTo) {
//       if (!body.trim()) return setError("Reply body is required")

//       const maxSize = 10 * 1024 * 1024
//       const tooBig = files.filter((f) => f.size > maxSize)
//       if (tooBig.length) {
//         return setError(
//           `Files exceed 10MB: ${tooBig.map((f) => f.name).join(", ")}`
//         )
//       }

//       try {
//         setSending(true)

//         console.log("[ComposePanel] Sending reply to:", replyTo.id)

//         await replyToMessage(
//           replyTo.messageId || replyTo.id,
//           body.trim(),
//           false, // replyToAll
//           files
//         )

//         console.log("[ComposePanel] Reply sent successfully")

//         // Reset form
//         setToEmail("")
//         setSubject("")
//         setBody("")
//         setFiles([])
//         onSent()
//       } catch (e: any) {
//         console.error("[ComposePanel] Failed to send reply:", e)

//         if (e instanceof MailAPIError) {
//           if (e.statusCode === 401) {
//             setError("Session expired. Please login again.")
//           } else {
//             setError(e.message || "Failed to send reply")
//           }
//         } else {
//           setError(e.message || "Failed to send reply")
//         }
//       } finally {
//         setSending(false)
//       }

//       return
//     }

//     // Validation for new message
//     if (mode === "EMAIL") {
//       if (!toEmail.trim()) return setError("To email is required")
//       if (!isValidEmail(toEmail)) return setError("Enter a valid To email")
//       if (ccEmail.trim() && !isValidEmail(ccEmail))
//         return setError("Enter a valid CC email")
//       if (bccEmail.trim() && !isValidEmail(bccEmail))
//         return setError("Enter a valid BCC email")
//     }

//     if (!subject.trim()) return setError("Subject is required")
//     if (!body.trim()) return setError("Body is required")

//     // File size validation (10MB per file)
//     const maxSize = 10 * 1024 * 1024
//     const tooBig = files.filter((f) => f.size > maxSize)
//     if (tooBig.length) {
//       return setError(
//         `Files exceed 10MB: ${tooBig.map((f) => f.name).join(", ")}`
//       )
//     }

//     try {
//       setSending(true)

//       const payload = {
//         targets: buildTargets.targets as MessageTarget[],
//         ccTargets: buildTargets.ccTargets as MessageTarget[],
//         bccTargets: buildTargets.bccTargets as MessageTarget[],
//         subject: subject.trim(),
//         body: body.trim(),
//         type,
//         attachments: files,
//       }

//       console.log("[ComposePanel] Sending mail:", {
//         role,
//         mode,
//         targets: payload.targets,
//       })

//       await sendMail(payload)

//       console.log("[ComposePanel] Mail sent successfully")

//       // Reset form
//       setToEmail("")
//       setCcEmail("")
//       setBccEmail("")
//       setToRole("TEACHER")
//       setSubject("")
//       setBody("")
//       setFiles([])
//       setType("GENERAL")
//       onSent()
//     } catch (e: any) {
//       console.error("[ComposePanel] Failed to send mail:", e)

//       if (e instanceof MailAPIError) {
//         if (e.statusCode === 401) {
//           setError("Session expired. Please login again.")
//         } else {
//           setError(e.message || "Failed to send mail")
//         }
//       } else {
//         setError(e.message || "Failed to send mail")
//       }
//     } finally {
//       setSending(false)
//     }
//   }

//   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//     if (!e.target.files) return
//     const newFiles = Array.from(e.target.files)
//     setFiles((prev) => [...prev, ...newFiles])
//   }

//   function removeFile(idx: number) {
//     setFiles((prev) => prev.filter((_, i) => i !== idx))
//   }

//   return (
//     <section className="bg-white flex flex-col min-w-0">
//       <div className="h-12 px-4 border-b border-slate-200 flex items-center justify-between">
//         <div className="text-sm font-semibold text-slate-900">
//           {isReply ? "Reply to message" : "New message"}
//         </div>
//         <button
//           onClick={onClose}
//           disabled={sending}
//           className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-60"
//           title="Close"
//         >
//           <FiX />
//         </button>
//       </div>

//       <div className="p-5 space-y-4 overflow-y-auto">
//         {error && (
//           <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 flex items-start gap-2">
//             <FiAlertCircle className="mt-0.5 flex-shrink-0" />
//             <span>{error}</span>
//           </div>
//         )}

//         {isReply && replyTo && (
//           <div className="text-xs bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
//             <span className="font-semibold text-blue-800">Replying to:</span>{" "}
//             <span className="text-blue-600">{replyTo.subject}</span>
//           </div>
//         )}

//         {role && (
//           <div className="text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
//             Sending as <span className="font-semibold text-slate-800">{role}</span>
//           </div>
//         )}

//         {/* Recipient Section */}
//         {isStudent ? (
//           // Student: Role selector
//           <div>
//             <label className="text-xs font-semibold text-slate-600">To</label>
//             <select
//               value={toRole}
//               onChange={(e) => setToRole(e.target.value as "TEACHER" | "WARDEN")}
//               disabled={sending}
//               className="mt-1 w-full h-9 border border-slate-200 px-3 text-sm bg-white disabled:bg-slate-50 disabled:opacity-60 rounded"
//             >
//               <option value="TEACHER">Teacher</option>
//               <option value="WARDEN">Warden</option>
//             </select>
//           </div>
//         ) : (
//           // Teacher/Warden: Email fields
//           <div className="space-y-3">
//             <div className="grid grid-cols-[56px_1fr] items-center gap-3">
//               <label className="text-xs font-semibold text-slate-600">To</label>
//               <input
//                 value={toEmail}
//                 onChange={(e) => setToEmail(e.target.value)}
//                 disabled={sending}
//                 className="h-9 border border-slate-200 rounded px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-50 disabled:opacity-60"
//                 placeholder="recipient@example.com"
//               />
//             </div>

//             <div className="grid grid-cols-[56px_1fr] items-center gap-3">
//               <label className="text-xs font-semibold text-slate-600">CC</label>
//               <input
//                 value={ccEmail}
//                 onChange={(e) => setCcEmail(e.target.value)}
//                 disabled={sending}
//                 className="h-9 border border-slate-200 rounded px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-50 disabled:opacity-60"
//                 placeholder="optional"
//               />
//             </div>

//             <div className="grid grid-cols-[56px_1fr] items-center gap-3">
//               <label className="text-xs font-semibold text-slate-600">BCC</label>
//               <input
//                 value={bccEmail}
//                 onChange={(e) => setBccEmail(e.target.value)}
//                 disabled={sending}
//                 className="h-9 border border-slate-200 rounded px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-50 disabled:opacity-60"
//                 placeholder="optional"
//               />
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div>
//             <label className="text-xs font-semibold text-slate-600">Type</label>
//             <select
//               value={type}
//               onChange={(e) => setType(e.target.value as MessageType)}
//               disabled={sending}
//               className="mt-1 w-full h-9 border border-slate-200 rounded px-3 text-sm bg-white disabled:bg-slate-50 disabled:opacity-60"
//             >
//               {Object.keys(MESSAGE_TYPE_LABEL).map((k) => (
//                 <option key={k} value={k}>
//                   {MESSAGE_TYPE_LABEL[k as MessageType]}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="text-xs font-semibold text-slate-600">Subject</label>
//             <input
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//               disabled={sending}
//               className="mt-1 w-full h-9 border border-slate-200 rounded px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-50 disabled:opacity-60"
//               placeholder="Add a subject"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="text-xs font-semibold text-slate-600">Message</label>
//           <textarea
//             value={body}
//             onChange={(e) => setBody(e.target.value)}
//             disabled={sending}
//             className="mt-1 w-full min-h-[240px] rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-50 disabled:opacity-60"
//             placeholder="Write your message..."
//           />
//         </div>

//         <div className="flex items-center gap-3">
//           <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer hover:text-slate-900">
//             <FiPaperclip />
//             <span>Attach</span>
//             <input
//               type="file"
//               multiple
//               className="hidden"
//               onChange={handleFileChange}
//               disabled={sending}
//             />
//           </label>

//           <div className="text-xs text-slate-500 truncate">
//             {files.length ? `${files.length} file(s) selected` : "No attachments"}
//           </div>
//         </div>

//         {files.length > 0 && (
//           <div className="space-y-2">
//             {files.map((f, i) => (
//               <div
//                 key={i}
//                 className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200"
//               >
//                 <div className="min-w-0">
//                   <div className="text-sm font-medium text-slate-900 truncate">
//                     {f.name}
//                   </div>
//                   <div className="text-xs text-slate-500">
//                     {(f.size / 1024).toFixed(1)} KB
//                   </div>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => removeFile(i)}
//                   disabled={sending}
//                   className="text-red-600 hover:text-red-800 text-xs font-semibold disabled:opacity-60"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="pt-2 flex items-center justify-end gap-2">
//           <button
//             onClick={onClose}
//             disabled={sending}
//             className="h-7 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 disabled:opacity-60"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSend}
//             disabled={sending}
//             className="h-7 px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-60 inline-flex items-center gap-2"
//           >
//             {sending ? (
//               <>
//                 <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 <span>Sending...</span>
//               </>
//             ) : (
//               <>
//                 <FiSend />
//                 <span>Send</span>
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </section>
//   )
// }












// client/components/mail/ComposePanel.tsx
"use client"

import { useMemo, useState, useEffect } from "react"
import { toast } from "sonner"
import { FiPaperclip, FiSend, FiX, FiAlertCircle } from "react-icons/fi"
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
    <section className="bg-white flex flex-col min-w-0">
      <div className="h-12 px-4 border-b border-slate-200 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900">
          {isReply ? "Reply to message" : "New message"}
        </div>
        <button
          onClick={onClose}
          disabled={sending}
          className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-60"
          title="Close"
        >
          <FiX />
        </button>
      </div>

      <div className="p-5 space-y-4 overflow-y-auto">
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
          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer hover:text-slate-900">
            <FiPaperclip />
            <span>Attach</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={sending}
            />
          </label>

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

        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={sending}
            className="h-7 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={handleSend}
            disabled={sending}
            className="h-7 px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-60 inline-flex items-center gap-2"
          >
            {sending ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <FiSend />
                <span>{isReply ? "Send Reply" : "Send"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
