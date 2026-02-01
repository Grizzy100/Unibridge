// // // // client/src/app/(dashboard)/student-dashboard/components/mail/MailWorkspace.tsx
// // // "use client";

// // // import { useEffect, useMemo, useState } from "react";
// // // import MailFolders from "./MailFolders";
// // // import MailQueue from "./MailQueue";
// // // import MailViewer from "./MailViewer";
// // // import ComposePanel from "./ComposePanel";

// // // import type { MailFolderKey, MessageType, StudentMail } from "./types";
// // // import { fetchFolder, fetchMessageById, markRead, moveToArchive, moveToTrash, toggleStar } from "../../../../../../lib/mail";
// // // import { mapFolderResponseToList, mapMessageToDetail } from "./map";

// // // type ViewMode = "READ" | "COMPOSE";

// // // export default function MailWorkspace() {
// // //   const [folder, setFolder] = useState<MailFolderKey>("inbox");
// // //   const [type, setType] = useState<MessageType>("GENERAL");
// // //   const [query, setQuery] = useState("");
// // //   const [activeId, setActiveId] = useState<string | null>(null);
// // //   const [viewMode, setViewMode] = useState<ViewMode>("READ");

// // //   // Replace with your real userId source (token decode or auth context).
// // //   const currentUserId = "me";

// // //   // Folder data
// // //   const [loading, setLoading] = useState(false);
// // //   const [list, setList] = useState<StudentMail[]>([]);
// // //   const [counts, setCounts] = useState<Record<MailFolderKey, number>>({
// // //     inbox: 0,
// // //     sent: 0,
// // //     drafts: 0,
// // //     trash: 0,
// // //     archived: 0,
// // //   });

// // //   // Active detail
// // //   const [activeDetail, setActiveDetail] = useState<StudentMail | null>(null);
// // //   const [detailLoading, setDetailLoading] = useState(false);

// // //   // Client-side filter (instant) while backend q/type is not implemented everywhere
// // //   const locallyFiltered = useMemo(() => {
// // //     const q = query.trim().toLowerCase();
// // //     return list.filter((m) => {
// // //       if (type !== "GENERAL" && m.type !== type) return false;
// // //       if (!q) return true;
// // //       return (
// // //         m.subject.toLowerCase().includes(q) ||
// // //         m.preview.toLowerCase().includes(q) ||
// // //         m.fromName.toLowerCase().includes(q)
// // //       );
// // //     });
// // //   }, [list, query, type]);

// // //   const activeMail = useMemo(() => {
// // //     if (!locallyFiltered.length) return null;
// // //     if (activeId) return locallyFiltered.find((m) => m.id === activeId) ?? locallyFiltered[0];
// // //     return locallyFiltered[0];
// // //   }, [locallyFiltered, activeId]);

// // //   // Load folder list
// // //   useEffect(() => {
// // //     let ignore = false;

// // //     async function load() {
// // //       setLoading(true);
// // //       try {
// // //         const res = await fetchFolder(folder, { page: 1, limit: 50 /* , q: query, type */ });
// // //         const mapped = mapFolderResponseToList(res.data, currentUserId);
// // //         if (ignore) return;

// // //         setList(mapped.items);

// // //         // quick counts from local data (later replace with /counts)
// // //         const nextCounts: Record<MailFolderKey, number> = {
// // //           inbox: 0,
// // //           sent: 0,
// // //           drafts: 0,
// // //           trash: 0,
// // //           archived: 0,
// // //         };
// // //         for (const it of mapped.items) nextCounts[it.folder]++;
// // //         setCounts((prev) => ({ ...prev, ...nextCounts }));
// // //       } catch (e) {
// // //         // you can hook toast here
// // //         console.error(e);
// // //         if (!ignore) setList([]);
// // //       } finally {
// // //         if (!ignore) setLoading(false);
// // //       }
// // //     }

// // //     load();
// // //     return () => {
// // //       ignore = true;
// // //     };
// // //   }, [folder]);

// // //   // Load active detail when selection changes
// // //   useEffect(() => {
// // //     let ignore = false;

// // //     async function loadDetail() {
// // //       if (!activeMail?.id) {
// // //         setActiveDetail(null);
// // //         return;
// // //       }
// // //       setDetailLoading(true);
// // //       try {
// // //         const res = await fetchMessageById(activeMail.id);
// // //         const mapped = mapMessageToDetail(res.data, currentUserId);
// // //         if (ignore) return;
// // //         setActiveDetail(mapped);

