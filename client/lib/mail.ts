// // // client/lib/mail.ts


// // import { ApiFolderResponse, ApiMessage, ApiSuccess, MailFolderKey } from "@/app/(dashboard)/student-dashboard/components/mail/types";

// // const BASE = process.env.NEXT_PUBLIC_MAIL_API || "http://localhost:3002";
// // const API_BASE = `${BASE}/api/mail`;

// // // NOTE: adapt this if your token storage is different.
// // // If you already have an auth helper, replace getToken().
// // function getToken(): string | null {
// //   try {
// //     return localStorage.getItem("token")
// //   } catch {
// //     return null
// //   }
// // }

// // async function request<T>(path: string, init?: RequestInit): Promise<T> {
// //   const token = getToken();
// //   const res = await fetch(`${API_BASE}${path}`, {
// //     ...init,
// //     headers: {
// //       ...(init?.headers || {}),
// //       ...(token ? { Authorization: `Bearer ${token}` } : {}),
// //     },
// //   });

// //   const json = (await res.json().catch(() => null)) as any;
// //   if (!res.ok) {
// //     const msg = json?.error || json?.message || "Request failed";
// //     throw new Error(msg);
// //   }
// //   return json as T;
// // }

// // export function fetchFolder(
// //   folder: MailFolderKey,
// //   opts?: { page?: number; limit?: number; q?: string; type?: string }
// // ) {
// //   const page = opts?.page ?? 1;
// //   const limit = opts?.limit ?? 20;
// //   const q = opts?.q?.trim();
// //   const type = opts?.type?.trim(); // MessageType or "GENERAL"

// //   const qs = new URLSearchParams();
// //   qs.set("page", String(page));
// //   qs.set("limit", String(limit));
// //   if (q) qs.set("q", q);
// //   if (type && type !== "GENERAL") qs.set("type", type);

// //   // Your backend routes are /inbox, /sent, /drafts, /trash, /archive
// //   const path =
// //     folder === "inbox"
// //       ? `/inbox?${qs.toString()}`
// //       : folder === "sent"
// //       ? `/sent?${qs.toString()}`
// //       : folder === "drafts"
// //       ? `/drafts?${qs.toString()}`
// //       : folder === "trash"
// //       ? `/trash?${qs.toString()}`
// //       : `/archive?${qs.toString()}`;

// //   return request<ApiSuccess<ApiFolderResponse>>(path);
// // }

// // export function fetchMessageById(messageId: string) {
// //   return request<ApiSuccess<ApiMessage>>(`/messages/${messageId}`);
// // }

// // export function markRead(messageId: string) {
// //   return request<ApiSuccess<{ message: string }>>(`/messages/${messageId}/read`, {
// //     method: "PATCH",
// //   });
// // }

// // export function toggleStar(messageId: string) {
// //   return request<ApiSuccess<{ message: string }>>(`/messages/${messageId}/flag`, {
// //     method: "PATCH",
// //   });
// // }

// // export function moveToTrash(messageId: string) {
// //   return request<ApiSuccess<{ message: string }>>(`/messages/${messageId}/trash`, {
// //     method: "PATCH",
// //   });
// // }

// // export function moveToArchive(messageId: string) {
// //   return request<ApiSuccess<{ message: string }>>(
// //     `/messages/${messageId}/archive`,
// //     { method: "PATCH" }
// //   );
// // }

// // export function deletePermanent(messageId: string) {
// //   return request<ApiSuccess<{ message: string }>>(`/messages/${messageId}`, {
// //     method: "DELETE",
// //   });
// // }

// // export function unreadCount() {
// //   return request<ApiSuccess<{ unreadCount: number }>>(`/unread-count`);
// // }

// // // Send message (multipart)
// // // targets should be JSON string (backend supports string or parsed)
// // export async function sendMessage(form: FormData) {
// //   const token = getToken();
// //   const res = await fetch(`${API_BASE}/send`, {
// //     method: "POST",
// //     headers: {
// //       ...(token ? { Authorization: `Bearer ${token}` } : {}),
// //       // IMPORTANT: do NOT set Content-Type for FormData
// //     },
// //     body: form,
// //   });
// //   const json = (await res.json().catch(() => null)) as any;
// //   if (!res.ok) {
// //     const msg = json?.error || json?.message || "Send failed";
// //     throw new Error(msg);
// //   }
// //   return json as ApiSuccess<any>;
// // }



// // client/lib/mail.ts
// import { getToken, getUser, clearAuth } from "./auth"

