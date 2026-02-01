// // //client\src\app\(dashboard)\student-dashboard\components\mail\MailViewer.tsx
// // "use client";

// // import { FiPaperclip, FiMoreHorizontal, FiTrash2, FiArchive, FiCornerUpLeft } from "react-icons/fi";
// // import type { StudentMail } from "./types";
// // import { formatDateCompact } from "./utils";

// // export default function MailViewer({ mail }: { mail: StudentMail | null }) {
// //   if (!mail) {
// //     return (
// //       <section className="bg-white flex items-center justify-center p-10">
// //         <div className="text-center">
// //           <p className="text-sm font-semibold text-slate-900">Select a mail</p>
// //           <p className="text-sm text-slate-500 mt-1">
// //             Pick an email from the queue to view it here.
// //           </p>
// //         </div>
// //       </section>
// //     );
// //   }

// //   return (
// //     <section className="bg-white flex flex-col min-w-0">
// //       {/* Top toolbar */}
// //       <div className="h-12 px-4 border-b border-slate-200/70 flex items-center justify-between">
// //         <div className="flex items-center gap-2">
// //           <button className="h-9 px-3 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center gap-2">
// //             <FiCornerUpLeft />
// //             Reply
// //           </button>
// //           <button className="h-9 px-3 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-700">
// //             Forward
// //           </button>
// //         </div>

// //         <div className="flex items-center gap-1">
// //           <button className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600">
// //             <FiArchive />
// //           </button>
// //           <button className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600">
// //             <FiTrash2 />
// //           </button>
// //           <button className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600">
// //             <FiMoreHorizontal />
// //           </button>
// //         </div>
// //       </div>

// //       {/* Header */}
// //       <div className="px-6 pt-5 pb-4 border-b border-slate-200/70">
// //         <div className="flex items-start justify-between gap-4">
// //           <div className="min-w-0">
// //             <h1 className="text-lg font-semibold text-slate-900">
// //               {mail.subject}
// //             </h1>
// //             <p className="text-sm text-slate-600 mt-1 truncate">
// //               <span className="font-semibold text-slate-900">{mail.fromName}</span>
// //               {mail.fromEmail ? <span className="text-slate-500"> • {mail.fromEmail}</span> : null}
// //             </p>
// //           </div>
// //           <div className="text-xs text-slate-500 whitespace-nowrap">
// //             {formatDateCompact(mail.createdAt)}
// //           </div>
// //         </div>

// //         {mail.important ? (
// //           <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-sm text-violet-800">
// //             This message is marked as important.
// //           </div>
// //         ) : null}
// //       </div>

// //       {/* Body */}
// //       <div className="flex-1 px-6 py-5 overflow-y-auto">
// //         <div className="whitespace-pre-line text-sm text-slate-700 leading-relaxed">
// //           {mail.body}
// //         </div>

// //         {/* Attachments */}
// //         {mail.attachments?.length ? (
// //           <div className="mt-7">
// //             <div className="flex items-center gap-2 mb-3">
// //               <FiPaperclip className="text-slate-500" />
// //               <p className="text-sm font-semibold text-slate-900">Attachments</p>
// //             </div>

// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
// //               {mail.attachments.map((a) => (
// //                 <div
// //                   key={a.id}
// //                   className="rounded-xl border border-slate-200 p-3 flex items-center justify-between"
// //                 >
// //                   <div className="min-w-0">
// //                     <p className="text-sm font-medium text-slate-900 truncate">{a.name}</p>
// //                     {a.sizeLabel ? <p className="text-xs text-slate-500">{a.sizeLabel}</p> : null}
// //                   </div>
// //                   <button className="text-sm font-semibold text-slate-900 hover:text-slate-700">
// //                     Download
// //                   </button>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         ) : null}
// //       </div>
// //     </section>
// //   );
// // }



// // client/src/app/(dashboard)/student-dashboard/components/mail/MailViewer.tsx
// "use client"

