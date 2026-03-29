'use client';

import { useEffect, useRef, useState } from 'react';
import CourseAttendanceCard from '../../student-dashboard/attendance/components/CourseAttendanceCard';
import { sessionAPI, AttendanceSession } from '../../../../../lib/attendance';
import { getToken } from '../../../../../lib/auth';
import { getParentPrimaryWard, ParentWard } from '../../../../../lib/parent';

const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:3001';

interface CourseWithSession {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  activeSession?: AttendanceSession;
}

export default function ParentAttendancePage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseWithSession[]>([]);
  const [ward, setWard] = useState<ParentWard | null>(null);
  const [error, setError] = useState<string | null>(null);

  const POLL_MS = 5000;
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        if (active) {
          setLoading(true);
          setError(null);
        }

        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const linkedWard = await getParentPrimaryWard();
        if (!linkedWard) {
          if (active) {
            setWard(null);
            setCourses([]);
          }
          return;
        }

        if (active) setWard(linkedWard);

        const courseRes = await fetch(
          `${USER_SERVICE_URL}/api/students/${linkedWard.studentUserId}/courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!courseRes.ok) {
          throw new Error('Failed to load ward courses');
        }

        const courseJson = await courseRes.json();
        const enrolledCourses = courseJson.data || [];

        if (!enrolledCourses.length) {
          if (active) setCourses([]);
          return;
        }

        const courseIds = enrolledCourses.map((c: any) => c.id);
        const activeSessions = await sessionAPI.getActiveSessions(courseIds);

        const withSessions: CourseWithSession[] = enrolledCourses.map((course: any) => {
          const activeSession = activeSessions.find((s) => s.courseId === course.id);
          return {
            id: course.id,
            courseCode: course.courseCode,
            courseName: course.courseName,
            credits: course.credits,
            activeSession,
          };
        });

        if (active) setCourses(withSessions);
      } catch (err: any) {
        if (active) {
          setError(err?.message || 'Failed to load attendance data');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    intervalRef.current = window.setInterval(load, POLL_MS);

    return () => {
      active = false;
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-2 pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Attendance</h1>
        <p className="text-slate-600 mt-1">
          {ward ? `Viewing ${ward.studentName}'s class attendance` : 'View your ward\'s class attendance'}
        </p>
      </div>

      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto" />
            <p className="mt-4 text-slate-600">Loading classes...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 font-semibold">Could not load attendance</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      ) : !ward ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
          No ward is linked to this parent account yet.
        </div>
      ) : courses.length === 0 ? (
        <div className="min-h-[250px] flex items-center justify-center">
          <p className="text-slate-500 text-sm">No enrolled courses found for the ward</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <CourseAttendanceCard
              key={course.id}
              course={course}
              readOnly
              subjectUserId={ward.studentUserId}
              onRefresh={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