// const BASE = process.env.NEXT_PUBLIC_MAIL_API || "http://localhost:3002"
// const API_BASE = `${BASE}/api/mail`

// // ============================================================================
// // TYPES
// // ============================================================================

// export interface ApiSuccess<T = any> {
//   success: boolean
//   data: T
// }

// export interface ApiErrorBody {
//   success?: boolean
//   error?: string
//   message?: string
//   code?: string
// }

// export type MailFolderKey = "inbox" | "sent" | "drafts" | "trash" | "archived"

// export interface MessageTarget {
//   kind:
//     | "EMAIL"
//     | "USER"
//     | "ROLE"
//     | "COURSE"
//     | "BATCH"
//     | "SCHOOL"
//     | "DEPARTMENT"
//     | "YEAR"
//     | "SEMESTER"
//     | "HOSTEL_BLOCK"
//   value: string
// }

// export interface SendMailRequest {
//   targets: MessageTarget[]
//   ccTargets?: MessageTarget[]
//   bccTargets?: MessageTarget[]
//   subject: string
//   body: string
//   type: string
//   attachments?: File[]
// }

// export interface MailAttachment {
//   id: string
//   filename: string
//   url: string
//   mimeType: string
//   size: number
// }

// export interface MailMessage {
//   id: string
//   messageId: string
//   subject: string
//   body: string
//   senderName: string
//   senderEmail: string
//   type: string
//   createdAt: string
//   readAt: string | null
//   flagged: boolean
//   folder: string
//   recipientType: string
//   attachments?: MailAttachment[]
// }

// export interface FolderResponse {
//   messages: MailMessage[]
//   total: number
//   page: number
//   totalPages: number
// }

// // ============================================================================
// // ERROR CLASS
// // ============================================================================

// export class MailAPIError extends Error {
//   constructor(
//     message: string,
//     public statusCode?: number,
//     public code?: string
//   ) {
//     super(message)
//     this.name = "MailAPIError"
//   }
// }

// // ============================================================================
// // TYPE GUARD
// // ============================================================================

// function isApiError(obj: unknown): obj is ApiErrorBody {
//   if (typeof obj !== "object" || obj === null) return false
//   const o = obj as Record<string, unknown>
//   return (
//     typeof o.error === "string" ||
//     typeof o.message === "string" ||
//     o.success === false
//   )
// }

// // ============================================================================
// // CORE REQUEST (JSON)
// // ============================================================================

// async function request<T>(
//   path: string,
//   init?: RequestInit
// ): Promise<T> {
//   const token = getToken()

//   if (!token) {
//     console.error("[Mail API] No token")
//     clearAuth()
//     if (typeof window !== "undefined") window.location.href = "/login"
//     throw new MailAPIError("Authentication required", 401, "NO_TOKEN")
//   }

//   const user = getUser()
//   const url = `${API_BASE}${path}`
//   console.log(`[Mail API] ${init?.method || "GET"} ${path} (user: ${user?.role}:${user?.id})`)

//   try {
//     const res = await fetch(url, {
//       ...init,
//       headers: {
//         "Content-Type": "application/json",
//         ...(init?.headers || {}),
//         Authorization: `Bearer ${token}`,
//       },
//     })

//     const json: unknown = await res.json().catch(() => null)

//     if (res.status === 401 || res.status === 403) {
//       console.error("[Mail API] 401/403, logging out")
//       clearAuth()
//       if (typeof window !== "undefined") window.location.href = "/login"

//       let errorMsg = "Session expired. Please login again."
//       let errorCode = "TOKEN_EXPIRED"

//       if (isApiError(json)) {
//         errorMsg = json.message || json.error || errorMsg
//         errorCode = json.code || errorCode
//       }

//       throw new MailAPIError(errorMsg, res.status, errorCode)
//     }

//     if (!res.ok) {
//       let errorMsg = `Request failed (${res.status})`
//       let errorCode: string | undefined

//       if (isApiError(json)) {
//         errorMsg = json.error || json.message || errorMsg
//         errorCode = json.code
//       }

//       console.error("[Mail API] Error:", errorMsg)
//       console.error("[Mail API] Response:", json)
//       throw new MailAPIError(errorMsg, res.status, errorCode)
//     }

//     console.log(`[Mail API] ${init?.method || "GET"} ${path} OK`)
//     return json as T
//   } catch (e) {
//     if (e instanceof MailAPIError) throw e
//     console.error("[Mail API] Network error:", e)
//     throw new MailAPIError("Network error. Please try again.", 0, "NETWORK_ERROR")
//   }
// }

