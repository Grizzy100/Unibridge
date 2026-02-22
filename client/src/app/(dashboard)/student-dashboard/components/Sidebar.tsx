'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  FiHome,
  FiCalendar,
  FiBook,
  FiFileText,
  FiUser,
  FiClock,
  FiSettings,
} from 'react-icons/fi';
import { MdOutlineFactCheck } from "react-icons/md";
import { FaUniversity } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa6";
import { MdOutlineTaskAlt } from "react-icons/md";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { icon: FaUniversity, label: 'Home', path: '/student-dashboard' },
    { icon: FiCalendar, label: 'Attendance', path: '/student-dashboard/attendance' },
    { icon: FiFileText, label: 'Outpass', path: '/student-dashboard/outpass' },
    { icon: FiClock, label: 'Schedule', path: '/student-dashboard/schedule' },
    { icon: MdOutlineTaskAlt, label: 'Task', path: '/student-dashboard/task' },
    { icon: MdOutlineFactCheck, label: 'Reports', path: '/student-dashboard/reports' },
    { icon: FiUser, label: 'Teacher Info', path: '/student-dashboard/teacher-info' },
  ];

  return (
    <aside className="w-64 bg-[#FAFBFC] border-r border-gray-200/60 flex flex-col h-screen sticky top-0">

      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
            <FaGraduationCap className="text-white text-[15px]" />
          </div>

          <span className="font-semibold text-[15px] tracking-tight text-slate-900">
            Unibridge
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">

        {menuItems.map((item) => {

          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="relative group w-full"
            >

              {/* active indicator */}
              <div
                className={`
                absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full
                transition-all duration-200
                ${isActive ? "bg-slate-900" : "bg-transparent"}
                `}
              />

              <div
                className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14.5px] font-medium tracking-[-0.01em]
                transition-all duration-200 ease-out

                ${isActive
                    ? "bg-slate-900/5 text-slate-900"
                    : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900"
                  }
                `}
              >

                <Icon
                  className={`
                  text-[18px] transition-colors duration-200
                  ${isActive
                      ? "text-slate-900"
                      : "text-slate-500 group-hover:text-slate-700"
                    }
                  `}
                />

                {item.label}

              </div>

            </button>
          );
        })}

      </nav>

      {/* Settings */}
      <div className="px-3 py-4 border-t border-gray-200/60">

        <button className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14.5px] font-medium text-slate-600 hover:bg-slate-900/5 hover:text-slate-900 transition-all">

          <FiSettings className="text-[18px] text-slate-500 group-hover:text-slate-700" />

          Settings

        </button>

      </div>

    </aside>
  );
}