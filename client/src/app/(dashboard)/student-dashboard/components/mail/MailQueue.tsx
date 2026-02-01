// // client/src/app/(dashboard)/student-dashboard/components/mail/MailQueue.tsx
// "use client"

// import { FiSearch, FiStar } from "react-icons/fi"
// import type { MailFolderKey, MessageType, StudentMail } from "./types"
// import { formatDateCompact, initials } from "./utils"
// import TypeTabs from "./TypeTabs"

// export default function MailQueue({
//   folder,
//   mails,
//   query,
//   setQuery,
//   activeId,
//   onSelect,
//   type,
//   setType,
//   onToggleStar,
//   loading,
// }: {
//   folder: MailFolderKey
//   mails: StudentMail[]
//   query: string
//   setQuery: (v: string) => void
//   activeId: string | null
//   onSelect: (id: string) => void
//   type: MessageType
//   setType: (t: MessageType) => void
//   onToggleStar: (id: string) => void
//   loading?: boolean
// }) {
//   return (
//     <section className="bg-white border-r border-slate-200/70 min-w-0 flex flex-col">
//       <div className="px-4 pt-4 pb-3 border-b border-slate-200/70">
//         <div className="flex items-end justify-between">
//           <div>
//             <h2 className="text-base font-semibold text-slate-900 capitalize">{folder}</h2>
//             <p className="text-xs text-slate-500">{mails.length} messages</p>
//           </div>
//         </div>

//         <div className="mt-3">
//           <TypeTabs type={type} setType={setType} />
//         </div>