// // ============================================================================
// // FOLDER OPERATIONS
// // ============================================================================

// export async function fetchFolder(
//   folder: MailFolderKey,
//   opts?: { page?: number; limit?: number; q?: string; type?: string }
// ): Promise<ApiSuccess<FolderResponse>> {
//   const page = opts?.page ?? 1
//   const limit = opts?.limit ?? 20
//   const q = opts?.q?.trim()
//   const type = opts?.type?.trim()

//   const qs = new URLSearchParams()
//   qs.set("page", String(page))
//   qs.set("limit", String(limit))
//   if (q) qs.set("q", q)
//   if (type && type !== "GENERAL") qs.set("type", type)

//   const folderMap: Record<MailFolderKey, string> = {
//     inbox: "/inbox",
//     sent: "/sent",
//     drafts: "/drafts",
//     trash: "/trash",
//     archived: "/archive",
//   }

//   const path = `${folderMap[folder]}?${qs.toString()}`
//   return request<ApiSuccess<FolderResponse>>(path)
// }

// export function fetchMessageById(id: string) {
//   console.log(`[Mail API] Fetching message by ID: ${id}`)
//   return request<ApiSuccess<MailMessage>>(`/messages/${id}`)
// }

// export function markAsRead(id: string) {
//   return request<ApiSuccess<{ message: string }>>(`/messages/${id}/read`, {
//     method: "PATCH",
//   })
// }

// export function toggleStar(id: string) {
//   return request<ApiSuccess<{ message: string }>>(`/messages/${id}/flag`, {
//     method: "PATCH",
//   })
// }

// export function moveToTrash(id: string) {
//   return request<ApiSuccess<{ message: string }>>(`/messages/${id}/trash`, {
//     method: "PATCH",
//   })
// }

// export function moveToArchive(id: string) {
//   return request<ApiSuccess<{ message: string }>>(`/messages/${id}/archive`, {
//     method: "PATCH",
//   })
// }

// export function deletePermanent(id: string) {
//   return request<ApiSuccess<{ message: string }>>(`/messages/${id}`, {
//     method: "DELETE",
//   })
// }

// export function getUnreadCount() {
//   return request<ApiSuccess<{ unreadCount: number }>>(`/unread-count`)
// }

// export function searchMessages(query: string, page = 1, limit = 20) {
//   const qs = new URLSearchParams()
//   qs.set("q", query)
//   qs.set("page", String(page))
//   qs.set("limit", String(limit))
//   return request<ApiSuccess<FolderResponse>>(`/search?${qs.toString()}`)
// }

// // ============================================================================
// // SEND MAIL (MULTIPART)
// // ============================================================================

// export async function sendMail(
//   data: SendMailRequest
// ): Promise<ApiSuccess<{ messageId: string; recipientCount: number; attachmentCount: number }>> {
//   const token = getToken()
//   const user = getUser()

//   if (!token) {
//     throw new MailAPIError("Authentication required", 401, "NO_TOKEN")
//   }

//   console.log(`[Mail API] Sending mail from ${user?.role}:${user?.email}`)

//   const form = new FormData()
//   form.append("targets", JSON.stringify(data.targets))
//   if (data.ccTargets?.length) form.append("ccTargets", JSON.stringify(data.ccTargets))
//   if (data.bccTargets?.length) form.append("bccTargets", JSON.stringify(data.bccTargets))
//   form.append("subject", data.subject)
//   form.append("body", data.body)
//   form.append("type", data.type)
//   if (data.attachments?.length) {
//     data.attachments.forEach((f) => form.append("attachments", f))
//   }

//   try {
//     const res = await fetch(`${API_BASE}/send`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: form,
//     })

//     const json: unknown = await res.json().catch(() => null)

//     if (res.status === 401 || res.status === 403) {
//       console.error("[Mail API] 401/403 on send, logging out")
//       clearAuth()
//       if (typeof window !== "undefined") window.location.href = "/login"

//       let errorMsg = "Session expired. Please login again."
//       let errorCode = "TOKEN_EXPIRED"

//       if (isApiError(json)) {
//         errorMsg = json.message || json.error || errorMsg
//         errorCode = json.code || errorCode
//       }

//       throw new MailAPIError(errorMsg, res.status, errorCode)
//     }

//     if (!res.ok) {
//       let errorMsg = `Send failed (${res.status})`
//       let errorCode: string | undefined

