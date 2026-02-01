// client/src/app/(dashboard)/parent-dashboard/outpass/page.tsx
'use client';

import OutpassTabs from './components/OutpassTabs';

export default function ParentOutpassPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-bold text-2xl mb-6 text-slate-900">
        Outpasses
      </h1>
      <OutpassTabs />
    </div>
  );
}
