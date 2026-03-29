//client/src/app/(dashboard)/parent-dashboard/outpass/components/OutpassQueue.tsx
'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import OutpassCard, { Outpass } from './OutpassCard';
import { getToken } from '../../../../../../lib/auth';
import { FiRefreshCw, FiInbox } from 'react-icons/fi';

const OUTPASS_API = process.env.NEXT_PUBLIC_OUTPASS_SERVICE_URL || 'http://localhost:3003';

async function fetchParentOutpasses(): Promise<Outpass[]> {
  const token = getToken();                            // ✅ uses accessToken key
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${OUTPASS_API}/api/outpass/parent`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'Unable to fetch requests');
  }

  const data = await res.json();
  return data.data || [];
}

async function submitApproval(id: string, action: 'APPROVE' | 'REJECT') {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${OUTPASS_API}/api/outpass/${id}/parent-approval`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || `Failed to ${action.toLowerCase()}`);
  }
}

export default function OutpassQueue() {
  const [outpasses, setOutpasses] = useState<Outpass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchParentOutpasses();
      setOutpasses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: string) => {
    try {
      await submitApproval(id, 'APPROVE');
      setOutpasses(prev => prev.filter(op => op.id !== id));
      toast.success('Outpass approved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve');
      load(); // Refresh the list in case it was cancelled by student or already processed
    }
  };

  const handleReject = async (id: string) => {
    try {
      await submitApproval(id, 'REJECT');
      setOutpasses(prev => prev.filter(op => op.id !== id));
      toast.success('Outpass rejected');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject');
      load(); // Refresh the list
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
            <div className="flex justify-between mb-3">
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-40" />
              </div>
              <div className="h-6 bg-gray-200 rounded-full w-28" />
            </div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-sm text-red-700 mb-3">{error}</p>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FiRefreshCw size={12} /> Retry
        </button>
      </div>
    );
  }

  if (outpasses.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center">
        <FiInbox className="mx-auto text-gray-300 mb-3" size={36} />
        <p className="text-sm font-medium text-gray-700">No pending outpass requests</p>
        <p className="text-xs text-gray-500 mt-1">Your ward hasn't submitted any outpass requests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {outpasses.map(outpass => (
        <OutpassCard
          key={outpass.id}
          outpass={outpass}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ))}
    </div>
  );
}