//       if (isApiError(json)) {
//         errorMsg = json.error || json.message || errorMsg
//         errorCode = json.code
//       }

//       console.error("[Mail API] Send failed:", errorMsg)
//       throw new MailAPIError(errorMsg, res.status, errorCode)
//     }

//     console.log("[Mail API] Mail sent")
//     return json as ApiSuccess<{ messageId: string; recipientCount: number; attachmentCount: number }>
//   } catch (e) {
//     if (e instanceof MailAPIError) throw e
//     console.error("[Mail API] Network error on send:", e)
//     throw new MailAPIError("Network error while sending mail", 0, "NETWORK_ERROR")
//   }
// }

// // ============================================================================
// // ROLE UTILS FOR UI
// // ============================================================================

// export function getCurrentUserRole() {
//   return getUser()?.role ?? null
// }

// export function canSendTo(kind: MessageTarget["kind"]): boolean {
//   const role = getCurrentUserRole()

//   if (role === "STUDENT") {
//     return kind === "EMAIL"
//   }

//   if (role === "TEACHER" || role === "WARDEN") {
//     return ["EMAIL", "COURSE", "BATCH", "SCHOOL", "DEPARTMENT"].includes(kind)
//   }

//   if (role === "ADMIN") return true

//   return false
// }





// client/lib/mail.ts
import { getToken, getUser, clearAuth } from "./auth"
import type { FolderResponse } from "../components/mail/types" // ✅ Import from types.ts

const BASE = process.env.NEXT_PUBLIC_MAIL_API || "http://localhost:3002"
const API_BASE = `${BASE}/api/mail`

// ============================================================================
// TYPES
// ============================================================================

export interface ApiSuccess<T = any> {
  success: boolean
  data: T
}

export interface ApiErrorBody {
  success?: boolean
  error?: string
  message?: string
  code?: string
}

export type MailFolderKey = "inbox" | "sent" | "drafts" | "trash" | "archived"

export interface MessageTarget {
  kind:
    | "EMAIL"
    | "USER"
    | "ROLE"
    | "COURSE"
    | "BATCH"
    | "SCHOOL"
    | "DEPARTMENT"
    | "YEAR"
    | "SEMESTER"
    | "HOSTEL_BLOCK"
  value: string
}

export interface SendMailRequest {
  targets: MessageTarget[]
  ccTargets?: MessageTarget[]
  bccTargets?: MessageTarget[]
  subject: string
  body: string
  type: string
  attachments?: File[]
}

export interface MailAttachment {
  id: string
  filename: string
  url: string
  mimeType: string
  size: number
}

export interface MailMessage {
  id: string
  messageId: string
  subject: string
  body: string
  senderName: string
  senderEmail: string
  type: string
  createdAt: string
  readAt: string | null
  flagged: boolean
  folder: string
  recipientType: string
  attachments?: MailAttachment[]
}

// ❌ REMOVED - Using FolderResponse from types.ts instead
// export interface FolderResponse {
//   messages: MailMessage[]
//   total: number
//   page: number
//   totalPages: number
// }

// ============================================================================
// ERROR CLASS
// ============================================================================

export class MailAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message)
    this.name = "MailAPIError"
  }
}

// ============================================================================
// TYPE GUARD
// ============================================================================

function isApiError(obj: unknown): obj is ApiErrorBody {
  if (typeof obj !== "object" || obj === null) return false
  const o = obj as Record<string, unknown>
  return (
    typeof o.error === "string" ||
    typeof o.message === "string" ||
    o.success === false
  )
}

// ============================================================================
// CORE REQUEST (JSON)
// ============================================================================

async function request<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const token = getToken()

  if (!token) {
    console.error("[Mail API] No token")
    clearAuth()
    if (typeof window !== "undefined") window.location.href = "/login"
    throw new MailAPIError("Authentication required", 401, "NO_TOKEN")
  }

  const user = getUser()
  const url = `${API_BASE}${path}`
  console.log(`[Mail API] ${init?.method || "GET"} ${path} (user: ${user?.role}:${user?.id})`)

  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    })

    const json: unknown = await res.json().catch(() => null)

    if (res.status === 401 || res.status === 403) {
      console.error("[Mail API] 401/403, logging out")
      clearAuth()
      if (typeof window !== "undefined") window.location.href = "/login"

      let errorMsg = "Session expired. Please login again."
      let errorCode = "TOKEN_EXPIRED"

      if (isApiError(json)) {
        errorMsg = json.message || json.error || errorMsg
        errorCode = json.code || errorCode
      }

      throw new MailAPIError(errorMsg, res.status, errorCode)
    }

    if (!res.ok) {
      let errorMsg = `Request failed (${res.status})`
      let errorCode: string | undefined

      if (isApiError(json)) {
        errorMsg = json.error || json.message || errorMsg
        errorCode = json.code
      }

      console.error("[Mail API] Error:", errorMsg)
      console.error("[Mail API] Response:", json)
      throw new MailAPIError(errorMsg, res.status, errorCode)
    }

    console.log(`[Mail API] ${init?.method || "GET"} ${path} OK`)
    return json as T
  } catch (e) {
    if (e instanceof MailAPIError) throw e
    console.error("[Mail API] Network error:", e)
    throw new MailAPIError("Network error. Please try again.", 0, "NETWORK_ERROR")
  }
}

