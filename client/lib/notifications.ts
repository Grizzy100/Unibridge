//client\lib\notifications.ts
import { getToken } from '../lib/auth'; // YOUR auth lib

const NOTIFICATION_API = 'http://localhost:3008/api/notifications';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  status: 'UNREAD' | 'READ' | 'DELETED';
  createdAt: string;
  data?: any;
}

export async function getMyNotifications() {
  const accessToken = getToken(); // ← YOUR auth function
  if (!accessToken) throw new Error('No token');

  const res = await fetch(`${NOTIFICATION_API}/my`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function getUnreadCount() {
  const accessToken = getToken();
  if (!accessToken) return 0;

  const res = await fetch(`${NOTIFICATION_API}/unread-count`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  return data.data || 0;
}

export async function markAsRead(id: string) {
  const accessToken = getToken();
  if (!accessToken) throw new Error('No token');

  await fetch(`${NOTIFICATION_API}/${id}/read`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
