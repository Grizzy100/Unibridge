//client/src/app/(dashboard)/admin/components/Navbar.tsx
'use client';

import { HiMenu, HiBell } from 'react-icons/hi';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../components/ui/avatar';
import { Button } from '../../../../../components/ui/button';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-4 sm:px-6 lg:px-8 pt-[max(0px,env(safe-area-inset-top))]">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden p-3"
          onClick={onMenuClick}
          aria-label="Open Sidebar"
        >
          <HiMenu className="w-6 h-6" />
        </Button>

        <div className="flex-1 md:flex-none">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative p-3 min-w-[44px] min-h-[44px]">
            <HiBell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <Avatar className="w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
