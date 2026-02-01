//client/src/app/(dashboard)/parent-dashboard/outpass/components/OutpassTabs.tsx
'use client';

import { useState } from 'react';
import OutpassQueue from './OutpassQueue';
import OutpassList from './OutpassList';

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'cancelled', label: 'Cancelled' },
  
];

export default function OutpassTabs() {
  const [active, setActive] = useState('pending');

  return (
    <div className="w-full">
      <div className="flex border-b mb-4 font-medium text-sm">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`py-2 px-6 border-b-2 transition ${
              active === tab.key
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-gray-500 hover:text-slate-700'
            }`}
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {active === 'pending' && <OutpassQueue />}
        {active === 'approved' && <OutpassList filter="approved" />}
        {active === 'cancelled' && <OutpassList filter="cancelled" />}
        {active === 'all' && <OutpassList filter="all" />}
      </div>
    </div>
  );
}
