// //client/src/app/(dashboard)/admin/components/students/StudentCard.tsx
'use client';

import { useState } from 'react';
import { Button } from '../../../../../../components/ui/button';
import { Badge } from '../../../../../../components/ui/badge';
import { studentAPI } from '../../../../../../lib/api';

interface StudentCardProps {
  student: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    enrollmentNumber: string;
    school: string;
    batch: string;
    year: number;
    semester: number;
    phoneNumber?: string;
    parentContact?: string;
    fatherName?: string;
    motherName?: string;
    user: {
      email: string;
    };
  };
  onDelete: () => void;
}

export function StudentCard({ student, onDelete }: StudentCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await studentAPI.delete(student.userId);
      onDelete();
    } catch (err: any) {
      alert(err.message || 'Failed to delete student');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:bg-gray-50 transition">
      <div className="flex justify-between items-start">
        
        {/* Student Info */}
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-[15px] text-gray-900">
              {student.firstName} {student.lastName}
            </p>
            <Badge className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">
              {student.school}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600">{student.enrollmentNumber}</p>
          <p className="text-xs text-gray-500">{student.user.email}</p>
          <p className="text-xs text-gray-500">
            Batch: {student.batch} • Year {student.year} • Sem {student.semester}
          </p>
          
          {(student.fatherName || student.motherName) && (
            <p className="text-xs text-gray-500">
              Parent: {student.fatherName || student.motherName}
              {student.parentContact && ` (${student.parentContact})`}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!showConfirm ? (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.location.href = `/admin/students/${student.userId}`}
              >
                View
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowConfirm(true)}
              >
                Edit
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







// 'use client';

// import { Button } from '../../../../../../components/ui/button';

// export function StudentCard({ student }: any) {
//   return (
//     <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center justify-between">
//       {/* Left */}
//       <div>
//         <p className="font-semibold text-gray-900">{student.name}</p>
//         <p className="text-sm text-gray-500">{student.enrollment}</p>
//         <p className="text-xs text-muted-foreground">Batch: {student.batch}</p>
//         <p className="text-xs text-muted-foreground">
//           Parent: {student.parentName} ({student.parentPhone})
//         </p>
//       </div>

//       {/* Right: Actions */}
//       <div className="flex items-center gap-2">
//         <Button variant="outline">View</Button>
//         <Button variant="outline">Edit</Button>
//         <Button variant="destructive">Remove</Button>
//       </div>
//     </div>
//   );
// }
// a