//client/src/app/(dashboard)/parent-dashboard/outpass/components/
'use client';

import { useState, useEffect } from 'react';
import OutpassCard, { Outpass } from './OutpassCard';

type StatusType = 'approved' | 'cancelled' | 'all';

export default function OutpassList({ filter }: { filter: StatusType }) {
  const [outpasses, setOutpasses] = useState<Outpass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let url = 'http://localhost:3003/api/outpass/parent-history';
    if (filter !== 'all') url += `?filter=${filter}`;
    fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unable to fetch history');
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
  }, [filter]);

  if (loading) return <div className="mt-4 text-gray-600">Loading...</div>;
  if (error) return <div className="mt-4 text-red-500">{error}</div>;
  if (outpasses.length === 0)
    return <div className="mt-4 text-gray-500">No {filter} outpass requests.</div>;

  return (
    <div>
      {outpasses.map((outpass) => (
        <OutpassCard key={outpass.id} outpass={outpass} />
      ))}
    </div>
  );
}
