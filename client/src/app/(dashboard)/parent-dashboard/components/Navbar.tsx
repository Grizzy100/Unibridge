//client/arc/app/(dashboard)/parent-dashboard/components/Navbar.tsx
'use client';

import { FiSearch, FiBell, FiUser } from 'react-icons/fi';

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search or type a command"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 ml-6">
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <FiBell className="text-xl" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-slate-700 rounded-full flex items-center justify-center">
            <FiUser className="text-white text-sm" />
          </div>
        </button>
      </div>
    </header>
  );
}
