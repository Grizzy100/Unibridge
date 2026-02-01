// //client\components\mail\MailViewer.tsx
// "use client"

// import {
//   FiPaperclip,
//   FiTrash2,
//   FiArchive,
//   FiCornerUpLeft,
//   FiStar,
//   FiInbox,
//   FiRotateCcw,
// } from "react-icons/fi"
// import type { Mail, MailFolderKey } from "./types"
// import { formatDateCompact } from "./utils"

// interface MailViewerProps {
//   mail: Mail | null
//   currentFolder: MailFolderKey
//   onReply: () => void
//   onMoveToFolder: (targetFolder: MailFolderKey) => void
//   onPermanentDelete: () => void
//   onStar: () => void
// }

// export default function MailViewer({
//   mail,
//   currentFolder,
//   onReply,
//   onMoveToFolder,
//   onPermanentDelete,
//   onStar,
// }: MailViewerProps) {
//   if (!mail) {
//     return (
//       <section className="bg-white flex items-center justify-center p-10">
//         <div className="text-center">
//           <p className="text-sm font-semibold text-slate-900">Select a mail</p>
//           <p className="text-sm text-slate-500 mt-1">
//             Pick an email from the queue to view it here.
//           </p>
//         </div>
//       </section>
//     )
//   }

//   /** 
//    * If current user is the sender → Sent view
//    * If current user is the receiver → Inbox view
//    */
//   const isSent = mail.recipientType === "SENDER"

//   // Build "To:" line for Sent mails
//   const toLine =
//     mail.to && mail.to.length > 0
//       ? mail.to
//           .map((r) =>
//             r.email ? `${r.name} · ${r.email}` : r.name
//           )
//           .join(", ")
//       : "Unknown recipient"

//   // Dynamic button visibility based on current folder
//   const showArchive = currentFolder === "inbox" || currentFolder === "sent"
//   const showUnarchive = currentFolder === "archived"
//   const showMoveToTrash = currentFolder !== "trash"
//   const showRestore = currentFolder === "trash"
//   const showPermanentDelete = currentFolder === "trash"

//   return (
//     <section className="bg-white flex flex-col min-w-0">
//       {/* Top toolbar */}
//       <div className="h-12 px-4 border-b border-slate-200 flex items-center justify-between">
//         <button
//           onClick={onReply}
//           className="h-9 px-3 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center gap-2"
//         >
//           <FiCornerUpLeft />
//           Reply
//         </button>

//         <div className="flex items-center gap-1">
//           {/* Star button */}
//           <button
//             onClick={onStar}
//             className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center"
//             title={mail.starred ? "Unstar" : "Star"}
//           >
//             <FiStar
//               className={
//                 mail.starred
//                   ? "text-amber-500 fill-amber-500"
//                   : "text-slate-400"
//               }
//             />
//           </button>

//           {/* Archive button (show in inbox/sent) */}
//           {showArchive && (
//             <button
//               onClick={() => onMoveToFolder("archived")}
//               className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600"
//               title="Archive"
//             >
//               <FiArchive />
//             </button>
//           )}

//           {/* Unarchive button (show in archive) */}
//           {showUnarchive && (
//             <button
//               onClick={() => onMoveToFolder("inbox")}
//               className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center text-blue-600"
//               title="Move to Inbox"
//             >
//               <FiInbox />
//             </button>
//           )}

//           {/* Restore button (show in trash) */}
//           {showRestore && (
//             <button
//               onClick={() => onMoveToFolder("inbox")}
//               className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center text-green-600"
//               title="Restore to Inbox"
//             >
//               <FiRotateCcw />
//             </button>
//           )}

//           {/* Move to trash button (show everywhere except trash) */}
//           {showMoveToTrash && (
//             <button
//               onClick={() => onMoveToFolder("trash")}
//               className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600"
//               title="Move to Trash"
//             >
//               <FiTrash2 />
//             </button>
//           )}

//           {/* Permanent delete button (show only in trash) */}
//           {showPermanentDelete && (
//             <button
//               onClick={onPermanentDelete}
//               className="h-9 px-3 rounded-xl hover:bg-red-50 text-sm font-medium text-red-600 flex items-center gap-2 border border-red-200"
//               title="Delete Forever"
//             >
//               <FiTrash2 />
//               Delete Forever
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Header */}
//       <div className="px-6 pt-5 pb-4 border-b border-slate-200">
//         <div className="flex items-start justify-between gap-4">
//           <div className="min-w-0">
//             {/* Subject */}
//             <h1 className="text-lg font-semibold text-slate-900">
//               {mail.subject}
//             </h1>

//             {/* Sender / Recipient */}
//             <p className="text-sm text-slate-600 mt-1 truncate">
//               {isSent ? (
//                 <span className="font-semibold text-slate-900">
//                   To: {toLine}
//                 </span>
//               ) : (
//                 <>
//                   <span className="font-semibold text-slate-900">
//                     {mail.fromName}
//                   </span>
//                   {mail.fromEmail && (
//                     <span className="text-slate-500">
//                       {" "}
//                       · {mail.fromEmail}
//                     </span>
//                   )}
//                 </>
//               )}
//             </p>
//           </div>

