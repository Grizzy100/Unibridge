// client/components/mail/types.ts

export type MessageType =
  | "GENERAL"
  | "NOTICE"
  | "ASSIGNMENT"
  | "ATTENDANCE"
  | "OUTPASS"
  | "ANNOUNCEMENT"
  | "DISCIPLINE"
  | "FEE"
  | "HOSTEL"
  | "MESS"
  | "SPORTS"
  | "PLACEMENT"
  | "INTERNSHIP"
  | "EVENT"
  | "WORKSHOP"
  | "SEMINAR"
  | "MAINTENANCE"

export const MESSAGE_TYPE_LABEL: Record<MessageType, string> = {
  GENERAL: "General",
  NOTICE: "Notice",
  ASSIGNMENT: "Assignment",
  ATTENDANCE: "Attendance",
  OUTPASS: "Outpass",
  ANNOUNCEMENT: "Announcement",
  DISCIPLINE: "Discipline",
  FEE: "Fee",
  HOSTEL: "Hostel",
  MESS: "Mess",
  SPORTS: "Sports",
  PLACEMENT: "Placement",
  INTERNSHIP: "Internship",
  EVENT: "Event",
  WORKSHOP: "Workshop",
  SEMINAR: "Seminar",
  MAINTENANCE: "Maintenance",
}

export type MailFolderKey = "inbox" | "sent" | "drafts" | "trash" | "archived"

export type RecipientType = "SENDER" | "RECEIVER"

export interface Attachment {
  id: string
  name: string
  url: string
  sizeLabel?: string
}


export interface MailRecipient {
  id: string
  name: string
  email?: string
}


export interface Mail {
  id: string
  subject: string
  body: string
  preview: string
  fromName: string
  fromEmail: string

  to?: MailRecipient[]
  
  type: MessageType
  folder: MailFolderKey
  recipientType: RecipientType
  unread: boolean
  starred: boolean
  important: boolean
  createdAt: string
  attachments?: Attachment[]
  messageId?: string
}

// API Response Types
export interface ApiFolderData {
  messages: any[]
  total: number
  page?: number
  totalPages?: number
  count?: number
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface FolderResponse {
  success: boolean
  data: ApiFolderData
}
