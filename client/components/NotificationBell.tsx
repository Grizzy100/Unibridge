//client\components\NotificationBell.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { 
  getMyNotifications, 
  getUnreadCount, 
  markAsRead,
  Notification 
} from '../lib/notifications';


export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getMyNotifications();
      setNotifications(data || []);
      setUnreadCount(data?.filter((n: Notification) => n.status === 'UNREAD').length || 0);
    } catch (error) {
      console.error('Notifications failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // 10s poll
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, status: 'READ' } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Mark read failed:', error);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'READ' })));
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full hover:bg-gray-100 relative group transition-all duration-200 flex items-center justify-center w-12 h-12"
        title="Notifications"
      >
        <svg className="w-6 h-6 text-gray-700 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11 6 0v-1m-6 0H9" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg border-2 border-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 max-h-96 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-100"
                >
                  Mark all read
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount} unread • Updates every 10s
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              Loading...
            </div>
          )}

          {/* Empty */}
          {!loading && notifications.length === 0 && (
            <div className="p-8 text-center text-gray-500 py-12">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium text-gray-900 mb-1">No notifications</p>
              <p className="text-sm">You'll see updates here</p>
            </div>
          )}

          {/* Notifications List */}
          {!loading && notifications.slice(0, 10).map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-150 cursor-pointer group ${
                notification.status === 'UNREAD' 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm' 
                  : 'bg-white'
              }`}
              onClick={() => handleMarkRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 transition-all duration-200 ${
                  notification.status === 'UNREAD' 
                    ? 'bg-blue-600 scale-110 shadow-sm' 
                    : 'bg-gray-300'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm truncate pr-4 group-hover:text-blue-900">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 flex items-center">
                    <span>{new Date(notification.createdAt).toLocaleString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                    {notification.status === 'UNREAD' && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        New
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Show more indicator */}
          {notifications.length > 10 && (
            <div className="p-4 text-center text-sm text-gray-500 border-t bg-gray-50">
              {notifications.length - 10} more notifications
            </div>
          )}

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50 text-center">
            <button 
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
