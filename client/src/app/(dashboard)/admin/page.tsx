// //client/src/app/(dashboard)/admin/page.tsx

'use client';

import { Button } from '../../../../components/ui/button';
import { StatCard } from './components/StatCard';
import { EnrollmentChart } from './components/EnrollmentChart';
import { RecentActivity } from './components/RecentActivity';
import { FeeCollectionChart } from './components/FeeCollectionChart';

import {
  HiUserGroup,
  HiAcademicCap,
  HiShieldCheck,
  HiClipboardCheck,
} from 'react-icons/hi';

// Dashboard data
const statCards = [
  {
    title: 'Total Students',
    value: '1,245',
    change: '+12.5%',
    trend: 'up' as const,
    icon: <HiUserGroup className="w-6 h-6 text-blue-600" />,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Total Teachers',
    value: '87',
    change: '+3.2%',
    trend: 'up' as const,
    icon: <HiAcademicCap className="w-6 h-6 text-emerald-600" />,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    title: 'Total Wardens',
    value: '12',
    change: '0%',
    trend: 'neutral' as const,
    icon: <HiShieldCheck className="w-6 h-6 text-amber-600" />,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    title: 'Active Outpasses',
    value: '34',
    change: '-8.3%',
    trend: 'down' as const,
    icon: <HiClipboardCheck className="w-6 h-6 text-rose-600" />,
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      
      {/* Top Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, Admin</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening with your institution today
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Generate Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EnrollmentChart />
        <RecentActivity />
      </div>

      {/* Fee Collection Chart */}
      <FeeCollectionChart />
    </div>
  );
}