// ============================================================================
// FOLDER OPERATIONS
// ============================================================================

export async function fetchFolder(
  folder: MailFolderKey,
  opts?: { page?: number; limit?: number; q?: string; type?: string }
): Promise<FolderResponse> {  // ✅ Now returns FolderResponse from types.ts
  const page = opts?.page ?? 1
  const limit = opts?.limit ?? 20
  const q = opts?.q?.trim()
  const type = opts?.type?.trim()

  const qs = new URLSearchParams()
  qs.set("page", String(page))
  qs.set("limit", String(limit))
  if (q) qs.set("q", q)
  if (type && type !== "GENERAL") qs.set("type", type)

  const folderMap: Record<MailFolderKey, string> = {
    inbox: "/inbox",
    sent: "/sent",
    drafts: "/drafts",
    trash: "/trash",
    archived: "/archive",
  }

  const path = `${folderMap[folder]}?${qs.toString()}`
  return request<FolderResponse>(path)
}

export function fetchMessageById(id: string) {
  console.log(`[Mail API] Fetching message by ID: ${id}`)
  return request<ApiSuccess<MailMessage>>(`/messages/${id}`)
}

export function markAsRead(id: string) {
  return request<ApiSuccess<{ message: string }>>(`/messages/${id}/read`, {
    method: "PATCH",
  })
}

export function toggleStar(id: string) {
  return request<ApiSuccess<{ message: string }>>(`/messages/${id}/flag`, {
    method: "PATCH",
  })
}

export function moveToTrash(id: string) {
  return request<ApiSuccess<{ message: string }>>(`/messages/${id}/trash`, {
    method: "PATCH",
  })
}

export function moveToArchive(id: string) {
  return request<ApiSuccess<{ message: string }>>(`/messages/${id}/archive`, {
    method: "PATCH",
  })
}


//-----------------------------------------------------------------------
export function moveToFolder(messageId: string, targetFolder: MailFolderKey) {
  console.log(`[Mail API] Moving message ${messageId} to ${targetFolder}`)
  
  // Map frontend folder keys to backend enum values
  const folderMap: Record<MailFolderKey, string> = {
    inbox: 'INBOX',
    sent: 'SENT',
    drafts: 'DRAFT',
    trash: 'TRASH',
    archived: 'ARCHIVE'
  }

  return request<ApiSuccess<{ message: string }>>(`/messages/${messageId}/move`, {
    method: 'PATCH',
    body: JSON.stringify({ folder: folderMap[targetFolder] })
  })
}


export async function replyToMessage(
  messageId: string,
  body: string,
  replyToAll: boolean = false,
  attachments?: File[]
): Promise<ApiSuccess<{ messageId: string; threadId: string; recipientCount: number; attachmentCount: number }>> {
  const token = getToken()
  const user = getUser()

  if (!token) {
    throw new MailAPIError('Authentication required', 401, 'NO_TOKEN')
  }

  console.log(`[Mail API] Replying to message ${messageId}`)

  const form = new FormData()
  form.append('body', body.trim())
  form.append('replyToAll', String(replyToAll))
  
  if (attachments?.length) {
    attachments.forEach((f) => form.append('attachments', f))
  }

  try {
    const res = await fetch(`${API_BASE}/messages/${messageId}/reply`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    })

    const json: unknown = await res.json().catch(() => null)

    if (res.status === 401 || res.status === 403) {
      console.error('[Mail API] 401/403 on reply, logging out')
      clearAuth()
      if (typeof window !== 'undefined') window.location.href = '/login'

      let errorMsg = 'Session expired. Please login again.'
      let errorCode = 'TOKEN_EXPIRED'

      if (isApiError(json)) {
        errorMsg = json.message || json.error || errorMsg
        errorCode = json.code || errorCode
      }

      throw new MailAPIError(errorMsg, res.status, errorCode)
    }

    if (!res.ok) {
      let errorMsg = `Reply failed (${res.status})`
      let errorCode: string | undefined

      if (isApiError(json)) {
        errorMsg = json.error || json.message || errorMsg
        errorCode = json.code
      }

      console.error('[Mail API] Reply failed:', errorMsg)
      throw new MailAPIError(errorMsg, res.status, errorCode)
    }

    console.log('[Mail API] Reply sent successfully')
    return json as ApiSuccess<{ messageId: string; threadId: string; recipientCount: number; attachmentCount: number }>
  } catch (e) {
    if (e instanceof MailAPIError) throw e
    console.error('[Mail API] Network error on reply:', e)
    throw new MailAPIError('Network error while sending reply', 0, 'NETWORK_ERROR')
  }
}
//-------------------------------------------------------------------------


