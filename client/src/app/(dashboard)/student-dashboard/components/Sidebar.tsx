'use client';

// client/src/app/(dashboard)/student-dashboard/components/Sidebar.tsx
// Dynamically hides the Outpass menu item for day-scholar students
// (hostelAssigned === false in the DB)

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiHome,
  FiCalendar,
  FiBook,
  FiFileText,
  FiUser,
  FiClock,
  FiSettings,
  FiMail,
  FiLogOut,
} from 'react-icons/fi';
import { MdOutlineFactCheck } from "react-icons/md";
import { FaUniversity } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa6";
import { MdOutlineTaskAlt } from "react-icons/md";
import { getMyStudentProfile } from '../../../../../lib/studentProfile';
import { getUnreadCount } from '../../../../../lib/mail';
import { clearAuth } from '../../../../../lib/auth';

type MenuItem = {
  icon: React.ElementType;
  label: string;
  path: string;
  hostelOnly?: boolean;  // true = hidden for day scholars
  showBadge?: boolean;
};

const ALL_MENU_ITEMS: MenuItem[] = [
  { icon: FaUniversity,        label: 'Home',         path: '/student-dashboard' },
  { icon: FiCalendar,          label: 'Attendance',   path: '/student-dashboard/attendance' },
  { icon: FiFileText,          label: 'Outpass',      path: '/student-dashboard/outpass', hostelOnly: true },
  { icon: FiClock,             label: 'Schedule',     path: '/student-dashboard/schedule' },
  { icon: MdOutlineTaskAlt,    label: 'Task',         path: '/student-dashboard/task' },
  { icon: FiMail,              label: 'Mail',         path: '/student-dashboard/mail', showBadge: true },
  { icon: MdOutlineFactCheck,  label: 'Reports',      path: '/student-dashboard/reports' },
  { icon: FiUser,              label: 'Teacher Info', path: '/student-dashboard/teacher-info' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isHosteller, setIsHosteller] = useState<boolean | null>(null); // null = loading
  const [unreadMails, setUnreadMails] = useState(0);

  useEffect(() => {
    getMyStudentProfile()
      .then(profile => setIsHosteller(profile?.hostelAssigned ?? true))
      .catch(() => setIsHosteller(true)); // fail open — API guard still blocks day scholars

    // Fetch unread mail count
    const fetchUnread = async () => {
      try {
        const res = await getUnreadCount();
        setUnreadMails(res.data?.unreadCount || 0);
      } catch (err) {
        console.error('Failed to fetch unread mails', err);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000); // 15s poll

    // Listen to global read event for instant badge drop across tabs
    const handleMailRead = () => setUnreadMails(prev => Math.max(0, prev - 1));
    window.addEventListener('mail:read', handleMailRead);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mail:read', handleMailRead);
    };
  }, []);

  // While loading: show all items except hostelOnly ones (avoid flash)
  const menuItems = ALL_MENU_ITEMS.filter(item => {
    if (!item.hostelOnly) return true;
    // hostelOnly items: show only when isHosteller is confirmed true
    return isHosteller === true;
  });

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">

      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <FaGraduationCap className="text-white text-[15px]" />
          </div>

          <span className="font-semibold text-base text-gray-900">
            StudentHub
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
          Main
        </div>

        {menuItems.map((item) => {

          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="group w-full"
            >
              <div
                className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200

                ${isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >

                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-md transition-colors
                    ${isActive
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                    }
                  `}
                >
                  <Icon
                    className={`
                    text-base transition-colors duration-200
                    `}
                  />
                  {item.showBadge && unreadMails > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                  )}
                </div>

                <span className="flex-1 text-left">{item.label}</span>

              </div>

            </button>
          );
        })}

      </nav>

      {/* Settings & Logout */}
      <div className="px-4 py-4 border-t border-gray-200 pb-8 flex flex-col gap-1">

        <button className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <FiSettings className="text-base" />
          </span>
          Settings
        </button>

        <button 
          onClick={() => {
            clearAuth();
            router.push('/login/student');
          }}
          className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-500 group-hover:bg-red-100 transition-colors">
            <FiLogOut className="text-base" />
          </span>
          Logout
        </button>

      </div>

    </aside>
  );
}