// // //         // Mark as read when opened (best mail UX)
// // //         if (mapped.unread) {
// // //           try {
// // //             await markRead(mapped.id);
// // //             // update local list state
// // //             setList((prev) =>
// // //               prev.map((x) => (x.id === mapped.id ? { ...x, unread: false } : x))
// // //             );
// // //           } catch {}
// // //         }
// // //       } catch (e) {
// // //         console.error(e);
// // //         if (!ignore) setActiveDetail(null);
// // //       } finally {
// // //         if (!ignore) setDetailLoading(false);
// // //       }
// // //     }

// // //     if (viewMode === "READ") loadDetail();
// // //     return () => {
// // //       ignore = true;
// // //     };
// // //   }, [activeMail?.id, viewMode]);

// // //   function handleCompose() {
// // //     setViewMode("COMPOSE");
// // //     setActiveId(null);
// // //   }

// // //   function handleSelect(id: string) {
// // //     setActiveId(id);
// // //     setViewMode("READ");
// // //   }

// // //   async function handleToggleStar(id: string) {
// // //     // optimistic UI
// // //     setList((prev) => prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)));
// // //     try {
// // //       await toggleStar(id);
// // //     } catch (e) {
// // //       // rollback
// // //       setList((prev) => prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)));
// // //     }
// // //   }

// // //   async function handleArchive() {
// // //     if (!activeMail?.id) return;
// // //     await moveToArchive(activeMail.id);
// // //     setList((prev) => prev.filter((m) => m.id !== activeMail.id));
// // //     setActiveId(null);
// // //   }

// // //   async function handleTrash() {
// // //     if (!activeMail?.id) return;
// // //     await moveToTrash(activeMail.id);
// // //     setList((prev) => prev.filter((m) => m.id !== activeMail.id));
// // //     setActiveId(null);
// // //   }

// // //   return (
// // //     <div className="h-full rounded-2xl border border-slate-200 bg-white overflow-hidden">
// // //       <div className="grid grid-cols-1 lg:grid-cols-[280px_420px_1fr] h-full">
// // //         <MailFolders
// // //           folder={folder}
// // //           setFolder={(k) => {
// // //             setFolder(k);
// // //             setType("GENERAL");
// // //             setQuery("");
// // //             setActiveId(null);
// // //             setViewMode("READ");
// // //           }}
// // //           counts={counts}
// // //           onCompose={handleCompose}
// // //         />

// // //         <MailQueue
// // //           folder={folder}
// // //           mails={locallyFiltered}
// // //           query={query}
// // //           setQuery={setQuery}
// // //           activeId={activeMail?.id ?? null}
// // //           onSelect={handleSelect}
// // //           type={type}
// // //           setType={setType}
// // //           onToggleStar={handleToggleStar}
// // //         />

// // //         {viewMode === "COMPOSE" ? (
// // //           <ComposePanel
// // //             onClose={() => setViewMode("READ")}
// // //             onSent={() => {
// // //               setViewMode("READ");
// // //               setFolder("sent");
// // //             }}
// // //           />
// // //         ) : (
// // //           <MailViewer
// // //             mail={detailLoading ? (activeMail ? { ...activeMail, body: "Loading..." } : null) : activeDetail}
// // //             onReply={() => setViewMode("COMPOSE")}
// // //             onArchive={handleArchive}
// // //             onTrash={handleTrash}
// // //             onStar={() => {
// // //               if (activeMail?.id) handleToggleStar(activeMail.id);
// // //             }}
// // //           />
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }




// // //client\src\app\(dashboard)\student-dashboard\components\mail\MailWorkspace.tsx
// // "use client"

// // import { useEffect, useMemo, useState } from "react"
// // import MailFolders from "./MailFolders"
// // import MailQueue from "./MailQueue"
// // import MailViewer from "./MailViewer"
// // import ComposePanel from "./ComposePanel"

// // import type { MailFolderKey, MessageType, StudentMail } from "./types"
// // import {
// //   fetchFolder,
// //   fetchMessageById,
// //   markRead,
// //   moveToArchive,
// //   moveToTrash,
// //   toggleStar,
// // } from "../../../../../../lib/mail"
// // import { mapFolderResponseToList, mapMessageToDetail } from "./map"
// // import { getUser } from "../../../../../../lib/auth"

// // type ViewMode = "READ" | "COMPOSE"

// // export default function MailWorkspace() {
// //   const [folder, setFolder] = useState<MailFolderKey>("inbox")
// //   const [type, setType] = useState<MessageType>("GENERAL")
// //   const [query, setQuery] = useState("")
// //   const [activeId, setActiveId] = useState<string | null>(null)
// //   const [viewMode, setViewMode] = useState<ViewMode>("READ")

// //   const [currentUserId, setCurrentUserId] = useState<string>("")