//           <div className="text-xs text-slate-500 whitespace-nowrap">
//             {formatDateCompact(mail.createdAt)}
//           </div>
//         </div>

//         {mail.important && (
//           <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-sm text-violet-800">
//             ⚠️ This message is marked as important.
//           </div>
//         )}
//       </div>

//       {/* Body */}
//       <div className="flex-1 px-6 py-5 overflow-y-auto">
//         <div className="whitespace-pre-line text-sm text-slate-700 leading-relaxed">
//           {mail.body}
//         </div>

//         {/* Attachments */}
//         {mail.attachments && mail.attachments.length > 0 && (
//           <div className="mt-7">
//             <div className="flex items-center gap-2 mb-3">
//               <FiPaperclip className="text-slate-500" />
//               <p className="text-sm font-semibold text-slate-900">
//                 Attachments ({mail.attachments.length})
//               </p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {mail.attachments.map((attachment) => (
//                 <a
//                   key={attachment.id}
//                   href={attachment.url}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="rounded-xl border border-slate-200 p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
//                 >
//                   <div className="min-w-0">
//                     <p className="text-sm font-medium text-slate-900 truncate">
//                       {attachment.name}
//                     </p>
//                     {attachment.sizeLabel && (
//                       <p className="text-xs text-slate-500">
//                         {attachment.sizeLabel}
//                       </p>
//                     )}
//                   </div>
//                   <span className="text-sm font-semibold text-slate-900 ml-2">
//                     ↓
//                   </span>
//                 </a>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   )
// }








//client\components\mail\MailViewer.tsx
"use client"

import {
  FiPaperclip,
  FiTrash2,
  FiArchive,
  FiCornerUpLeft,
  FiStar,
} from "react-icons/fi"
import type { Mail } from "./types"
import { formatDateCompact } from "./utils"

interface MailViewerProps {
  mail: Mail | null
  onReply: () => void
  onArchive: () => void
  onTrash: () => void
  onStar: () => void
}

export default function MailViewer({
  mail,
  onReply,
  onArchive,
  onTrash,
  onStar,
}: MailViewerProps) {
  if (!mail) {
    return (
      <section className="bg-white flex items-center justify-center p-10">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-900">Select a mail</p>
          <p className="text-sm text-slate-500 mt-1">
            Pick an email from the queue to view it here.
          </p>
        </div>
      </section>
    )
  }

  /** 
   * If current user is the sender → Sent view
   * If current user is the receiver → Inbox view
   */
  const isSent = mail.recipientType === "SENDER"

  // Build "To:" line for Sent mails
  const toLine =
    mail.to && mail.to.length > 0
      ? mail.to
          .map((r) =>
            r.email ? `${r.name} · ${r.email}` : r.name
          )
          .join(", ")
      : "Unknown recipient"

  return (
    <section className="bg-white flex flex-col min-w-0">
      {/* Top toolbar */}
      <div className="h-12 px-4 border-b border-slate-200 flex items-center justify-between">
        <button
          onClick={onReply}
          className="h-9 px-3 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-700 flex items-center gap-2"
        >
          <FiCornerUpLeft />
          Reply
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={onStar}
            className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center"
            title={mail.starred ? "Unstar" : "Star"}
          >
            <FiStar
              className={
                mail.starred
                  ? "text-amber-500 fill-amber-500"
                  : "text-slate-400"
              }
            />
          </button>

          <button
            onClick={onArchive}
            className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center"
            title="Archive"
          >
            <FiArchive />
          </button>

          <button
            onClick={onTrash}
            className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center"
            title="Move to Trash"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {/* Subject */}
            <h1 className="text-lg font-semibold text-slate-900">
              {mail.subject}
            </h1>

            {/* Sender / Recipient */}
            <p className="text-sm text-slate-600 mt-1 truncate">
              {isSent ? (
                <span className="font-semibold text-slate-900">
                  To: {toLine}
                </span>
              ) : (
                <>
                  <span className="font-semibold text-slate-900">
                    {mail.fromName}
                  </span>
                  {mail.fromEmail && (
                    <span className="text-slate-500">
                      {" "}
                      · {mail.fromEmail}
                    </span>
                  )}
                </>
              )}
            </p>
          </div>

          <div className="text-xs text-slate-500 whitespace-nowrap">
            {formatDateCompact(mail.createdAt)}
          </div>
        </div>

        {mail.important && (
          <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-sm text-violet-800">
            ⚠️ This message is marked as important.
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-5 overflow-y-auto">
        <div className="whitespace-pre-line text-sm text-slate-700 leading-relaxed">
          {mail.body}
        </div>

        {/* Attachments */}
        {mail.attachments && mail.attachments.length > 0 && (
          <div className="mt-7">
            <div className="flex items-center gap-2 mb-3">
              <FiPaperclip className="text-slate-500" />
              <p className="text-sm font-semibold text-slate-900">
                Attachments ({mail.attachments.length})
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mail.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-200 p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {attachment.name}
                    </p>
                    {attachment.sizeLabel && (
                      <p className="text-xs text-slate-500">
                        {attachment.sizeLabel}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-900 ml-2">
                    ↓
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}









