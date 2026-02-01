//client/src/app/(dashboard)/admin/components/teachers/TeacherCard.tsx
'use client';

import { useState } from 'react';
import { Button } from '../../../../../../components/ui/button';
import { Badge } from '../../../../../../components/ui/badge';
import { teacherAPI } from '../../../../../../lib/api';

interface Teacher {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  department: string;
  designation: string;
  specialization?: string;
  phoneNumber?: string;
  user: { email: string };
}

interface TeacherCardProps {
  teacher: Teacher;
  onDelete: () => void;
}

export function TeacherCard({ teacher, onDelete }: TeacherCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await teacherAPI.delete(teacher.userId);
      onDelete();
    } catch (err: any) {
      alert(err.message || 'Failed to delete teacher');
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
              {teacher.firstName} {teacher.lastName}
            </p>
            <Badge className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">
              {teacher.department}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">{teacher.employeeId}</p>
          <p className="text-xs text-gray-500">{teacher.user.email}</p>
          <p className="text-xs text-gray-500">Designation: {teacher.designation}</p>
          {teacher.specialization && (
            <p className="text-xs text-gray-500">Specialization: {teacher.specialization}</p>
          )}
          {teacher.phoneNumber && (
            <p className="text-xs text-gray-500">Phone: {teacher.phoneNumber}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          {!showConfirm ? (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.location.href = `/admin/teachers/${teacher.userId}`}
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
