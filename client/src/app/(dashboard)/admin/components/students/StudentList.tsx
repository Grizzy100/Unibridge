// //client/src/app/(dashboard)/admin/components/students/StudentList.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from '../../../../../../components/ui/input';
import { StudentCard } from './StudentCard';
import { studentAPI } from '../../../../../../lib/api';

interface Student {
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
}

interface StudentListProps {
  type: 'list' | 'active' | 'left';
  refresh: number;
}

export function StudentList({ type, refresh }: StudentListProps) {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [refresh]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAll();
      setStudents(response.data || []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filtered = students.filter(student => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchLower) ||
      student.lastName.toLowerCase().includes(searchLower) ||
      student.enrollmentNumber.toLowerCase().includes(searchLower) ||
      student.user.email.toLowerCase().includes(searchLower);

    // TODO: Add actual active/graduated logic based on your schema
    // For now, show all in all tabs
    return matchesSearch;
  });

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-500 mt-4">Loading students...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">Error loading students</h3>
        <p className="text-sm text-gray-500">{error}</p>
        <button 
          onClick={fetchStudents}
          className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search by name, email, or enrollment..."
          className="w-[320px] text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Students List */}
      <div className="space-y-3">
        {filtered.map(student => (
          <StudentCard 
            key={student.id} 
            student={student} 
            onDelete={fetchStudents}
          />
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">
              {search ? 'No students found matching your search.' : 'No students added yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}















// 'use client';

// import { useState } from 'react';
// import { Input } from '../../../../../../components/ui/input';
// import { StudentCard } from './StudentCard';

// const dummyStudents = [
//   {
//     id: "1",
//     name: "Rahul Sharma",
//     enrollment: "STU12345",
//     parentName: "Rajesh Sharma",
//     phone: "9876543210",
//     parentPhone: "9876501234",
//     batch: "2023-2027",
//     active: true,
//     feePaid: true,
//   },
//   {
//     id: "2",
//     name: "Priya Verma",
//     enrollment: "STU54321",
//     parentName: "Sunita Verma",
//     phone: "9876540000",
//     parentPhone: "9876501111",
//     batch: "2022-2026",
//     active: false,
//     feePaid: false,
//   },
// ];

// export function StudentList({ type }: { type: 'list' | 'active' | 'left' }) {
//   const [search, setSearch] = useState('');

//   const filtered = dummyStudents
//     .filter(student => {
//       if (type === "active") return student.active;
//       if (type === "left") return !student.active;
//       return true;
//     })
//     .filter(s =>
//       s.name.toLowerCase().includes(search.toLowerCase()) ||
//       s.enrollment.toLowerCase().includes(search.toLowerCase())
//     );

//   return (
//     <div className="space-y-4">

//       {/* Search */}
//       <Input
//         placeholder="Search students..."
//         className="w-full max-w-sm"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       {/* List */}
//       <div className="space-y-3">
//         {filtered.map(student => (
//           <StudentCard key={student.id} student={student} />
//         ))}

//         {filtered.length === 0 && (
//           <p className="text-sm text-gray-500">No students found.</p>
//         )}
//       </div>
//     </div>
//   );
// }
