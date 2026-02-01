// // // // client/src/app/(dashboard)/student-dashboard/components/mail/ComposePanel.tsx
// // // "use client";

// // // import { useMemo, useState } from "react";
// // // import { FiPaperclip, FiSend, FiX } from "react-icons/fi";
// // // import type { MessageType } from "./types";
// // // import { MESSAGE_TYPE_LABEL } from "./types";
// // // import { sendMessage } from "../../../../../../lib/mail";

// // // type RecipientPreset = "TEACHER" | "WARDEN";

// // // export default function ComposePanel({
// // //   onClose,
// // //   onSent,
// // // }: {
// // //   onClose: () => void;
// // //   onSent: () => void;
// // // }) {
// // //   const [toPreset, setToPreset] = useState<RecipientPreset>("TEACHER");
// // //   const [type, setType] = useState<MessageType>("GENERAL");
// // //   const [subject, setSubject] = useState("");
// // //   const [body, setBody] = useState("");
// // //   const [files, setFiles] = useState<File[]>([]);
// // //   const [sending, setSending] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);

// // //   const targets = useMemo(() => {
// // //     // Student sends to teacher/warden by ROLE
// // //     return [{ kind: "ROLE", value: toPreset }];
// // //   }, [toPreset]);

// // //   async function handleSend() {
// // //     setError(null);
// // //     if (!subject.trim()) return setError("Subject is required");
// // //     if (!body.trim()) return setError("Body is required");

// // //     const form = new FormData();
// // //     form.append("targets", JSON.stringify(targets));
// // //     form.append("subject", subject);
// // //     form.append("body", body);
// // //     form.append("type", type);

// // //     for (const f of files) form.append("attachments", f);

// // //     try {
// // //       setSending(true);
// // //       await sendMessage(form);
// // //       onSent();
// // //     } catch (e: any) {
// // //       setError(e.message || "Failed to send");
// // //     } finally {
// // //       setSending(false);
// // //     }
// // //   }

// // //   return (
// // //     <section className="bg-white flex flex-col min-w-0">
// // //       <div className="h-12 px-4 border-b border-slate-200/70 flex items-center justify-between">
// // //         <div className="text-sm font-semibold text-slate-900">New message</div>
// // //         <button
// // //           onClick={onClose}
// // //           className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600"
// // //           title="Close"
// // //         >
// // //           <FiX />
// // //         </button>
// // //       </div>

// // //       <div className="p-5 space-y-4 overflow-y-auto">
// // //         {error ? (
// // //           <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
// // //             {error}
// // //           </div>
// // //         ) : null}

// // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// // //           <div>
// // //             <label className="text-xs font-semibold text-slate-600">To</label>
// // //             <select
// // //               value={toPreset}
// // //               onChange={(e) => setToPreset(e.target.value as RecipientPreset)}
// // //               className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm bg-white"
// // //             >
// // //               <option value="TEACHER">Teacher</option>
// // //               <option value="WARDEN">Warden</option>
// // //             </select>
// // //           </div>

// // //           <div>
// // //             <label className="text-xs font-semibold text-slate-600">Type</label>
// // //             <select
// // //               value={type}
// // //               onChange={(e) => setType(e.target.value as MessageType)}
// // //               className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm bg-white"
// // //             >
// // //               {Object.keys(MESSAGE_TYPE_LABEL).map((k) => (
// // //                 <option key={k} value={k}>
// // //                   {MESSAGE_TYPE_LABEL[k as MessageType]}
// // //                 </option>
// // //               ))}
// // //             </select>
// // //           </div>
// // //         </div>

// // //         <div>
// // //           <label className="text-xs font-semibold text-slate-600">Subject</label>
// // //           <input
// // //             value={subject}
// // //             onChange={(e) => setSubject(e.target.value)}
// // //             className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm"
// // //             placeholder="Add a subject"
// // //           />
// // //         </div>

// // //         <div>
// // //           <label className="text-xs font-semibold text-slate-600">Message</label>
// // //           <textarea
// // //             value={body}
// // //             onChange={(e) => setBody(e.target.value)}
// // //             className="mt-1 w-full min-h-[220px] rounded-xl border border-slate-200 px-3 py-2 text-sm"
// // //             placeholder="Write your message..."
// // //           />
// // //         </div>

