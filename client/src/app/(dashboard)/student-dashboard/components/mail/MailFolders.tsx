// // client/src/app/(dashboard)/student-dashboard/components/mail/MailFolders.tsx
// "use client"

// import { FiInbox, FiSend, FiFileText, FiTrash2, FiArchive, FiPlus } from "react-icons/fi"
// import type { MailFolderKey } from "./types"

// const items: { key: MailFolderKey; label: string; icon: any }[] = [
//   { key: "inbox", label: "Inbox", icon: FiInbox },
//   { key: "sent", label: "Sent", icon: FiSend },
//   { key: "drafts", label: "Drafts", icon: FiFileText },
//   { key: "archived", label: "Archive", icon: FiArchive },
//   { key: "trash", label: "Trash", icon: FiTrash2 },
// ]

// export default function MailFolders({
//   folder,
//   setFolder,
//   counts,
//   onCompose,
// }: {
//   folder: MailFolderKey
//   setFolder: (k: MailFolderKey) => void
//   counts: Record<MailFolderKey, number>
//   onCompose: () => void
// }) {
//   return (
//     <aside className="bg-white border-r border-slate-200/70 flex flex-col">
//       <div className="p-3">
//         <button
//           onClick={onCompose}
//           className="w-full h-9 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2"
//         >
//           <FiPlus />
//           Compose
//         </button>
//       </div>

//       <div className="px-3 pb-2">
//         <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Folders</p>
//       </div>

//       <nav className="px-2 pb-3 space-y-1">
//         {items.map((it) => {
//           const Icon = it.icon
//           const active = folder === it.key

//           return (
//             <button
//               key={it.key}
//               onClick={() => setFolder(it.key)}
//               className={[
//                 "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm transition",
//                 active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50",
//               ].join(" ")}
//             >
//               <span className="flex items-center gap-3 min-w-0">
//                 <Icon className="text-base opacity-90 shrink-0" />
//                 <span className="font-medium truncate">{it.label}</span>
//               </span>

//               <span
//                 className={[
//                   "text-[11px] font-semibold px-2 py-0.5 rounded-full",
//                   active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600",
//                 ].join(" ")}
//               >
//                 {counts[it.key] ?? 0}
//               </span>
//             </button>
//           )
//         })}
//       </nav>

//       <div className="mt-auto p-3 border-t border-slate-200/70">
//         <p className="text-[11px] text-slate-500">
//           Tip: Archive keeps mail but removes it from inbox.
//         </p>
//       </div>
//     </aside>
//   )
// }





// // "use client";

// // import {
// //   FiInbox,
// //   FiSend,
// //   FiFileText,
// //   FiTrash2,
// //   FiArchive,
// //   FiPlus,
// //   FiSettings,
// // } from "react-icons/fi";
// // import type { MailFolderKey } from "./types";

// // const items: { key: MailFolderKey; label: string; icon: any }[] = [
// //   { key: "inbox", label: "Inbox", icon: FiInbox },
// //   { key: "sent", label: "Sent", icon: FiSend },
// //   { key: "drafts", label: "Drafts", icon: FiFileText },
// //   { key: "archived", label: "Archived", icon: FiArchive },
// //   { key: "trash", label: "Trash", icon: FiTrash2 },
// // ];

// // export default function MailFolders({
// //   folder,
// //   setFolder,
// //   counts,
// //   onCompose,
// // }: {
// //   folder: MailFolderKey;
// //   setFolder: (k: MailFolderKey) => void;
// //   counts: Record<MailFolderKey, number>;
// //   onCompose: () => void;
// // }) {
// //   return (
// //     <aside className="bg-white border-r border-slate-200/70 flex flex-col">
// //       <div className="p-4">
// //         <button
// //           onClick={onCompose}
// //           className="w-full h-10 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2"
// //         >
// //           <FiPlus />
// //           Compose
// //         </button>

// //         <div className="mt-4">
// //           <p className="text-xs font-semibold text-slate-900">Mail</p>
// //           <p className="text-xs text-slate-500 mt-1">
// //             Student notifications & messages
// //           </p>
// //         </div>
// //       </div>

// //       <div className="px-4 pb-2">
// //         <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
// //           Folders
// //         </p>
// //       </div>

// //       <nav className="px-2 pb-4">
// //         {items.map((it) => {
// //           const Icon = it.icon;
// //           const active = folder === it.key;

// //           return (
// //             <button
// //               key={it.key}
// //               onClick={() => setFolder(it.key)}
// //               className={[
// //                 "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm transition",
// //                 active
// //                   ? "bg-slate-900 text-white shadow-sm"
// //                   : "text-slate-700 hover:bg-slate-50",
// //               ].join(" ")}
// //             >
// //               <span className="flex items-center gap-3">
// //                 <Icon className="text-base opacity-90" />
// //                 <span className="font-medium">{it.label}</span>
// //               </span>

// //               <span
// //                 className={[
// //                   "text-xs font-semibold px-2 py-0.5 rounded-full",
// //                   active
// //                     ? "bg-white/15 text-white"
// //                     : "bg-slate-100 text-slate-600",
// //                 ].join(" ")}
// //               >
// //                 {counts[it.key] ?? 0}
// //               </span>
// //             </button>
// //           );
// //         })}
// //       </nav>

// //       <div className="mt-auto p-4 border-t border-slate-200/70">
// //         <button className="w-full flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
// //           <FiSettings />
// //           Settings
// //         </button>
// //       </div>
// //     </aside>
// //   );
// // }