// //   const [loading, setLoading] = useState(false)
// //   const [list, setList] = useState<StudentMail[]>([])
// //   const [counts, setCounts] = useState<Record<MailFolderKey, number>>({
// //     inbox: 0,
// //     sent: 0,
// //     drafts: 0,
// //     trash: 0,
// //     archived: 0,
// //   })

// //   const [activeDetail, setActiveDetail] = useState<StudentMail | null>(null)
// //   const [detailLoading, setDetailLoading] = useState(false)

// //   useEffect(() => {
// //     const u = getUser()
// //     setCurrentUserId(u?.id || "")
// //   }, [])

// //   const locallyFiltered = useMemo(() => {
// //     const q = query.trim().toLowerCase()
// //     return list.filter((m) => {
// //       if (type !== "GENERAL" && m.type !== type) return false
// //       if (!q) return true
// //       return (
// //         m.subject.toLowerCase().includes(q) ||
// //         m.preview.toLowerCase().includes(q) ||
// //         m.fromName.toLowerCase().includes(q)
// //       )
// //     })
// //   }, [list, query, type])

// //   const activeMail = useMemo(() => {
// //     if (!locallyFiltered.length) return null
// //     if (activeId) return locallyFiltered.find((m) => m.id === activeId) ?? locallyFiltered[0]
// //     return locallyFiltered[0]
// //   }, [locallyFiltered, activeId])

// //   useEffect(() => {
// //     let ignore = false

// //     async function load() {
// //       if (!currentUserId) return
// //       setLoading(true)
// //       try {
// //         const res = await fetchFolder(folder, { page: 1, limit: 50 })
// //         const mapped = mapFolderResponseToList(res.data, currentUserId)
// //         if (ignore) return

// //         setList(mapped.items)

// //         const nextCounts: Record<MailFolderKey, number> = {
// //           inbox: 0,
// //           sent: 0,
// //           drafts: 0,
// //           trash: 0,
// //           archived: 0,
// //         }
// //         for (const it of mapped.items) nextCounts[it.folder]++
// //         setCounts((prev) => ({ ...prev, ...nextCounts }))
// //       } catch (e) {
// //         console.error(e)
// //         if (!ignore) setList([])
// //       } finally {
// //         if (!ignore) setLoading(false)
// //       }
// //     }

// //     load()
// //     return () => {
// //       ignore = true
// //     }
// //   }, [folder, currentUserId])

// //   useEffect(() => {
// //     let ignore = false

// //     async function loadDetail() {
// //       if (!currentUserId) return
// //       if (!activeMail?.id) {
// //         setActiveDetail(null)
// //         return
// //       }

// //       setDetailLoading(true)
// //       try {
// //         const res = await fetchMessageById(activeMail.id)
// //         const mapped = mapMessageToDetail(res.data, currentUserId)
// //         if (ignore) return
// //         setActiveDetail(mapped)

// //         if (mapped.unread) {
// //           try {
// //             await markRead(mapped.id)
// //             setList((prev) => prev.map((x) => (x.id === mapped.id ? { ...x, unread: false } : x)))
// //           } catch {}
// //         }
// //       } catch (e) {
// //         console.error(e)
// //         if (!ignore) setActiveDetail(null)
// //       } finally {
// //         if (!ignore) setDetailLoading(false)
// //       }
// //     }

// //     if (viewMode === "READ") loadDetail()
// //     return () => {
// //       ignore = true
// //     }
// //   }, [activeMail?.id, viewMode, currentUserId])

// //   function handleCompose() {
// //     setViewMode("COMPOSE")
// //     setActiveId(null)
// //   }

// //   function handleSelect(id: string) {
// //     setActiveId(id)
// //     setViewMode("READ")
// //   }

// //   async function handleToggleStar(id: string) {
// //     setList((prev) => prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)))
// //     try {
// //       await toggleStar(id)
// //     } catch {
// //       setList((prev) => prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)))
// //     }
// //   }

// //   async function handleArchive() {
// //     if (!activeMail?.id) return
// //     await moveToArchive(activeMail.id)
// //     setList((prev) => prev.filter((m) => m.id !== activeMail.id))
// //     setActiveId(null)
// //   }

// //   async function handleTrash() {
// //     if (!activeMail?.id) return
// //     await moveToTrash(activeMail.id)
// //     setList((prev) => prev.filter((m) => m.id !== activeMail.id))
// //     setActiveId(null)
// //   }