// // //         <div className="flex items-center gap-3">
// // //           <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
// // //             <FiPaperclip />
// // //             <span>Attach</span>
// // //             <input
// // //               type="file"
// // //               multiple
// // //               className="hidden"
// // //               onChange={(e) => {
// // //                 const list = Array.from(e.target.files || []);
// // //                 setFiles(list);
// // //               }}
// // //             />
// // //           </label>

// // //           <div className="text-xs text-slate-500 truncate">
// // //             {files.length ? `${files.length} file(s) selected` : "No attachments"}
// // //           </div>
// // //         </div>

// // //         <div className="pt-2">
// // //           <button
// // //             onClick={handleSend}
// // //             disabled={sending}
// // //             className="h-10 px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60 inline-flex items-center gap-2"
// // //           >
// // //             <FiSend />
// // //             {sending ? "Sending..." : "Send"}
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </section>
// // //   );
// // // }



// // // client\src\app\(dashboard)\student-dashboard\components\mail\ComposePanel.tsx
// // "use client"

// // import { useMemo, useState } from "react"
// // import { FiPaperclip, FiSend, FiX } from "react-icons/fi"
// // import type { MessageType } from "./types"
// // import { MESSAGE_TYPE_LABEL } from "./types"
// // import { sendMessage } from "../../../../../../lib/mail"

// // export default function ComposePanel({
// //   onClose,
// //   onSent,
// // }: {
// //   onClose: () => void
// //   onSent: () => void
// // }) {
// //   const [toEmail, setToEmail] = useState("")
// //   const [ccEmail, setCcEmail] = useState("")
// //   const [bccEmail, setBccEmail] = useState("")
// //   const [type, setType] = useState<MessageType>("GENERAL")
// //   const [subject, setSubject] = useState("")
// //   const [body, setBody] = useState("")
// //   const [files, setFiles] = useState<File[]>([])
// //   const [sending, setSending] = useState(false)
// //   const [error, setError] = useState<string | null>(null)

// //   const buildTargets = useMemo(() => {
// //     const norm = (s: string) => s.trim()
// //     const to = norm(toEmail)
// //     const cc = norm(ccEmail)
// //     const bcc = norm(bccEmail)

// //     return {
// //       targets: to ? [{ kind: "EMAIL", value: to }] : [],
// //       ccTargets: cc ? [{ kind: "EMAIL", value: cc }] : [],
// //       bccTargets: bcc ? [{ kind: "EMAIL", value: bcc }] : [],
// //     }
// //   }, [toEmail, ccEmail, bccEmail])

// //   function isValidEmail(email: string) {
// //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
// //   }

// //   async function handleSend() {
// //     setError(null)

// //     if (!toEmail.trim()) return setError("To email is required")
// //     if (!isValidEmail(toEmail)) return setError("Enter a valid To email")
// //     if (ccEmail.trim() && !isValidEmail(ccEmail)) return setError("Enter a valid CC email")
// //     if (bccEmail.trim() && !isValidEmail(bccEmail)) return setError("Enter a valid BCC email")
// //     if (!subject.trim()) return setError("Subject is required")
// //     if (!body.trim()) return setError("Body is required")

// //     const form = new FormData()
// //     form.append("targets", JSON.stringify(buildTargets.targets))
// //     if (buildTargets.ccTargets.length) form.append("ccTargets", JSON.stringify(buildTargets.ccTargets))
// //     if (buildTargets.bccTargets.length) form.append("bccTargets", JSON.stringify(buildTargets.bccTargets))
// //     form.append("subject", subject)
// //     form.append("body", body)
// //     form.append("type", type)

// //     for (const f of files) form.append("attachments", f)

// //     try {
// //       setSending(true)
// //       await sendMessage(form)
// //       onSent()
// //     } catch (e: any) {
// //       setError(e.message || "Failed to send")
// //     } finally {
// //       setSending(false)
// //     }
// //   }

