// client/components/NotificationBell.tsx
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  Notification,
} from "../lib/notifications";

const MAX_VISIBLE = 10;

// ─── Per-type icons & colors ──────────────────────────────────────────────

function getTypeStyle(type: string): { icon: string; bg: string; text: string } {
  if (type.startsWith("ATTENDANCE"))
    return { icon: "📊", bg: "bg-amber-50", text: "text-amber-600" };
  if (type.startsWith("TASK"))
    return { icon: "📝", bg: "bg-blue-50", text: "text-blue-600" };
  if (type.startsWith("OUTPASS"))
    return { icon: "🚪", bg: "bg-green-50", text: "text-green-600" };
  return { icon: "🔔", bg: "bg-neutral-100", text: "text-neutral-500" };
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Component ────────────────────────────────────────────────────────────

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleNotifications = useMemo(
    () => notifications.slice(0, MAX_VISIBLE),
    [notifications]
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.status === "UNREAD").length,
    [notifications]
  );

  const fetchNotifications = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const data = await getMyNotifications(signal);
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sorted);
    } catch (error: any) {
      if (error?.name !== "AbortError") {
        console.error("Notification fetch failed:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll every 10s
  useEffect(() => {
    const controller = new AbortController();
    fetchNotifications(controller.signal);
    const interval = setInterval(() => fetchNotifications(controller.signal), 10000);
    return () => { controller.abort(); clearInterval(interval); };
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkRead = async (id: string) => {
    // Optimistic
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "READ" as const } : n))
    );
    try {
      await markAsRead(id);
    } catch {
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    // Optimistic
    setNotifications((prev) => prev.map((n) => ({ ...n, status: "READ" as const })));
    try {
      await markAllAsRead();
    } catch {
      fetchNotifications();
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // don't trigger mark-as-read
    // Optimistic
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteNotification(id);
    } catch {
      fetchNotifications();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-100 transition-colors"
        aria-label="Notifications"
      >
        <svg
          className="w-5 h-5 text-neutral-700"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[11px] font-medium rounded-full flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div 
          className="fixed left-4 right-4 top-[72px] sm:absolute sm:left-auto sm:top-auto sm:right-0 z-50 sm:mt-2 sm:w-[400px] bg-white border border-neutral-200 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 ease-out fill-mode-forwards"
          style={{ animationDuration: '0.7s' }}
        >

          {/* Header */}
          <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <span className="text-[13px] font-semibold text-neutral-900">Notifications</span>
              <span className="ml-2 text-[11px] text-neutral-400">{unreadCount} unread</span>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[12px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[440px] overflow-y-auto divide-y divide-neutral-100 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {loading && (
              <div className="py-12 text-center text-neutral-400 text-sm">Loading…</div>
            )}

            {!loading && visibleNotifications.length === 0 && (
              <div className="py-12 text-center text-neutral-400 text-sm">
                <div className="text-3xl mb-2">🔔</div>
                No notifications yet
              </div>
            )}

            {!loading && visibleNotifications.map((n) => {
              const unread = n.status === "UNREAD";
              const style = getTypeStyle(n.type);
              // message is already enriched by getMyNotifications()
              const displayMessage = n.message;

              return (
                <div
                  key={n.id}
                  onClick={() => handleMarkRead(n.id)}
                  className={`group flex gap-3 px-4 py-3 cursor-pointer transition-colors ${unread ? "bg-blue-50/40 hover:bg-blue-50/70" : "hover:bg-neutral-50"
                    }`}
                >
                  {/* Type icon */}
                  <div
                    className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base ${style.bg}`}
                  >
                    {style.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`text-[13px] leading-snug ${unread
                          ? "font-semibold text-neutral-900"
                          : "font-medium text-neutral-700"
                          }`}
                      >
                        {n.title}
                        {unread && (
                          <span className="inline-block ml-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full align-middle" />
                        )}
                      </span>

                      {/* Delete × */}
                      <button
                        onClick={(e) => handleDelete(e, n.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-300 hover:text-neutral-500 text-sm leading-none flex-shrink-0 pt-0.5"
                        aria-label="Dismiss"
                      >
                        ×
                      </button>
                    </div>

                    <p className="text-[12px] text-neutral-500 mt-0.5 leading-relaxed line-clamp-2">
                      {displayMessage}
                    </p>

                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      {formatTime(n.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          {notifications.length > MAX_VISIBLE && (
            <div className="px-4 py-2 text-[11px] text-neutral-400 border-t border-neutral-100">
              Showing latest {MAX_VISIBLE} of {notifications.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}