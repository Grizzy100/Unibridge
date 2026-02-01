// //client\src\app\(dashboard)\student-dashboard\components\mail\MailSpace.tsx
// "use client"

// import { useEffect, useMemo, useState } from "react"
// import MailFolders from "./MailFolders"
// import MailQueue from "./MailQueue"
// import MailViewer from "./MailViewer"
// import type { MailFolderKey, MessageType, StudentMail } from "./types"
// import { fetchFolder, toggleStar } from "../../../../../../lib/mail"

// export default function MailSpace() {
//   const [folder, setFolder] = useState<MailFolderKey>("inbox")
//   const [type, setType] = useState<MessageType>("GENERAL")
//   const [query, setQuery] = useState("")
//   const [activeId, setActiveId] = useState<string | null>(null)

//   const [loading, setLoading] = useState(false)
//   const [mails, setMails] = useState<StudentMail[]>([])
//   const [counts, setCounts] = useState<Record<MailFolderKey, number>>({
//     inbox: 0,
//     sent: 0,
//     drafts: 0,
//     trash: 0,
//     archived: 0,
//   })

//   async function loadFolderCounts() {
//     // simplest approach: fetch first page of each folder and use count from API
//     // if your API returns totalCount, use that.
//     const folders: MailFolderKey[] = ["inbox", "sent", "drafts", "trash", "archived"]
//     const nextCounts: Record<MailFolderKey, number> = { ...counts }

//     await Promise.all(
//       folders.map(async (f) => {
//         try {
//           const res = await fetchFolder(f, { page: 1, limit: 1, type: type === "GENERAL" ? undefined : type })
//           // IMPORTANT: change below depending on your API response fields
//           // Prefer server count if available
//           const total =
//             (res as any)?.data?.total ??
//             (res as any)?.data?.count ??
//             (res as any)?.data?.pagination?.total ??
//             (res as any)?.data?.messages?.length ??
//             0
//           nextCounts[f] = Number(total) || 0
//         } catch {
//           nextCounts[f] = 0
//         }
//       })
//     )

//     setCounts(nextCounts)
//   }

//   async function loadCurrentFolder() {
//     setLoading(true)
//     try {
//       const res = await fetchFolder(folder, {
//         page: 1,
//         limit: 20,
//         q: query || undefined,
//         type: type === "GENERAL" ? undefined : type,
//       })

//       // IMPORTANT: adapt based on your API shape
//       const list =
//         (res as any)?.data?.messages ??
//         (res as any)?.data?.data ??
//         (res as any)?.data ??
//         []

//       setMails(list as StudentMail[])
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     setActiveId(null) // viewer should be empty when folder/type changes
//     loadCurrentFolder()
//     loadFolderCounts()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [folder, type])

//   useEffect(() => {
//     const t = setTimeout(() => {
//       loadCurrentFolder()
//     }, 300)
//     return () => clearTimeout(t)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [query])

//   const activeMail = useMemo(() => {
//     if (!activeId) return null
//     return mails.find((m) => m.id === activeId) ?? null
//   }, [activeId, mails])

//   async function handleToggleStar(id: string) {
//     try {
//       await toggleStar(id)
//       await loadCurrentFolder()
//       await loadFolderCounts()
//     } catch {}
//   }

//   return (
//     <div className="h-full bg-white overflow-hidden">
//       <div className="grid grid-cols-1 lg:grid-cols-[280px_420px_1fr] h-full">
//         <MailFolders
//           folder={folder}
//           setFolder={(k) => {
//             setFolder(k)
//             setActiveId(null)
//           }}
//           counts={counts}
//           onCompose={() => {
//             // hook this to your compose modal later
//           }}
//         />

//         <MailQueue
//           folder={folder}
//           mails={mails}
//           query={query}
//           setQuery={setQuery}
//           activeId={activeId}
//           onSelect={(id) => setActiveId(id)}
//           type={type}
//           setType={setType}
//           onToggleStar={handleToggleStar}
//           loading={loading}
//         />

//         <MailViewer
//           mail={activeMail}
//           onReply={() => {}}
//           onArchive={() => {}}
//           onTrash={() => {}}
//           onStar={() => {
//             if (activeMail) handleToggleStar(activeMail.id)
//           }}
//         />
//       </div>
//     </div>
//   )
// }

