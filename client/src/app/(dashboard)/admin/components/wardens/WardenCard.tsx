//client/src/app/(dashboard)/admin/components/wardens/WardenCard.tsx
'use client';

import { useState } from 'react';
import { Button } from '../../../../../../components/ui/button';
import { Badge } from '../../../../../../components/ui/badge';
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

interface WardenCardProps {
  warden: Warden;
  onDelete: () => void;
}

export function WardenCard({ warden, onDelete }: WardenCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await wardenAPI.delete(warden.userId);
      onDelete();
    } catch (err: any) {
      alert(err.message || 'Failed to delete warden');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:bg-gray-50 transition">
      <div className="flex justify-between items-start">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-[15px] text-gray-900">
              {warden.firstName} {warden.lastName}
            </p>
            <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">
              {warden.hostelAssigned}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">{warden.employeeId}</p>
          <p className="text-xs text-gray-500">{warden.user.email}</p>
          <p className="text-xs text-gray-500">Phone: {warden.phoneNumber}</p>
        </div>
        
        <div className="flex gap-2">
          {!showConfirm ? (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.location.href = `/admin/wardens/${warden.userId}`}
              >
                View
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => setShowConfirm(true)}
              >
                Remove
              </Button>
            </>
          ) : (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