// //   return (
// //     <section className="bg-white flex flex-col min-w-0">
// //       <div className="h-12 px-4 border-b border-slate-200/70 flex items-center justify-between">
// //         <div className="text-sm font-semibold text-slate-900">New message</div>
// //         <button
// //           onClick={onClose}
// //           className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600"
// //           title="Close"
// //         >
// //           <FiX />
// //         </button>
// //       </div>

// //       <div className="p-5 space-y-4 overflow-y-auto">
// //         {error ? (
// //           <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
// //             {error}
// //           </div>
// //         ) : null}

// //         <div className="space-y-3">
// //           <div className="grid grid-cols-[56px_1fr] items-center gap-3">
// //             <label className="text-xs font-semibold text-slate-600">To</label>
// //             <input
// //               value={toEmail}
// //               onChange={(e) => setToEmail(e.target.value)}
// //               className="h-9 border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
// //               placeholder="type the mail address"
// //             />
// //           </div>

// //           <div className="grid grid-cols-[56px_1fr] items-center gap-3">
// //             <label className="text-xs font-semibold text-slate-600">CC</label>
// //             <input
// //               value={ccEmail}
// //               onChange={(e) => setCcEmail(e.target.value)}
// //               className="h-9 border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
// //               placeholder="optional"
// //             />
// //           </div>

// //           <div className="grid grid-cols-[56px_1fr] items-center gap-3">
// //             <label className="text-xs font-semibold text-slate-600">BCC</label>
// //             <input
// //               value={bccEmail}
// //               onChange={(e) => setBccEmail(e.target.value)}
// //               className="h-9 border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
// //               placeholder="optional"
// //             />
// //           </div>
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //           <div>
// //             <label className="text-xs font-semibold text-slate-600">Type</label>
// //             <select
// //               value={type}
// //               onChange={(e) => setType(e.target.value as MessageType)}
// //               className="mt-1 w-full h-9 border border-slate-200 px-3 text-sm bg-white"
// //             >
// //               {Object.keys(MESSAGE_TYPE_LABEL).map((k) => (
// //                 <option key={k} value={k}>
// //                   {MESSAGE_TYPE_LABEL[k as MessageType]}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           <div>
// //             <label className="text-xs font-semibold text-slate-600">Subject</label>
// //             <input
// //               value={subject}
// //               onChange={(e) => setSubject(e.target.value)}
// //               className="mt-1 w-full h-9  border border-slate-200 px-3 text-sm"
// //               placeholder="Add a subject"
// //             />
// //           </div>
// //         </div>

// //         <div>
// //           <label className="text-xs font-semibold text-slate-600">Message</label>
// //           <textarea
// //             value={body}
// //             onChange={(e) => setBody(e.target.value)}
// //             className="mt-1 w-full min-h-[240px] rounded-xl border border-slate-200 px-3 py-2 text-sm"
// //             placeholder="Write your message..."
// //           />
// //         </div>

// //         <div className="flex items-center gap-3">
// //           <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
// //             <FiPaperclip />
// //             <span>Attach</span>
// //             <input
// //               type="file"
// //               multiple
// //               className="hidden"
// //               onChange={(e) => setFiles(Array.from(e.target.files || []))}
// //             />
// //           </label>

// //           <div className="text-xs text-slate-500 truncate">
// //             {files.length ? `${files.length} file(s) selected` : "No attachments"}
// //           </div>
// //         </div>

// //         <div className="pt-2 flex items-center justify-end gap-2">
// //           <button
// //             onClick={onClose}
// //             className="h-7 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
// //           >
// //             Cancel
// //           </button>

// //           <button
// //             onClick={handleSend}
// //             disabled={sending}
// //             className="h-7 px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-60 inline-flex items-center gap-2"
// //           >
// //             <FiSend />
// //             {sending ? "Sending..." : "Send"}
// //           </button>
// //         </div>
// //       </div>
// //     </section>
// //   )
// // }






// // client/src/app/(dashboard)/teacher-dashboard/components/mail/ComposePanel.tsx
// "use client"

