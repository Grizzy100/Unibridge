'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HiHome,
  HiAcademicCap,
  HiUserGroup,
  HiShieldCheck,
  HiClipboardList,
  HiCreditCard,
  HiX,
} from 'react-icons/hi';
import { MdFamilyRestroom } from "react-icons/md";
import { Button } from '../../../../../components/ui/button';
import { cn } from '../../../../../lib/utils';

// ✅ FIXED: All routes start with /admin
const menuItems = [
  { name: 'Home', href: '/admin', icon: HiHome },
  { name: 'Students', href: '/admin/students', icon: HiUserGroup },
  { name: 'Teachers', href: '/admin/teachers', icon: HiAcademicCap },
  { name: 'Warden', href: '/admin/warden', icon: HiShieldCheck },
  { name: 'Parents', href: '/admin/parents', icon: MdFamilyRestroom },
  { name: 'Outpass', href: '/admin/outpass', icon: HiClipboardList },
  { name: 'Fees', href: '/admin/fees', icon: HiCreditCard },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

export function Sidebar({ isOpen, onClose, darkMode, onDarkModeToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">AdminHub</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <HiX className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
            Main
          </div>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer',
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Dark mode toggle */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onDarkModeToggle}
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-10.121l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1zm0 6a1 1 0 100-2H3a1 1 0 000 2h1zm1.464-4.464l-.707.707a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414zm10.121-1.121l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 111.414-1.414zM17 3a1 1 0 100-2h-1a1 1 0 000 2h1z" clipRule="evenodd"></path>
                </svg>
              )}
              <span>Dark Mode</span>
            </div>
            <div
              className={cn(
                'w-11 h-6 rounded-full transition-colors',
                darkMode ? 'bg-blue-600' : 'bg-gray-300'
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 bg-white rounded-full mt-0.5 transition-transform',
                  darkMode ? 'ml-5' : 'ml-0.5'
                )}
              />
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