// //   return (
// //     <div className="h-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
// //       <div className="grid grid-cols-1 lg:grid-cols-[220px_360px_1fr] h-full">
// //         <MailFolders
// //           folder={folder}
// //           setFolder={(k) => {
// //             setFolder(k)
// //             setType("GENERAL")
// //             setQuery("")
// //             setActiveId(null)
// //             setViewMode("READ")
// //           }}
// //           counts={counts}
// //           onCompose={handleCompose}
// //         />

// //         <MailQueue
// //           folder={folder}
// //           mails={locallyFiltered}
// //           query={query}
// //           setQuery={setQuery}
// //           activeId={activeMail?.id ?? null}
// //           onSelect={handleSelect}
// //           type={type}
// //           setType={setType}
// //           onToggleStar={handleToggleStar}
// //           loading={loading}
// //         />

// //         {viewMode === "COMPOSE" ? (
// //           <ComposePanel
// //             onClose={() => setViewMode("READ")}
// //             onSent={() => {
// //               setViewMode("READ")
// //               setFolder("sent")
// //             }}
// //           />
// //         ) : (
// //           <MailViewer
// //             mail={detailLoading ? (activeMail ? { ...activeMail, body: "Loading..." } : null) : activeDetail}
// //             onReply={() => setViewMode("COMPOSE")}
// //             onArchive={handleArchive}
// //             onTrash={handleTrash}
// //             onStar={() => {
// //               if (activeMail?.id) handleToggleStar(activeMail.id)
// //             }}
// //           />
// //         )}
// //       </div>
// //     </div>
// //   )
// // }




// // client/src/app/(dashboard)/teacher-dashboard/components/mail/MailWorkspace.tsx
// "use client"

// import { useEffect, useMemo, useState } from "react"
// import MailFolders from "./MailFolders"
// import MailQueue from "./MailQueue"
// import MailViewer from "./MailViewer"
// import ComposePanel from "./ComposePanel"

// import type { MailFolderKey, MessageType, StudentMail } from "./types"
// import {
//   fetchFolder,
//   markAsRead,
//   moveToArchive,
//   moveToTrash,
//   toggleStar,
//   MailAPIError,
// } from "../../../../../../lib/mail"
// import { mapFolderResponseToList } from "./map"
// import { getUser, getToken } from "../../../../../../lib/auth"

// type ViewMode = "READ" | "COMPOSE"

// export default function MailWorkspace() {
//   const [folder, setFolder] = useState<MailFolderKey>("inbox")
//   const [type, setType] = useState<MessageType>("GENERAL")
//   const [query, setQuery] = useState("")
//   const [activeId, setActiveId] = useState<string | null>(null)
//   const [viewMode, setViewMode] = useState<ViewMode>("READ")

//   const [currentUserId, setCurrentUserId] = useState<string>("")

//   const [loading, setLoading] = useState(false)
//   const [list, setList] = useState<StudentMail[]>([])
//   const [counts, setCounts] = useState<Record<MailFolderKey, number>>({
//     inbox: 0,
//     sent: 0,
//     drafts: 0,
//     trash: 0,
//     archived: 0,
//   })

//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const u = getUser()
//     const t = getToken()
    
//     if (!u?.id) {
//       console.error("[MailWorkspace] User not found")
//       setError("User not found. Please login again.")
//       if (typeof window !== "undefined") window.location.href = "/login"
//       return
//     }
    
//     setCurrentUserId(u.id)
//   }, [])

//   const locallyFiltered = useMemo(() => {
//     const q = query.trim().toLowerCase()
//     return list.filter((m) => {
//       if (type !== "GENERAL" && m.type !== type) return false
//       if (!q) return true
//       return (
//         m.subject.toLowerCase().includes(q) ||
//         m.preview.toLowerCase().includes(q) ||
//         m.fromName.toLowerCase().includes(q)
//       )
//     })
//   }, [list, query, type])

//   const activeMail = useMemo(() => {
//     if (!locallyFiltered.length) return null
//     if (activeId) return locallyFiltered.find((m) => m.id === activeId) ?? locallyFiltered[0]
//     return locallyFiltered[0]
//   }, [locallyFiltered, activeId])

//   useEffect(() => {
//     let ignore = false

//     async function load() {
//       if (!currentUserId) return
//       setLoading(true)
//       setError(null)

//       try {
//         const res = await fetchFolder(folder, { page: 1, limit: 50 })
//         const mapped = mapFolderResponseToList(res.data, currentUserId)
        
//         if (ignore) return
        
//         setList(mapped.items)

//         const nextCounts: Record<MailFolderKey, number> = {
//           inbox: 0,
//           sent: 0,
//           drafts: 0,
//           trash: 0,
//           archived: 0,
//         }
//         for (const it of mapped.items) nextCounts[it.folder]++
//         setCounts((prev) => ({ ...prev, ...nextCounts }))
//       } catch (e: any) {
//         if (ignore) return
//         console.error("[MailWorkspace] Failed to load folder:", e)
//         setList([])
        