// import { useMemo, useState } from "react"
// import { FiPaperclip, FiSend, FiX } from "react-icons/fi"
// import type { MessageType } from "./types"
// import { MESSAGE_TYPE_LABEL } from "./types"
// import { sendMail, getCurrentUserRole, MailAPIError, type MessageTarget } from "../../../../../../lib/mail"

// export default function ComposePanel({
//   onClose,
//   onSent,
// }: {
//   onClose: () => void
//   onSent: () => void
// }) {
//   const [toEmail, setToEmail] = useState("")
//   const [ccEmail, setCcEmail] = useState("")
//   const [bccEmail, setBccEmail] = useState("")
//   const [type, setType] = useState<MessageType>("GENERAL")
//   const [subject, setSubject] = useState("")
//   const [body, setBody] = useState("")
//   const [files, setFiles] = useState<File[]>([])
//   const [sending, setSending] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const role = getCurrentUserRole()

//   const buildTargets = useMemo(() => {
//     const norm = (s: string) => s.trim()
//     const to = norm(toEmail)
//     const cc = norm(ccEmail)
//     const bcc = norm(bccEmail)

//     return {
//       targets: to ? [{ kind: "EMAIL" as const, value: to }] : [],
//       ccTargets: cc ? [{ kind: "EMAIL" as const, value: cc }] : [],
//       bccTargets: bcc ? [{ kind: "EMAIL" as const, value: bcc }] : [],
//     }
//   }, [toEmail, ccEmail, bccEmail])

//   function isValidEmail(email: string) {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
//   }

//   async function handleSend() {
//     setError(null)

//     if (!toEmail.trim()) return setError("To email is required")
//     if (!isValidEmail(toEmail)) return setError("Enter a valid To email")
//     if (ccEmail.trim() && !isValidEmail(ccEmail)) return setError("Enter a valid CC email")
//     if (bccEmail.trim() && !isValidEmail(bccEmail)) return setError("Enter a valid BCC email")
//     if (!subject.trim()) return setError("Subject is required")
//     if (!body.trim()) return setError("Body is required")

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

//       await sendMail(payload)

//       setToEmail("")
//       setCcEmail("")
//       setBccEmail("")
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
//       <div className="h-12 px-4 border-b border-slate-200/70 flex items-center justify-between">
//         <div className="text-sm font-semibold text-slate-900">New message</div>
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
//           <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         {role && (
//           <div className="text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
//             Sending as <span className="font-semibold text-slate-800">{role}</span>
//           </div>
//         )}

//         <div className="space-y-3">
//           <div className="grid grid-cols-[56px_1fr] items-center gap-3">
//             <label className="text-xs font-semibold text-slate-600">To</label>
//             <input
//               value={toEmail}
//               onChange={(e) => setToEmail(e.target.value)}
//               disabled={sending}
//               className="h-9 border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-50 disabled:opacity-60"
//               placeholder="recipient@example.com"
//             />
//           </div>

//           <div className="grid grid-cols-[56px_1fr] items-center gap-3">
//             <label className="text-xs font-semibold text-slate-600">CC</label>
//             <input
//               value={ccEmail}
//               onChange={(e) => setCcEmail(e.target.value)}
//               disabled={sending}
//               className="h-9 border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-50 disabled:opacity-60"
//               placeholder="optional"
//             />
//           </div>

//           <div className="grid grid-cols-[56px_1fr] items-center gap-3">
//             <label className="text-xs font-semibold text-slate-600">BCC</label>
//             <input
//               value={bccEmail}
//               onChange={(e) => setBccEmail(e.target.value)}
//               disabled={sending}
//               className="h-9 border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-50 disabled:opacity-60"
//               placeholder="optional"
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div>
//             <label className="text-xs font-semibold text-slate-600">Type</label>
//             <select
//               value={type}
//               onChange={(e) => setType(e.target.value as MessageType)}
//               disabled={sending}
//               className="mt-1 w-full h-9 border border-slate-200 px-3 text-sm bg-white disabled:bg-slate-50 disabled:opacity-60"
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
//               className="mt-1 w-full h-9 border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-50 disabled:opacity-60"
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
//           <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
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
//                   <div className="text-sm font-medium text-slate-900 truncate">{f.name}</div>
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
