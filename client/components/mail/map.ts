// // // // client/components/mail/map.ts
// import type { Mail, MailFolderKey, MessageType } from "./types"

// /**
//  * Normalize recipients from API message
//  */
// function mapRecipients(msg: any): { id: string; name: string; email?: string }[] {
//   const raw =
//     msg.recipients ||
//     msg.to ||
//     msg.targets ||
//     []

//   if (!Array.isArray(raw)) return []

//   return raw.map((r: any) => ({
//     id: r.id || r.userId || r.value || "",
//     name:
//       r.name ||
//       r.fullName ||
//       r.displayName ||
//       r.email ||
//       "Unknown",
//     email: r.email || "",
//   }))
// }

// /**
//  * Maps API response to Mail list
//  */
// export function mapFolderResponseToList(
//   data: any,
//   currentUserId: string
// ): { items: Mail[]; total: number } {
//   const messages = data?.messages || data?.data || data || []
//   const total =
//     data?.total ||
//     data?.count ||
//     data?.pagination?.total ||
//     messages.length ||
//     0

//   const items: Mail[] = messages.map((msg: any) => {
//     const isSender = currentUserId && msg.senderId === currentUserId
//     const recipientType = isSender ? "SENDER" : "RECEIVER"

//     let folder: MailFolderKey = "inbox"
//     if (msg.folder) folder = msg.folder
//     else if (msg.isArchived) folder = "archived"
//     else if (msg.isDeleted || msg.isTrashed) folder = "trash"
//     else if (msg.isDraft) folder = "drafts"
//     else if (isSender) folder = "sent"

//     const fromName =
//       msg.senderName || msg.sender?.name || msg.from?.name || "Unknown Sender"
//     const fromEmail =
//       msg.senderEmail || msg.sender?.email || msg.from?.email || ""

//     const bodyText = msg.body || msg.content || ""
//     const preview =
//       bodyText.slice(0, 120).replace(/\n/g, " ") || "No preview available"

//     let unread = true
//     if (msg.unread != null) unread = msg.unread
//     else if (msg.isUnread != null) unread = msg.isUnread
//     else if (msg.isRead != null) unread = !msg.isRead
//     else if (msg.readAt) unread = false

//     return {
//       id: msg.id || msg._id || "",
//       subject: msg.subject || "No Subject",
//       body: bodyText,
//       preview,
//       fromName,
//       fromEmail,

//       // ✅ ADD RECIPIENTS HERE
//       to: mapRecipients(msg),

//       type: (msg.type || "GENERAL") as MessageType,
//       folder,
//       recipientType,
//       unread,
//       starred: msg.starred || msg.isStarred || msg.flagged || false,
//       important: msg.important || msg.isImportant || false,
//       createdAt:
//         msg.createdAt || msg.sentAt || msg.timestamp || new Date().toISOString(),
//       attachments: (msg.attachments || []).map((att: any) => ({
//         id: att.id || att._id || "",
//         name: att.name || att.filename || "Attachment",
//         url: att.url || att.path || "",
//         sizeLabel: att.size
//           ? `${(att.size / 1024).toFixed(1)} KB`
//           : att.sizeLabel || undefined,
//       })),
//     }
//   })

//   return { items, total }
// }

// /**
//  * Maps single message API response to Mail detail
//  */
// export function mapMessageToDetail(
//   data: any,
//   currentUserId: string
// ): Mail {
//   const isSender = currentUserId && data.senderId === currentUserId
//   const recipientType = isSender ? "SENDER" : "RECEIVER"

//   let folder: MailFolderKey = "inbox"
//   if (data.folder) folder = data.folder
//   else if (data.isArchived) folder = "archived"
//   else if (data.isDeleted || data.isTrashed) folder = "trash"
//   else if (data.isDraft) folder = "drafts"
//   else if (isSender) folder = "sent"

//   const fromName =
//     data.senderName || data.sender?.name || data.from?.name || "Unknown Sender"
//   const fromEmail =
//     data.senderEmail || data.sender?.email || data.from?.email || ""

//   const bodyText = data.body || data.content || ""
//   const preview =
//     bodyText.slice(0, 120).replace(/\n/g, " ") || "No preview available"

//   let unread = true
//   if (data.unread != null) unread = data.unread
//   else if (data.isUnread != null) unread = data.isUnread
//   else if (data.isRead != null) unread = !data.isRead
//   else if (data.readAt) unread = false

//   return {
//     id: data.id || data._id || "",
//     subject: data.subject || "No Subject",
//     body: bodyText,
//     preview,
//     fromName,
//     fromEmail,

//     // ✅ ADD RECIPIENTS HERE TOO
//     to: mapRecipients(data),

//     type: (data.type || "GENERAL") as MessageType,
//     folder,
//     recipientType,
//     unread,
//     starred: data.starred || data.isStarred || data.flagged || false,
//     important: data.important || data.isImportant || false,
//     createdAt:
//       data.createdAt || data.sentAt || data.timestamp || new Date().toISOString(),
//     attachments: (data.attachments || []).map((att: any) => ({
//       id: att.id || att._id || "",
//       name: att.name || att.filename || "Attachment",
//       url: att.url || att.path || "",
//       sizeLabel: att.size
//         ? `${(att.size / 1024).toFixed(1)} KB`
//         : att.sizeLabel || undefined,
//     })),
//   }
// }






// client/components/mail/map.ts
import type { Mail, MailFolderKey, MessageType } from "./types"

function mapRecipients(msg: any): { id: string; name: string; email?: string }[] {
  const raw = msg.recipients || msg.to || msg.targets || []
  if (!Array.isArray(raw)) return []

  return raw.map((r: any) => ({
    id: r.id || r.userId || r.value || "",
    name: r.name || r.fullName || r.displayName || r.email || "Unknown",
    email: r.email || "",
  }))
}

export function mapFolderResponseToList(
  data: any,
  currentUserId: string
): { items: Mail[]; total: number } {
  const messages = data?.messages || data?.data || data || []
  const total =
    data?.total ||
    data?.count ||
    data?.pagination?.total ||
    messages.length ||
    0

  const items: Mail[] = messages.map((msg: any) => {
    const isSender = currentUserId && msg.senderId === currentUserId
    const recipientType = isSender ? "SENDER" : "RECEIVER"

    let folder: MailFolderKey = "inbox"
    if (msg.folder) folder = msg.folder
    else if (msg.isArchived) folder = "archived"
    else if (msg.isDeleted || msg.isTrashed) folder = "trash"
    else if (msg.isDraft) folder = "drafts"
    else if (isSender) folder = "sent"

    const fromName =
      msg.senderName || msg.sender?.name || msg.from?.name || "Unknown Sender"
    const fromEmail =
      msg.senderEmail || msg.sender?.email || msg.from?.email || ""

    const bodyText = msg.body || msg.content || ""
    const preview =
      bodyText.slice(0, 120).replace(/\n/g, " ") || "No preview available"

    let unread = true
    if (msg.unread != null) unread = msg.unread
    else if (msg.isUnread != null) unread = msg.isUnread
    else if (msg.isRead != null) unread = !msg.isRead
    else if (msg.readAt) unread = false

    return {
      id: msg.id || msg._id || "",
      messageId: msg.messageId || msg.id || msg._id || "",  // ✅ ADD THIS
      subject: msg.subject || "No Subject",
      body: bodyText,
      preview,
      fromName,
      fromEmail,
      to: mapRecipients(msg),
      type: (msg.type || "GENERAL") as MessageType,
      folder,
      recipientType,
      unread,
      starred: msg.starred || msg.isStarred || msg.flagged || false,
      important: msg.important || msg.isImportant || false,
      createdAt:
        msg.createdAt || msg.sentAt || msg.timestamp || new Date().toISOString(),
      attachments: (msg.attachments || []).map((att: any) => ({
        id: att.id || att._id || "",
        name: att.name || att.filename || "Attachment",
        url: att.url || att.path || "",
        sizeLabel: att.size
          ? `${(att.size / 1024).toFixed(1)} KB`
          : att.sizeLabel || undefined,
      })),
    }
  })

  return { items, total }
}

export function mapMessageToDetail(
  data: any,
  currentUserId: string
): Mail {
  const isSender = currentUserId && data.senderId === currentUserId
  const recipientType = isSender ? "SENDER" : "RECEIVER"

  let folder: MailFolderKey = "inbox"
  if (data.folder) folder = data.folder
  else if (data.isArchived) folder = "archived"
  else if (data.isDeleted || data.isTrashed) folder = "trash"
  else if (data.isDraft) folder = "drafts"
  else if (isSender) folder = "sent"

  const fromName =
    data.senderName || data.sender?.name || data.from?.name || "Unknown Sender"
  const fromEmail =
    data.senderEmail || data.sender?.email || data.from?.email || ""

  const bodyText = data.body || data.content || ""
  const preview =
    bodyText.slice(0, 120).replace(/\n/g, " ") || "No preview available"

  let unread = true
  if (data.unread != null) unread = data.unread
  else if (data.isUnread != null) unread = data.isUnread
  else if (data.isRead != null) unread = !data.isRead
  else if (data.readAt) unread = false

  return {
    id: data.id || data._id || "",
    messageId: data.messageId || data.id || data._id || "",  // ✅ ADD THIS
    subject: data.subject || "No Subject",
    body: bodyText,
    preview,
    fromName,
    fromEmail,
    to: mapRecipients(data),
    type: (data.type || "GENERAL") as MessageType,
    folder,
    recipientType,
    unread,
    starred: data.starred || data.isStarred || data.flagged || false,
    important: data.important || data.isImportant || false,
    createdAt:
      data.createdAt || data.sentAt || data.timestamp || new Date().toISOString(),
    attachments: (data.attachments || []).map((att: any) => ({
      id: att.id || att._id || "",
      name: att.name || att.filename || "Attachment",
      url: att.url || att.path || "",
      sizeLabel: att.size
        ? `${(att.size / 1024).toFixed(1)} KB`
        : att.sizeLabel || undefined,
    })),
  }
}
