//client/src/app/(dashboard)/admin/components/parents/ParentCard.tsx
'use client';

import { useState } from 'react';
import { Button } from '../../../../../../components/ui/button';
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

interface ParentCardProps {
  parent: Parent;
  onDelete: () => void;
}

export function ParentCard({ parent, onDelete }: ParentCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await parentAPI.delete(parent.userId);
      onDelete();
    } catch (err: any) {
      alert(err.message || 'Failed to delete parent');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition">
      <div className="flex justify-between items-start">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-[15px] text-gray-900">
              {parent.firstName} {parent.lastName}
            </p>
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-200">
              {parent.relationship}
            </span>
          </div>
          <p className="text-sm text-gray-600">{parent.user.email}</p>
          <p className="text-xs text-gray-500">Phone: {parent.phoneNumber}</p>
          
          {parent.studentLinks && parent.studentLinks.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 font-medium">Linked Students:</p>
              {parent.studentLinks.map((link, idx) => (
                <p key={idx} className="text-xs text-gray-600">
                  • {link.student.firstName} {link.student.lastName} ({link.student.enrollmentNumber})
                </p>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {!showConfirm ? (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.location.href = `/admin/parents/${parent.userId}`}
              >
                View
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
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
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Confirm'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