// import {
//   FiPaperclip,
//   FiMoreHorizontal,
//   FiTrash2,
//   FiArchive,
//   FiCornerUpLeft,
//   FiStar,
// } from "react-icons/fi"
// import type { StudentMail } from "./types"
// import { formatDateCompact } from "./utils"

// export default function MailViewer({
//   mail,
//   onReply,
//   onArchive,
//   onTrash,
//   onStar,
// }: {
//   mail: StudentMail | null
//   onReply: () => void
//   onArchive: () => void
//   onTrash: () => void
//   onStar: () => void
// }) {
//   if (!mail) {
//     return (
//       <section className="bg-white flex items-center justify-center p-10">
//         <div className="text-center">
//           <p className="text-sm font-semibold text-slate-900">Select a mail</p>
//           <p className="text-sm text-slate-500 mt-1">Pick an email from the queue to view it here.</p>
//         </div>
//       </section>
//     )
//   }

//   return (
//     <section className="bg-white flex flex-col min-w-0">
//       <div className="h-12 px-4 border-b border-slate-200/70 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <button
//             onClick={onReply}
//             className="h-9 px-3 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center gap-2"
//           >
//             <FiCornerUpLeft />
//             Reply
//           </button>
//           <button className="h-9 px-3 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-700">
//             Forward
//           </button>
//         </div>

//         <div className="flex items-center gap-1">
//           <button
//             onClick={onStar}
//             className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600"
//             title="Star"
//           >
//             <FiStar className={mail.starred ? "text-amber-500" : "text-slate-400"} />
//           </button>

//           <button
//             onClick={onArchive}
//             className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600"
//             title="Archive"
//           >
//             <FiArchive />
//           </button>
//           <button
//             onClick={onTrash}
//             className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600"
//             title="Trash"
//           >
//             <FiTrash2 />
//           </button>
//           <button className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600">
//             <FiMoreHorizontal />
//           </button>
//         </div>
//       </div>

//       <div className="px-6 pt-5 pb-4 border-b border-slate-200/70">
//         <div className="flex items-start justify-between gap-4">
//           <div className="min-w-0">
//             <h1 className="text-lg font-semibold text-slate-900">{mail.subject}</h1>

//             {mail.folder !== "sent" ? (
//               <p className="text-sm text-slate-600 mt-1 truncate">
//                 <span className="font-semibold text-slate-900">{mail.fromName}</span>
//                 {mail.fromEmail ? <span className="text-slate-500"> • {mail.fromEmail}</span> : null}
//               </p>
//             ) : null}
//           </div>

//           <div className="text-xs text-slate-500 whitespace-nowrap">{formatDateCompact(mail.createdAt)}</div>
//         </div>

//         {mail.important ? (
//           <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-sm text-violet-800">
//             This message is marked as important.
//           </div>
//         ) : null}
//       </div>

//       <div className="flex-1 px-6 py-5 overflow-y-auto">
//         <div className="whitespace-pre-line text-sm text-slate-700 leading-relaxed">{mail.body ?? ""}</div>

//         {mail.attachments?.length ? (
//           <div className="mt-7">
//             <div className="flex items-center gap-2 mb-3">
//               <FiPaperclip className="text-slate-500" />
//               <p className="text-sm font-semibold text-slate-900">Attachments</p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {mail.attachments.map((a) => (
//                 <a
//                   key={a.id}
//                   href={a.url}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="rounded-xl border border-slate-200 p-3 flex items-center justify-between hover:bg-slate-50"
//                 >
//                   <div className="min-w-0">
//                     <p className="text-sm font-medium text-slate-900 truncate">{a.name}</p>
//                     {a.sizeLabel ? <p className="text-xs text-slate-500">{a.sizeLabel}</p> : null}
//                   </div>
//                   <span className="text-sm font-semibold text-slate-900 hover:text-slate-700">Download</span>
//                 </a>
//               ))}
//             </div>
//           </div>
//         ) : null}
//       </div>
//     </section>
//   )
// }

