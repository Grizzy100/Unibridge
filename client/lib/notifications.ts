// client/lib/notifications.ts
import { getToken } from '../lib/auth';

const NOTIFICATION_API =
  process.env.NEXT_PUBLIC_NOTIFICATION_URL ?? 'http://localhost:3008/api/notifications';

const USER_SERVICE =
  process.env.NEXT_PUBLIC_USER_SERVICE_URL ?? 'http://localhost:3001';

// ─── Typed data payloads ───────────────────────────────────────────────────

export interface AttendanceLowData {
  courseId: string;
  courseName?: string;
  courseCode?: string;
  percentage: number;
  totalClasses: number;
  attendedClasses: number;
  absentClasses: number;
}

export interface TaskCreatedData {
  taskId: string;
  courseId: string;
  title: string;
  description?: string;
  dueDate: string;
  maxMarks?: number;
}

export interface TaskGradedData {
  taskId: string;
  taskTitle: string;
  marks: number;
  feedback?: string;
}

export interface WeeklySummaryData {
  overallPercentage: number;
  totalCourses: number;
  totalClassesThisWeek: number;
  attendedThisWeek: number;
}

export type NotificationData =
  | AttendanceLowData
  | TaskCreatedData
  | TaskGradedData
  | WeeklySummaryData
  | Record<string, unknown>;

// ─── Notification type ─────────────────────────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type:
  | 'ATTENDANCE_LOW'
  | 'WEEKLY_SUMMARY'
  | 'TASK_CREATED'
  | 'TASK_GRADED'
  | 'TASK_DEADLINE_EXTENDED'
  | 'TASK_RESUBMISSION'
  | 'OUTPASS_CREATED'
  | 'OUTPASS_APPROVED'
  | 'OUTPASS_REJECTED'
  | (string & {});
  status: 'UNREAD' | 'READ' | 'DELETED';
  createdAt: string;
  data?: NotificationData;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function authHeaders(): HeadersInit {
  const token = getToken();
  if (!token) throw new Error('Unauthenticated');
  return { Authorization: `Bearer ${token}` };
}

async function parseOrThrow<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = (body as any)?.message ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body as T;
}

// ─── Course name resolver ──────────────────────────────────────────────────

/** In-memory cache so the same courseId is only fetched once per session */
const courseNameCache: Map<string, string> = new Map();

async function fetchCourseLabels(courseIds: string[]): Promise<void> {
  await Promise.allSettled(
    courseIds.map(async (id) => {
      try {
        const res = await fetch(`${USER_SERVICE}/api/courses/${id}`, {
          headers: authHeaders(),
        });
        if (!res.ok) return;
        const body = await res.json();
        const c = body?.data;
        if (c?.courseName) {
          const label = c.courseCode
            ? `${c.courseName} (${c.courseCode})`
            : c.courseName;
          courseNameCache.set(id, label);
        }
      } catch {
        // ignore — fallback to raw id
      }
    })
  );
}

/** Matches cuid-like IDs (starts with 'c', 24+ alphanumeric chars) */
const RAW_ID_RE = /\bc[a-z0-9]{24,}\b/g;

/**
 * Takes all notifications, batch-fetches any missing course names from
 * user-service, then patches the message strings in-place.
 *
 * The cache is always applied in step 2 — even when every ID was already
 * cached — so messages stay patched on every poll, not just the first one.
 */
async function enrichWithCourseNames(notifications: Notification[]): Promise<Notification[]> {
  // Step 1: fetch course names that aren't cached yet
  const idsToFetch = [
    ...new Set(
      notifications
        .map((n) => (n.data as Record<string, any> | undefined)?.courseId as string | undefined)
        .filter((id): id is string => !!id && !courseNameCache.has(id))
    ),
  ];

  if (idsToFetch.length > 0) {
    await fetchCourseLabels(idsToFetch);
  }

  // Step 2: patch messages using the cache.
  // This always runs — subsequent polls find IDs already cached and still need patching.
  return notifications.map((n) => {
    const d = n.data as Record<string, any> | undefined;
    // Skip notifications that already have a resolved courseName stored in data
    if (!d?.courseId || d.courseName) return n;

    const label = courseNameCache.get(d.courseId);
    if (!label) return n;

    RAW_ID_RE.lastIndex = 0;
    const patchedMessage = n.message.replace(RAW_ID_RE, (match) =>
      match === d.courseId ? label : match
    );

    return { ...n, message: patchedMessage };
  });
}

// ─── API ───────────────────────────────────────────────────────────────────

export async function getMyNotifications(signal?: AbortSignal): Promise<Notification[]> {
  const res = await fetch(`${NOTIFICATION_API}/my`, { headers: authHeaders(), signal });
  const body = await parseOrThrow<ApiResponse<Notification[]>>(res);
  const raw = body.data ?? [];

  // Enrich old notifications whose stored message contains a raw courseId
  return enrichWithCourseNames(raw);
}

export async function getUnreadCount(signal?: AbortSignal): Promise<number> {
  try {
    const token = getToken();
    if (!token) return 0;
    const res = await fetch(`${NOTIFICATION_API}/unread-count`, {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });
    const body = await parseOrThrow<ApiResponse<{ count: number }>>(res);
    return body.data?.count ?? 0;
  } catch (err: unknown) {
    if ((err as any)?.name === 'AbortError') return 0;
    console.error('[Notifications] getUnreadCount failed:', err);
    return 0;
  }
}

export async function markAsRead(id: string): Promise<void> {
  if (!id) throw new Error('Notification id is required');
  const res = await fetch(`${NOTIFICATION_API}/${id}/read`, {
    method: 'PATCH',
    headers: authHeaders(),
  });
  await parseOrThrow<ApiResponse<null>>(res);
}

export async function markAllAsRead(): Promise<void> {
  const res = await fetch(`${NOTIFICATION_API}/read-all`, {
    method: 'PATCH',
    headers: authHeaders(),
  });
  await parseOrThrow<ApiResponse<null>>(res);
}

export async function deleteNotification(id: string): Promise<void> {
  if (!id) throw new Error('Notification id is required');
  const res = await fetch(`${NOTIFICATION_API}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  await parseOrThrow<ApiResponse<null>>(res);
}
