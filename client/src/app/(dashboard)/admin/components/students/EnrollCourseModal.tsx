//client/src/app/(dashboard)/admin/components/students/EnrollCourseModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../../../../../components/ui/button';
import { courseAPI } from '../../../../../../lib/api';
import { X } from 'lucide-react';

interface EnrollCourseModalProps {
  studentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function EnrollCourseModal({ studentId, onClose, onSuccess }: EnrollCourseModalProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await courseAPI.getAll();
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnroll = async () => {
    if (!selectedCourse) return;
    try {
      setLoading(true);
      await courseAPI.enroll(studentId, selectedCourse);
      onSuccess();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Enroll in Course</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select a course...</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.courseName} ({course.courseCode})
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleEnroll} 
              disabled={!selectedCourse || loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Enrolling...' : 'Enroll'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
