//client/src/app/(dashboard)/parent-dashboard/outpass/components/OutpassQueue.tsx
'use client';

import { useState, useEffect } from 'react';
import OutpassCard, { Outpass } from './OutpassCard';

export default function OutpassQueue() {
  const [outpasses, setOutpasses] = useState<Outpass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch('http://localhost:3003/api/outpass/parent', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unable to fetch requests');
        return res.json();
      })
      .then(data => {
        setOutpasses(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load requests.");
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id: string) => {
    await fetch(`http://localhost:3003/api/outpass/${id}/parent-approval`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ action: 'APPROVE' })
    });
    setOutpasses(prev => prev.filter((op) => op.id !== id));
  };

  const handleReject = async (id: string) => {
    await fetch(`http://localhost:3003/api/outpass/${id}/parent-approval`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ action: 'REJECT' })
    });
    setOutpasses(prev => prev.filter((op) => op.id !== id));
  };

  if (loading)
    return <div className="mt-4 text-gray-600">Loading...</div>;

  if (error)
    return <div className="mt-4 text-red-500">{error}</div>;

  if (outpasses.length === 0)
    return <div className="mt-4 text-gray-500">No pending outpass requests.</div>;

  return (
    <div>
      {outpasses.map((outpass) => (
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
