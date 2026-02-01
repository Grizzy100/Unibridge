//client/src/app/(dashboard)/admin/components/parents/ParentList.tsx:

'use client';

import { useState, useEffect } from 'react';
import { Input } from '../../../../../../components/ui/input';
import { ParentCard } from './ParentCard';
import { parentAPI } from '../../../../../../lib/api';

interface Parent {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  relationship: string;
  user: { email: string };
  studentLinks: Array<{
    student: {
      firstName: string;
      lastName: string;
      enrollmentNumber: string;
    };
  }>;
}

interface ParentListProps {
  type: 'list' | 'active' | 'inactive';
  refresh: number;
}

export function ParentList({ type, refresh }: ParentListProps) {
  const [search, setSearch] = useState('');
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchParents();
  }, [refresh]);

  const fetchParents = async () => {
    try {
      setLoading(true);
      const response = await parentAPI.getAll();
      setParents(response.data || []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch parents');
    } finally {
      setLoading(false);
    }
  };

  const filtered = parents.filter(parent => {
    const searchLower = search.toLowerCase();
    return (
      parent.firstName.toLowerCase().includes(searchLower) ||
      parent.lastName.toLowerCase().includes(searchLower) ||
      parent.user.email.toLowerCase().includes(searchLower) ||
      parent.phoneNumber.includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        <p className="text-sm text-gray-500 mt-4">Loading parents...</p>
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
        <h3 className="text-sm font-medium text-gray-900 mb-1">Error loading parents</h3>
        <p className="text-sm text-gray-500">{error}</p>
        <button 
          onClick={fetchParents}
          className="mt-4 text-sm text-gray-900 hover:text-gray-700 font-medium"
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
          placeholder="Search by name, email or phone..."
          className="w-[320px] text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="space-y-3">
        {filtered.map(parent => (
          <ParentCard 
            key={parent.id} 
            parent={parent}
            onDelete={fetchParents}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-md">
            <p className="text-sm text-gray-500">
              {search ? 'No parents found matching your search.' : 'No parents added yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
