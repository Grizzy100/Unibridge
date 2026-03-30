'use client';

// client/src/app/(dashboard)/student-dashboard/components/Sidebar.tsx
// Dynamically hides the Outpass menu item for day-scholar students
// (hostelAssigned === false in the DB)

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiCalendar,
  FiBook,
  FiFileText,
  FiUser,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi';
import { MdOutlineFactCheck } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa6";
import { TbSmartHome } from "react-icons/tb";
import { RiQrScan2Line, RiPassValidLine } from "react-icons/ri";
import { GrTasks, GrSchedules } from "react-icons/gr";
import { SiProtonmail } from "react-icons/si";
import { getMyStudentProfile } from '../../../../../lib/studentProfile';
import { getUnreadCount } from '../../../../../lib/mail';
import { clearAuth } from '../../../../../lib/auth';
import { cn } from '../../../../../lib/utils';
import { Button } from '../../../../../components/ui/button';
import { FiX } from 'react-icons/fi';

type MenuItem = {
  icon: React.ElementType;
  label: string;
  path: string;
  hostelOnly?: boolean;  // true = hidden for day scholars
  showBadge?: boolean;
};

const ALL_MENU_ITEMS: MenuItem[] = [
  { icon: TbSmartHome,         label: 'Home',         path: '/student-dashboard' },
  { icon: RiQrScan2Line,       label: 'Attendance',   path: '/student-dashboard/attendance' },
  { icon: RiPassValidLine,     label: 'Outpass',      path: '/student-dashboard/outpass', hostelOnly: true },
  { icon: GrSchedules,         label: 'Schedule',     path: '/student-dashboard/schedule' },
  { icon: GrTasks,             label: 'Task',         path: '/student-dashboard/task' },
  { icon: SiProtonmail,        label: 'Mail',         path: '/student-dashboard/mail', showBadge: true },
  { icon: MdOutlineFactCheck,  label: 'Reports',      path: '/student-dashboard/reports' },
  { icon: FiUser,              label: 'Teacher Info', path: '/student-dashboard/teacher-info' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isExpanded?: boolean;
}

export default function Sidebar({ isOpen = false, onClose, isExpanded = true }: SidebarProps) {
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
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 transition-all duration-300 ease-in-out md:translate-x-0 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        isExpanded ? 'md:w-64' : 'md:w-[80px]'
      )}
      aria-expanded={isOpen}
    >

      {/* Logo */}
      <div className={cn("h-16 flex items-center px-4 sm:px-6 border-b border-gray-200 pt-[max(0px,env(safe-area-inset-top))] transition-all duration-300", isExpanded ? "justify-between" : "justify-between md:justify-center")}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex shrink-0 items-center justify-center shadow-sm">
            <FaGraduationCap className="text-white text-[15px]" />
          </div>

          <span className={cn("font-semibold text-base text-slate-900 whitespace-nowrap tracking-tight", !isExpanded && "md:hidden")}>
            StudentHub
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden p-3 -mr-2"
          onClick={onClose}
          aria-label="Close Sidebar"
        >
          <FiX className="w-5 h-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto w-full">
        <div className={cn("text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3 whitespace-nowrap", !isExpanded && "md:hidden")}>
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
                flex items-center gap-3 py-2.5 rounded-lg text-[14px] font-medium
                transition-all duration-200
                ${isExpanded ? "px-3 justify-start" : "px-3 md:px-0 justify-start md:justify-center"}
                ${isActive
                    ? "bg-slate-50 border border-slate-200 shadow-sm text-slate-900"
                    : "text-slate-500 border border-transparent hover:bg-slate-50 hover:text-slate-900"      
                  }
                `}
                title={!isExpanded ? item.label : undefined}
              >

                <div
                  className={`relative flex h-5 w-5 shrink-0 items-center justify-center transition-colors
                    ${isActive
                      ? "text-slate-900"
                      : "text-slate-400 group-hover:text-slate-700"
                    }
                  `}
                >
                  <Icon
                    className={`
                    text-lg transition-colors duration-200
                    `}
                  />
                  {item.showBadge && unreadMails > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">    
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-900"></span>
                    </span>
                  )}
                </div>

                <span className={cn("flex-1 text-left whitespace-nowrap tracking-wide", !isExpanded && "md:hidden")}>{item.label}</span>

              </div>

            </button>
          );
        })}

      </nav>

      {/* Settings & Logout */}
      <div className="px-4 py-4 mt-auto border-t border-slate-200 pb-[max(2rem,env(safe-area-inset-bottom))] flex flex-col gap-1">

        <button 
          title={!isExpanded ? "Settings" : undefined}
          className={cn(
            "group w-full flex items-center gap-3 py-2.5 rounded-lg text-[14px] font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent transition-all",
            isExpanded ? "px-3 justify-start" : "px-3 md:px-0 justify-start md:justify-center"
          )}
        >   
          <span className="flex h-5 w-5 shrink-0 items-center justify-center transition-colors text-slate-400 group-hover:text-slate-700">
            <FiSettings className="text-lg" />
          </span>
          <span className={cn("whitespace-nowrap tracking-wide", !isExpanded && "md:hidden")}>Settings</span>
        </button>

        <button
          title={!isExpanded ? "Logout" : undefined}
          onClick={() => {
            clearAuth();
            router.push('/login/student');
          }}
          className={cn(
            "group w-full flex items-center gap-3 py-2.5 rounded-lg text-[14px] font-medium text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent transition-all duration-200",
            isExpanded ? "px-3 justify-start" : "px-3 md:px-0 justify-start md:justify-center"
          )}
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center transition-colors text-red-400 group-hover:text-red-600">
            <FiLogOut className="text-lg" />
          </span>
          <span className={cn("whitespace-nowrap tracking-wide", !isExpanded && "md:hidden")}>Logout</span>
        </button>
      </div>

    </aside>
  );
}