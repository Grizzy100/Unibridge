//client/src/app/(dashboard)/admin/components/wardens/WardenList.tsx

'use client';

import { useState, useEffect } from 'react';
import { Input } from '../../../../../../components/ui/input';
import { WardenCard } from './WardenCard';
import { wardenAPI } from '../../../../../../lib/api';

interface Warden {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  hostelAssigned: string;
  phoneNumber: string;
  user: { email: string };
}

interface WardenListProps {
  type: 'list' | 'active' | 'inactive';
  refresh: number;
}

export function WardenList({ type, refresh }: WardenListProps) {
  const [search, setSearch] = useState('');
  const [wardens, setWardens] = useState<Warden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWardens();
  }, [refresh]);

  const fetchWardens = async () => {
    try {
      setLoading(true);
      const response = await wardenAPI.getAll();
      setWardens(response.data || []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch wardens');
    } finally {
      setLoading(false);
    }
  };

  const filtered = wardens.filter(warden => {
    const searchLower = search.toLowerCase();
    return (
      warden.firstName.toLowerCase().includes(searchLower) ||
      warden.lastName.toLowerCase().includes(searchLower) ||
      warden.employeeId.toLowerCase().includes(searchLower) ||
      warden.user.email.toLowerCase().includes(searchLower) ||
      warden.hostelAssigned.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-500 mt-4">Loading wardens...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">Error loading wardens</h3>
        <p className="text-sm text-gray-500">{error}</p>
        <button 
          onClick={fetchWardens}
          className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search by name, hostel or email..."
          className="w-[320px] text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="space-y-3">
        {filtered.map(warden => (
          <WardenCard 
            key={warden.id} 
            warden={warden}
            onDelete={fetchWardens}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">
              {search ? 'No wardens found matching your search.' : 'No wardens added yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