//         <div className="mt-3 relative">
//           <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search mails..."
//             className="w-full pl-9 pr-3 h-10 border border-slate-200 bg-slate-50 text-sm
//             focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-200 transition"
//           />
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         {loading ? (
//           <div className="p-4 space-y-3">
//             {Array.from({ length: 8 }).map((_, i) => (
//               <div key={i} className="rounded-xl border border-slate-100 p-3">
//                 <div className="flex items-center gap-3">
//                   <div className="h-9 w-9 rounded-full bg-slate-200" />
//                   <div className="min-w-0 flex-1">
//                     <div className="h-3 w-32 bg-slate-200 rounded" />
//                     <div className="h-3 w-48 bg-slate-200 rounded mt-2" />
//                     <div className="h-3 w-64 bg-slate-200 rounded mt-2" />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : mails.length === 0 ? (
//           <div className="p-6 text-sm text-slate-500">No mails found.</div>
//         ) : (
//           mails.map((m) => {
//             const active = m.id === activeId

//             const isSentFolder = folder === "sent"
//             const hideSenderName = m.recipientType === "SENDER" && isSentFolder

//             const displayName = hideSenderName ? "" : m.fromName
//             const displayInitials = hideSenderName ? "" : m.fromName

//             return (
//               <div
//                 key={m.id}
//                 className={[
//                   "relative w-full text-left px-4 py-3 border-b border-slate-100 transition",
//                   active ? "bg-slate-50" : "hover:bg-slate-50/60",
//                 ].join(" ")}
//               >
//                 <button onClick={() => onSelect(m.id)} className="w-full text-left">
//                   <div className="flex gap-3">
//                     <div className="pt-2">
//                       <div
//                         className={[
//                           "h-2 w-2 rounded-full",
//                           m.unread ? "bg-blue-500" : "bg-transparent",
//                         ].join(" ")}
//                       />
//                     </div>

//                     <div className="h-9 w-9 rounded-full bg-slate-900/10 flex items-center justify-center text-slate-700 text-xs font-semibold">
//                       {initials(displayInitials)}
//                     </div>

//                     <div className="min-w-0 flex-1 pr-10">
//                       <div className="flex items-center justify-between gap-2">
//                         <p
//                           className={[
//                             "text-sm truncate",
//                             m.unread ? "font-semibold text-slate-900" : "font-medium text-slate-800",
//                           ].join(" ")}
//                         >
//                           {displayName}
//                         </p>
//                         <p className="text-xs text-slate-500">{formatDateCompact(m.createdAt)}</p>
//                       </div>

//                       <p className="text-sm font-semibold text-slate-900 truncate mt-0.5">{m.subject}</p>
//                       <p className="text-xs text-slate-500 truncate mt-0.5">{m.preview}</p>

//                       {m.important ? (
//                         <span className="inline-flex mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
//                           Important
//                         </span>
//                       ) : null}
//                     </div>
//                   </div>
//                 </button>

//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     onToggleStar(m.id)
//                   }}
//                   className="absolute right-3 top-4 h-9 w-9 rounded-xl hover:bg-slate-100 flex items-center justify-center"
//                   title="Star"
//                 >
//                   <FiStar className={m.starred ? "text-amber-500" : "text-slate-300"} />
//                 </button>
//               </div>
//             )
//           })
//         )}
//       </div>
//     </section>
//   )
// }









// // "use client"

// // import { FiSearch, FiStar } from "react-icons/fi"
// // import type { MailFolderKey, MessageType, StudentMail } from "./types"
// // import { formatDateCompact, initials } from "./utils"
// // import TypeTabs from "./TypeTabs"

// // export default function MailQueue({
// //   folder,
// //   mails,
// //   query,
// //   setQuery,
// //   activeId,
// //   onSelect,
// //   type,
// //   setType,
// //   onToggleStar,
// //   loading,
// // }: {
// //   folder: MailFolderKey
// //   mails: StudentMail[]
// //   query: string
// //   setQuery: (v: string) => void
// //   activeId: string | null
// //   onSelect: (id: string) => void
// //   type: MessageType
// //   setType: (t: MessageType) => void
// //   onToggleStar: (id: string) => void
// //   loading?: boolean
// // }) {
// //   return (
// //     <section className="bg-white border-r border-slate-200/70 min-w-0 flex flex-col">
// //       <div className="px-4 pt-4 pb-3 border-b border-slate-200/70">
// //         <div className="flex items-end justify-between">
// //           <div>
// //             <h2 className="text-base font-semibold text-slate-900 capitalize">{folder}</h2>
// //             <p className="text-xs text-slate-500">{mails.length} messages</p>
// //           </div>
// //         </div>

// //         <div className="mt-3">
// //           <TypeTabs type={type} setType={setType} />
// //         </div>

// //         <div className="mt-3 relative">
// //           <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
// //           <input
// //             value={query}
// //             onChange={(e) => setQuery(e.target.value)}
// //             placeholder="Search mails..."
// //             className="w-full pl-9 pr-3 h-10  border border-slate-200 bg-slate-50 text-sm
// //             focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-200 transition"
// //           />
// //         </div>
// //       </div>

// //       <div className="flex-1 overflow-y-auto">
// //         {loading ? (
// //           <div className="p-4 space-y-3">
// //             {Array.from({ length: 8 }).map((_, i) => (
// //               <div key={i} className="rounded-xl border border-slate-100 p-3">
// //                 <div className="flex items-center gap-3">
// //                   <div className="h-9 w-9 rounded-full bg-slate-200" />
// //                   <div className="min-w-0 flex-1">
// //                     <div className="h-3 w-32 bg-slate-200 rounded" />
// //                     <div className="h-3 w-48 bg-slate-200 rounded mt-2" />
// //                     <div className="h-3 w-64 bg-slate-200 rounded mt-2" />
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         ) : mails.length === 0 ? (
// //           <div className="p-6 text-sm text-slate-500">No mails found.</div>
// //         ) : (
// //           mails.map((m) => {
// //             const active = m.id === activeId

// //             return (
// //               <div
// //                 key={m.id}
// //                 className={[
// //                   "relative w-full text-left px-4 py-3 border-b border-slate-100 transition",
// //                   active ? "bg-slate-50" : "hover:bg-slate-50/60",
// //                 ].join(" ")}
// //               >
// //                 <button onClick={() => onSelect(m.id)} className="w-full text-left">
// //                   <div className="flex gap-3">
// //                     <div className="pt-2">
// //                       <div className={["h-2 w-2 rounded-full", m.unread ? "bg-blue-500" : "bg-transparent"].join(" ")} />
// //                     </div>

// //                     <div className="h-9 w-9 rounded-full bg-slate-900/10 flex items-center justify-center text-slate-700 text-xs font-semibold">
// //                       {initials(m.fromName)}
// //                     </div>

// //                     <div className="min-w-0 flex-1 pr-10">
// //                       <div className="flex items-center justify-between gap-2">
// //                         <p
// //                           className={[
// //                             "text-sm truncate",
// //                             m.unread ? "font-semibold text-slate-900" : "font-medium text-slate-800",
// //                           ].join(" ")}
// //                         >
// //                           {m.fromName}
// //                         </p>
// //                         <p className="text-xs text-slate-500">{formatDateCompact(m.createdAt)}</p>
// //                       </div>

// //                       <p className="text-sm font-semibold text-slate-900 truncate mt-0.5">{m.subject}</p>
// //                       <p className="text-xs text-slate-500 truncate mt-0.5">{m.preview}</p>

// //                       {m.important ? (
// //                         <span className="inline-flex mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
// //                           Important
// //                         </span>
// //                       ) : null}
// //                     </div>
// //                   </div>
// //                 </button>

// //                 <button
// //                   onClick={(e) => {
// //                     e.stopPropagation()
// //                     onToggleStar(m.id)
// //                   }}
// //                   className="absolute right-3 top-4 h-9 w-9 rounded-xl hover:bg-slate-100 flex items-center justify-center"
// //                   title="Star"
// //                 >
// //                   <FiStar className={m.starred ? "text-amber-500" : "text-slate-300"} />
// //                 </button>
// //               </div>
// //             )
// //           })
// //         )}
// //       </div>
// //     </section>
// //   )
// // }
