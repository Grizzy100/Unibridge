//client/src/app/(dashboard)/parent-dashboard/outpass/components/
'use client';

import { useState, useEffect } from 'react';
import OutpassCard, { Outpass } from './OutpassCard';
import { parentOutpassAPI } from '../../../../../../lib/outpass';

type StatusType = 'approved' | 'cancelled' | 'all';

export default function OutpassList({ filter }: { filter: StatusType }) {
  const [outpasses, setOutpasses] = useState<Outpass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');

        const response =
          filter === 'all'
            ? await parentOutpassAPI.getHistory()
            : await parentOutpassAPI.getHistory(filter);

        setOutpasses(response.data || []);
      } catch {
        setError('Failed to load requests.');
      } finally {
        setLoading(false);
      }
    };

    load();
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
