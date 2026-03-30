// client/src/app/(dashboard)/student-dashboard/components/DashboardLayout.tsx
'use client';

import { ReactNode, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { cn } from '../../../../../lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {   
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Start closed by default since it acts as an overlay
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Add Toaster Component Here */}
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Default options
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          // Success toast
          success: {
            duration: 4000,
            style: {
              background: '#10b981',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          // Error toast
          error: {
            duration: 5000,
            style: {
              background: '#ef4444',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
          // Loading toast
          loading: {
            style: {
              background: '#3b82f6',
            },
          },
        }}
      />
      
{/* Admin equivalent Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Desktop expanded sidebar backdrop */}
      {isSidebarExpanded && (
        <div
          className="hidden md:block fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarExpanded(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        isExpanded={isSidebarExpanded}
      />

      <div 
        className="flex-1 flex flex-col transition-all duration-300 md:pl-[80px]"
      >
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)} 
          toggleSidebarExpand={() => setIsSidebarExpanded(!isSidebarExpanded)} 
          isSidebarExpanded={isSidebarExpanded}
        />

        <main className="px-4 pt-4 pb-4 sm:p-4 md:p-6 lg:p-8 pb-[max(1rem,env(safe-area-inset-bottom))] max-w-7xl mx-auto w-full flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
