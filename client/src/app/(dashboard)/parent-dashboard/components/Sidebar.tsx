//client/arc/app/(dashboard)/parent-dashboard/components/Sidebar.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FiHome, FiCalendar, FiBook, FiFileText, FiCreditCard, FiUser, FiSettings } from 'react-icons/fi';
import { FaGraduationCap } from "react-icons/fa6"; 

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { icon: FiHome, label: 'Home', path: '/parent-dashboard' },
    { icon: FiCreditCard, label: 'Fees', path: '/parent-dashboard/fee' },
    { icon: FiCalendar, label: 'Attendance', path: '/parent-dashboard/attendance' },
    { icon: FiFileText, label: 'Outpass', path: '/parent-dashboard/outpass' },
    { icon: FiBook, label: 'Courses', path: '/parent-dashboard/courses' },
    { icon: FiUser, label: 'My Info', path: '/parent-dashboard/my-info' },
  ];

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <FaGraduationCap className="text-white text-sm" />
          </div>
          <span className="font-bold text-base text-slate-900">Unibridge</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-slate-900 text-white' : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <Icon className="text-lg" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="px-3 py-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
          <FiSettings className="text-lg" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
