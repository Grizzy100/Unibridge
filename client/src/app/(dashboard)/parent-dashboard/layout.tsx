'use client';

import DashboardLayout from './components/DashboardLayout';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

export default function ParentDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </DashboardLayout>
  );
}
