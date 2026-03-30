//client/src/app/(dashboard)/admin/students/[userId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '../../../../../../components/ui/button';
import { Badge } from '../../../../../../components/ui/badge';
import { Input } from '../../../../../../components/ui/input';
import { ArrowLeft, Mail, Phone, Users, X } from 'lucide-react';
import { getToken } from '../../../../../../lib/auth';

interface Student {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  enrollmentNumber: string;
  email: string;
  school: string;
  batch: string;
  year: number;
  semester: number;
  phoneNumber?: string;
  specialization?: string;
  user: {
    email: string;
  };
}

interface Parent {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  relationship: string;
  user: {
    email: string;
  };
}

interface ParentLink {
  id: string;
  parentId: string;
  studentId: string;
  relationship: string;
  isPrimary: boolean;
  parent: Parent;
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const [student, setStudent] = useState<Student | null>(null);
  const [linkedParents, setLinkedParents] = useState<ParentLink[]>([]);
  const [allParents, setAllParents] = useState<Parent[]>([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParent, setSearchParent] = useState('');

  const getAuthHeaders = (useJson = false): HeadersInit => {
    const token = getToken() || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (useJson) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  };

  useEffect(() => {
    fetchStudentData();
    fetchAllParents();
  }, [userId]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/profile/students/${userId}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Failed to fetch student');
      
      const result = await response.json();
      const studentData = result.data;
      setStudent(studentData);
      await fetchLinkedParents(studentData?.id);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  const fetchLinkedParents = async (studentProfileId?: string) => {
    if (!studentProfileId) {
      setLinkedParents([]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/profile/students/${studentProfileId}/parents`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Failed to fetch linked parents');
      
      const result = await response.json();
      setLinkedParents(result.data || []);
    } catch (err: any) {
      console.error('Error fetching linked parents:', err);
    }
  };

  const fetchAllParents = async () => {
    try {
      const response = await fetch(`${API_BASE}/profile/parents`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Failed to fetch parents');
      
      const result = await response.json();
      setAllParents(result.data || []);
    } catch (err: any) {
      console.error('Error fetching all parents:', err);
    }
  };

  const handleLinkParent = async (parentId: string, relationship: string, isPrimary: boolean) => {
    try {
      const response = await fetch(`${API_BASE}/profile/parent-student-link`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          parentId: parentId,
          studentId: student?.id,
          relationship: relationship,
          isPrimary: isPrimary
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to link parent');
      }

      await fetchLinkedParents(student?.id);
      setShowLinkModal(false);
      setSearchParent('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUnlink = async (parentId: string, studentId: string) => {
    if (!confirm('Are you sure you want to unlink this parent?')) return;

    try {
      const response = await fetch(`${API_BASE}/profile/parent-student-link/${parentId}/${studentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to unlink parent');
      }

      await fetchLinkedParents(student?.id);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredParents = allParents.filter(parent => {
    const searchLower = searchParent.toLowerCase();
    const isAlreadyLinked = linkedParents.some(link => link.parentId === parent.id);
    
    if (isAlreadyLinked) return false;

    return (
      parent.firstName.toLowerCase().includes(searchLower) ||
      parent.lastName.toLowerCase().includes(searchLower) ||
      parent.user.email.toLowerCase().includes(searchLower) ||
      parent.phoneNumber.includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error || 'Student not found'}</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button */}
      <Button 
        variant="outline" 
        onClick={() => router.back()}
        className="gap-2 w-full sm:w-auto min-h-[44px] sm:min-h-0"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Students
      </Button>

      {/* Student Profile Card */}
      <div className="bg-white border border-gray-200 rounded-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
          <div className="w-16 h-16 rounded-md bg-gray-900 flex items-center justify-center text-white text-2xl font-semibold shrink-0">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <div className="flex-1 w-full">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-600 mt-1 text-sm">{student.enrollmentNumber}</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-6 mt-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600 break-all">
                <Mail className="w-4 h-4 shrink-0" />
                {student.user.email}
              </div>
              {student.phoneNumber && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 shrink-0" />
                  {student.phoneNumber}
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-200">
                {student.school}
              </span>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-200">
                Year {student.year}, Sem {student.semester}
              </span>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-200">
                {student.batch}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Linked Parents Section */}
      <div className="bg-white border border-gray-200 rounded-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Linked Parents</h2>
          </div>
          <Button 
            onClick={() => setShowLinkModal(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white w-full sm:w-auto min-h-[44px] sm:min-h-0"
            size="sm"
          >
            + Link Parent
          </Button>
        </div>

        {linkedParents.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-md">
            <Users className="w-10 h-10 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No parents linked yet</p>
            <p className="text-xs mt-1">Click "Link Parent" to add a parent</p>
          </div>
        ) : (
          <div className="space-y-3">
            {linkedParents.map(link => (
              <div key={link.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {link.parent.firstName} {link.parent.lastName}
                      </p>
                      {link.isPrimary && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-300">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {link.parent.user.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      {link.parent.phoneNumber}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {link.relationship}
                    </p>
                  </div>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleUnlink(link.parentId, link.studentId)}
                  >
                    Unlink
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Link Parent Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md max-w-2xl w-full max-h-[80vh] flex flex-col border border-gray-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Link Parent to Student</h3>
              <button 
                onClick={() => {
                  setShowLinkModal(false);
                  setSearchParent('');
                }}
                className="p-2 hover:bg-gray-100 rounded-md transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4 border-b border-gray-200">
              <Input
                placeholder="Search parents by name, email, or phone..."
                value={searchParent}
                onChange={(e) => setSearchParent(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Parent List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {filteredParents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No parents available</p>
                  <p className="text-xs mt-1">
                    {searchParent ? 'Try a different search term' : 'Create a parent first'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredParents.map(parent => (
                    <div 
                      key={parent.id} 
                      className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => {
                        const relationship = prompt('Enter relationship (e.g., Father, Mother, Guardian):');
                        if (!relationship) return;
                        
                        const isPrimary = confirm('Set as primary guardian?');
                        handleLinkParent(parent.id, relationship, isPrimary);
                      }}
                    >
                      <p className="font-medium text-gray-900">
                        {parent.firstName} {parent.lastName}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {parent.user.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        {parent.phoneNumber}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {parent.relationship}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200">
              <Button 
                variant="outline"
                onClick={() => {
                  setShowLinkModal(false);
                  setSearchParent('');
                }}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