export function deletePermanent(id: string) {
  return request<ApiSuccess<{ message: string }>>(`/messages/${id}`, {
    method: "DELETE",
  })
}

export function getUnreadCount() {
  return request<ApiSuccess<{ unreadCount: number }>>(`/unread-count`)
}

export function searchMessages(query: string, page = 1, limit = 20) {
  const qs = new URLSearchParams()
  qs.set("q", query)
  qs.set("page", String(page))
  qs.set("limit", String(limit))
  return request<FolderResponse>(`/search?${qs.toString()}`)
}

// ============================================================================
// SEND MAIL (MULTIPART)
// ============================================================================

export async function sendMail(
  data: SendMailRequest
): Promise<ApiSuccess<{ messageId: string; recipientCount: number; attachmentCount: number }>> {
  const token = getToken()
  const user = getUser()

  if (!token) {
    throw new MailAPIError("Authentication required", 401, "NO_TOKEN")
  }

  console.log(`[Mail API] Sending mail from ${user?.role}:${user?.email}`)

  const form = new FormData()
  form.append("targets", JSON.stringify(data.targets))
  if (data.ccTargets?.length) form.append("ccTargets", JSON.stringify(data.ccTargets))
  if (data.bccTargets?.length) form.append("bccTargets", JSON.stringify(data.bccTargets))
  form.append("subject", data.subject)
  form.append("body", data.body)
  form.append("type", data.type)
  if (data.attachments?.length) {
    data.attachments.forEach((f) => form.append("attachments", f))
  }

  try {
    const res = await fetch(`${API_BASE}/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    })

    const json: unknown = await res.json().catch(() => null)

    if (res.status === 401 || res.status === 403) {
      console.error("[Mail API] 401/403 on send, logging out")
      clearAuth()
      if (typeof window !== "undefined") window.location.href = "/login"

      let errorMsg = "Session expired. Please login again."
      let errorCode = "TOKEN_EXPIRED"

      if (isApiError(json)) {
        errorMsg = json.message || json.error || errorMsg
        errorCode = json.code || errorCode
      }

      throw new MailAPIError(errorMsg, res.status, errorCode)
    }

    if (!res.ok) {
      let errorMsg = `Send failed (${res.status})`
      let errorCode: string | undefined

      if (isApiError(json)) {
        errorMsg = json.error || json.message || errorMsg
        errorCode = json.code
      }

      console.error("[Mail API] Send failed:", errorMsg)
      throw new MailAPIError(errorMsg, res.status, errorCode)
    }

    console.log("[Mail API] Mail sent")
    return json as ApiSuccess<{ messageId: string; recipientCount: number; attachmentCount: number }>
  } catch (e) {
    if (e instanceof MailAPIError) throw e
    console.error("[Mail API] Network error on send:", e)
    throw new MailAPIError("Network error while sending mail", 0, "NETWORK_ERROR")
  }
}

// ============================================================================
// ROLE UTILS FOR UI
// ============================================================================

export function getCurrentUserRole() {
  return getUser()?.role ?? null
}

export function canSendTo(kind: MessageTarget["kind"]): boolean {
  const role = getCurrentUserRole()

  if (role === "STUDENT") {
    return kind === "EMAIL"
  }

  if (role === "TEACHER" || role === "WARDEN") {
    return ["EMAIL", "COURSE", "BATCH", "SCHOOL", "DEPARTMENT"].includes(kind)
  }

  if (role === "ADMIN") return true

  return false
}
