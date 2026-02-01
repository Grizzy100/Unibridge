// // // client/src/app/(dashboard)/student-dashboard/components/mail/map.ts
// // import type {
// //   ApiFolderResponse,
// //   ApiMessage,
// //   ApiParticipantRow,
// //   MailAttachment,
// //   MailFolderKey,
// //   StudentMail,
// // } from "./types";
// // import { API_TO_UI_FOLDER, MESSAGE_TYPE_LABEL } from "./types";
// // import { bytesToSizeLabel, makePreview } from "./utils";

// // function guessImportant(type: string) {
// //   // you can refine this
// //   return type !== "GENERAL";
// // }

// // export function mapFolderResponseToList(
// //   data: ApiFolderResponse,
// //   currentUserId?: string
// // ): { items: StudentMail[]; total: number; page: number; totalPages: number } {
// //   const items = data.messages.map((row: ApiParticipantRow) =>
// //     mapParticipantRowToListItem(row, currentUserId)
// //   );
// //   return { items, total: data.total, page: data.page, totalPages: data.totalPages };
// // }

// // function mapParticipantRowToListItem(
// //   row: ApiParticipantRow,
// //   _currentUserId?: string
// // ): StudentMail {
// //   const m = row.message

// //   const fromName = m.senderName?.trim() || "Unknown User"
// //   const fromEmail = m.senderEmail || undefined

// //   const attachments = (m.attachments || []).map(mapAttachment)

// //   return {
// //     id: m.id,
// //     folder: API_TO_UI_FOLDER[row.folder],
// //     fromName,
// //     fromEmail,
// //     subject: m.subject,
// //     preview: makePreview(m.body, 110),
// //     type: m.type,
// //     createdAt: m.createdAt,
// //     unread: row.readAt === null,
// //     starred: !!row.flagged,
// //     important: guessImportant(m.type),
// //     attachments,
// //   }
// // }

// // export function mapMessageToDetail(msg: ApiMessage, forUserId: string): StudentMail {
// //   const myParticipant = msg.participants.find((p) => p.userId === forUserId)

// //   const fromName = msg.senderName?.trim() || "Unknown User"
// //   const fromEmail = msg.senderEmail || undefined

// //   return {
// //     id: msg.id,
// //     folder: myParticipant ? API_TO_UI_FOLDER[myParticipant.folder] : "inbox",
// //     fromName,
// //     fromEmail,
// //     subject: msg.subject,
// //     preview: makePreview(msg.body, 110),
// //     body: msg.body,
// //     type: msg.type,
// //     createdAt: msg.createdAt,
// //     unread: myParticipant ? myParticipant.readAt === null : false,
// //     starred: myParticipant ? !!myParticipant.flagged : false,
// //     important: guessImportant(msg.type),
// //     attachments: (msg.attachments || []).map(mapAttachment),
// //   }
// // }

// // function mapAttachment(a: any): MailAttachment {
// //   return {
// //     id: a.id,
// //     name: a.filename,
// //     url: a.url,
// //     mimeType: a.mimeType,
// //     size: a.size,
// //     sizeLabel: bytesToSizeLabel(a.size),
// //   };
// // }



// //client\src\app\(dashboard)\student-dashboard\components\mail\map.ts
// // client/src/app/(dashboard)/student-dashboard/components/mail/map.ts
// import type {
//   MailAttachment,
//   StudentMail,
// } from "./types"
// import { API_TO_UI_FOLDER, type ApiFolderType } from "./types"
// import { bytesToSizeLabel, makePreview, nameFromEmail } from "./utils"
// import type { MailMessage, FolderResponse } from "../../../../../../lib/mail"

// function guessImportant(type: string) {
//   return type !== "GENERAL"
// }

// export function mapFolderResponseToList(
//   data: FolderResponse,
//   currentUserId?: string
// ): { items: StudentMail[]; total: number; page: number; totalPages: number } {
//   console.log("[Map] Mapping folder response:", {
//     messageCount: data.messages?.length || 0,
//     total: data.total,
//     currentUserId
//   })
  
//   if (!data.messages || data.messages.length === 0) {
//     console.warn("[Map] No messages in response")
//     return { items: [], total: 0, page: 1, totalPages: 0 }
//   }

//   console.log("[Map] First message from API:", data.messages[0])

//   const items = data.messages.map((msg, index) => {
//     try {
//       const mapped = mapMessageToListItem(msg, currentUserId)
//       if (index === 0) {
//         console.log("[Map] First mapped message:", mapped)
//       }
//       return mapped
//     } catch (error) {
//       console.error("[Map] Failed to map message:", msg, error)
//       throw error
//     }
//   })
  
//   return { 
//     items, 
//     total: data.total, 
//     page: data.page, 
//     totalPages: data.totalPages 
//   }
// }

// function mapMessageToListItem(msg: MailMessage, currentUserId?: string): StudentMail {
//   if (!msg) {
//     console.error("[Map] Received null/undefined message")
//     throw new Error("Invalid message data")
//   }

//   const actualMessageId = msg.messageId
  
//   if (!actualMessageId) {
//     console.error("[Map] Message has no messageId field:", msg)
//     throw new Error("Message missing messageId field")
//   }

//   console.log("[Map] Using messageId:", actualMessageId, "(participantId:", msg.id, ")")

//   const folder = API_TO_UI_FOLDER[msg.folder as ApiFolderType] || "inbox"

//   const fromEmail = msg.senderEmail || undefined
//   const fromName = msg.senderName?.trim() || nameFromEmail(fromEmail) || "Unknown User"

//   const toEmail = folder === "sent" ? fromEmail : undefined
//   const toName = folder === "sent" ? fromName : undefined

//   const attachments = (msg.attachments || []).map(mapAttachment)

//   return {
//     id: actualMessageId,
//     folder,

//     recipientType: msg.recipientType as "TO" | "CC" | "BCC" | "SENDER" | null,

//     fromName,
//     fromEmail,

//     toName,
//     toEmail,

//     subject: msg.subject || "No Subject",
//     preview: makePreview(msg.body, 110),
//     body: msg.body || "",
//     type: msg.type as any,
//     createdAt: msg.createdAt,
//     unread: msg.readAt === null,
//     starred: !!msg.flagged,
//     important: guessImportant(msg.type),
//     attachments,
//   }
// }

// function mapAttachment(a: any): MailAttachment {
//   return {
//     id: a.id,
//     name: a.filename,
//     url: a.url,
//     mimeType: a.mimeType,
//     size: a.size,
//     sizeLabel: bytesToSizeLabel(a.size),
//   }
// }
