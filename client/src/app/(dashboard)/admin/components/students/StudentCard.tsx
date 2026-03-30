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
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:bg-gray-50 transition">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        
        {/* Student Info */}
        <div className="space-y-2 flex-1 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-[15px] text-gray-900">
              {student.firstName} {student.lastName}
            </p>
            <Badge className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">
              {student.school}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600 font-medium">{student.enrollmentNumber}</p>
            <p className="text-xs text-gray-500 break-all">{student.user.email}</p>
          </div>

          <p className="text-xs text-gray-500 bg-gray-50 inline-block px-2 py-1 rounded">
            Batch: {student.batch} • Year {student.year} • Sem {student.semester}
          </p>
          
          {(student.fatherName || student.motherName) && (
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-2">
              <span className="font-medium">Parent:</span> {student.fatherName || student.motherName}
              {student.parentContact && ` (${student.parentContact})`}
            </p>
          )}
        </div>

        {/* Actions - wrap or full width on tiny screens */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
          {!showConfirm ? (
            <>
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1 sm:flex-none min-w-[44px] min-h-[44px] sm:min-h-0"
                onClick={() => window.location.href = `/admin/students/${student.userId}`}
              >
                View
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1 sm:flex-none min-w-[44px] min-h-[44px] sm:min-h-0"
                onClick={() => setShowConfirm(true)}
              >
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                className="flex-1 sm:flex-none min-w-[44px] min-h-[44px] sm:min-h-0"
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
                className="flex-1 sm:flex-none min-w-[44px] min-h-[44px] sm:min-h-0"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                className="flex-1 sm:flex-none min-w-[44px] min-h-[44px] sm:min-h-0"
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