//         if (e instanceof MailAPIError && e.statusCode === 401) {
//           setError("Session expired. Please login again.")
//         } else {
//           setError(e.message || "Failed to load mails")
//         }
//       } finally {
//         if (!ignore) setLoading(false)
//       }
//     }

//     load()
//     return () => {
//       ignore = true
//     }
//   }, [folder, currentUserId])

//   useEffect(() => {
//     if (!activeMail) return
//     if (viewMode !== "READ") return
//     if (!activeMail.unread) return

//     async function markRead() {
//       if (!activeMail) return

//       try {
//         await markAsRead(activeMail.id)
//         setList((prev) => prev.map((x) => (x.id === activeMail.id ? { ...x, unread: false } : x)))
//       } catch (err) {
//         console.error("[MailWorkspace] Failed to mark as read:", err)
//       }
//     }

//     const timer = setTimeout(markRead, 500)
//     return () => clearTimeout(timer)
//   }, [activeMail, viewMode])

//   function handleCompose() {
//     setViewMode("COMPOSE")
//     setActiveId(null)
//     setError(null)
//   }

//   function handleSelect(id: string) {
//     setActiveId(id)
//     setViewMode("READ")
//     setError(null)
//   }

//   async function handleToggleStar(id: string) {
//     setList((prev) => prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)))
    
//     try {
//       await toggleStar(id)
//     } catch (e: any) {
//       console.error("[MailWorkspace] Failed to toggle star:", e)
//       setList((prev) => prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)))
      
//       if (e instanceof MailAPIError && e.statusCode !== 401) {
//         setError("Failed to update star")
//       }
//     }
//   }

//   async function handleArchive() {
//     if (!activeMail?.id) return
    
//     try {
//       await moveToArchive(activeMail.id)
//       setList((prev) => prev.filter((m) => m.id !== activeMail.id))
//       setActiveId(null)
//       setError(null)
//     } catch (e: any) {
//       console.error("[MailWorkspace] Failed to archive:", e)
      
//       if (e instanceof MailAPIError && e.statusCode === 401) {
//         setError("Session expired. Please login again.")
//       } else {
//         setError(e.message || "Failed to archive")
//       }
//     }
//   }

//   async function handleTrash() {
//     if (!activeMail?.id) return
    
//     try {
//       await moveToTrash(activeMail.id)
//       setList((prev) => prev.filter((m) => m.id !== activeMail.id))
//       setActiveId(null)
//       setError(null)
//     } catch (e: any) {
//       console.error("[MailWorkspace] Failed to trash:", e)
      
//       if (e instanceof MailAPIError && e.statusCode === 401) {
//         setError("Session expired. Please login again.")
//       } else {
//         setError(e.message || "Failed to move to trash")
//       }
//     }
//   }

//   return (
//     <div className="h-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm relative">
//       <div className="grid grid-cols-1 lg:grid-cols-[220px_360px_1fr] h-full">
//         <MailFolders
//           folder={folder}
//           setFolder={(k) => {
//             setFolder(k)
//             setType("GENERAL")
//             setQuery("")
//             setActiveId(null)
//             setViewMode("READ")
//             setError(null)
//           }}
//           counts={counts}
//           onCompose={handleCompose}
//         />

//         <MailQueue
//           folder={folder}
//           mails={locallyFiltered}
//           query={query}
//           setQuery={setQuery}
//           activeId={activeMail?.id ?? null}
//           onSelect={handleSelect}
//           type={type}
//           setType={setType}
//           onToggleStar={handleToggleStar}
//           loading={loading}
//         />

//         {viewMode === "COMPOSE" ? (
//           <ComposePanel
//             onClose={() => setViewMode("READ")}
//             onSent={() => {
//               setViewMode("READ")
//               setFolder("sent")
//             }}
//           />
//         ) : (
//           <MailViewer
//             mail={activeMail}
//             onReply={() => setViewMode("COMPOSE")}
//             onArchive={handleArchive}
//             onTrash={handleTrash}
//             onStar={() => {
//               if (activeMail?.id) handleToggleStar(activeMail.id)
//             }}
//           />
//         )}
//       </div>

//       {error && (
//         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-xl shadow-sm z-10 max-w-md flex items-center gap-2">
//           <span>Warning</span>
//           <span>{error}</span>
//           <button 
//             onClick={() => setError(null)}
//             className="ml-2 text-amber-600 hover:text-amber-900 font-semibold"
//           >
//             Close
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }
