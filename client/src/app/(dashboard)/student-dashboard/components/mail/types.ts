// // client/src/app/(dashboard)/student-dashboard/components/mail/types.ts

// export type MailFolderKey = "inbox" | "sent" | "drafts" | "trash" | "archived"

// export type ApiFolderType = "INBOX" | "SENT" | "DRAFT" | "TRASH" | "ARCHIVE"

// export type MessageType =
//   | "GENERAL"
//   | "NOTICE"
//   | "ASSIGNMENT"
//   | "ATTENDANCE"
//   | "OUTPASS"
//   | "DISCIPLINE"
//   | "FEE"
//   | "HOSTEL"
//   | "MESS"
//   | "SPORTS"
//   | "PLACEMENT"
//   | "INTERNSHIP"
//   | "EVENT"
//   | "WORKSHOP"
//   | "SEMINAR"
//   | "MAINTENANCE"
//   | "ANNOUNCEMENT"

// export const MESSAGE_TYPE_LABEL: Record<MessageType, string> = {
//   GENERAL: "All",
//   NOTICE: "Notices",
//   ASSIGNMENT: "Assignments",
//   ATTENDANCE: "Attendance",
//   OUTPASS: "Outpass",
//   DISCIPLINE: "Discipline",
//   FEE: "Fees",
//   HOSTEL: "Hostel",
//   MESS: "Mess",
//   SPORTS: "Sports",
//   PLACEMENT: "Placement",
//   INTERNSHIP: "Internship",
//   EVENT: "Events",
//   WORKSHOP: "Workshops",
//   SEMINAR: "Seminars",
//   MAINTENANCE: "Maintenance",
//   ANNOUNCEMENT: "Announcements",
// }

// export const UI_TO_API_FOLDER: Record<MailFolderKey, ApiFolderType> = {
//   inbox: "INBOX",
//   sent: "SENT",
//   drafts: "DRAFT",
//   trash: "TRASH",
//   archived: "ARCHIVE",
// }

// export const API_TO_UI_FOLDER: Record<ApiFolderType, MailFolderKey> = {
//   INBOX: "inbox",
//   SENT: "sent",
//   DRAFT: "drafts",
//   TRASH: "trash",
//   ARCHIVE: "archived",
// }

// export type MailAttachment = {
//   id: string
//   name: string
//   url: string
//   mimeType: string
//   size: number
//   sizeLabel?: string
// }

// export type StudentMail = {
//   id: string
//   folder: MailFolderKey

//   recipientType?: "TO" | "CC" | "BCC" | "SENDER" | null

//   fromName: string
//   fromEmail?: string

//   toName?: string
//   toEmail?: string

//   subject: string
//   preview: string
//   body?: string

//   type: MessageType

//   createdAt: string
//   unread: boolean
//   starred: boolean
//   important?: boolean

//   attachments?: MailAttachment[]
// }


// export type ApiMessage = {
//   id: string
//   senderId: string
//   senderName: string | null
//   senderEmail: string | null
//   subject: string
//   body: string
//   type: MessageType
//   createdAt: string
//   updatedAt: string
//   attachments: {
//     id: string
//     filename: string
//     url: string
//     mimeType: string
//     size: number
//     cloudinaryId: string
//     createdAt: string
//   }[]
//   participants: {
//     id: string
//     userId: string
//     folder: ApiFolderType
//     readAt: string | null
//     flagged: boolean
//     recipientType: "TO" | "CC" | "BCC" | "SENDER" | null
//   }[]
// }

// export type ApiParticipantRow = {
//   id: string
//   messageId: string
//   userId: string
//   folder: ApiFolderType
//   readAt: string | null
//   flagged: boolean
//   recipientType: "TO" | "CC" | "BCC" | "SENDER" | null
//   message: ApiMessage
// }

// export type ApiFolderResponse = {
//   messages: ApiParticipantRow[]
//   total: number
//   page: number
//   totalPages: number
// }

// export type ApiSuccess<T> = {
//   success: boolean
//   data: T
// }
