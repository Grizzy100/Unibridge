// client/lib/attendance.ts
const BASE_ATTENDANCE_URL =
  process.env.NEXT_PUBLIC_ATTENDANCE_SERVICE_URL || 'http://localhost:3004';

const ATTENDANCE_API_URL = `${BASE_ATTENDANCE_URL}/api`;

// Types
export type AttendanceStatus = 'PRESENT' | 'ABSENT';
export type SessionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export interface AttendanceSession {
  id: string;
  teacherId: string;
  courseId: string;
  sessionDate: string;
  sessionStartTime: string;
  sessionEndTime: string;
  qrCode: string;
  qrGeneratedAt: string;
  qrExpiresAt: string;
  status: SessionStatus;
  location?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  enrollmentNumber?: string;
  status: AttendanceStatus;
  markedAt?: string;
  hasApprovedOutpass: boolean;
  outpassCheckAt?: string;
  latitude?: number;
  longitude?: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  session?: AttendanceSession;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  percentage: number;
}

export interface CourseAttendanceStats {
  courseId: string;
  totalClasses: number;
  attendedClasses: number;
  absentClasses: number;
  percentage: number;
}

export interface OverallAttendanceStats {
  totalCourses: number;
  overallPercentage: number;
  totalClassesAcrossAllCourses: number;
  totalAttendedAcrossAllCourses: number;
  courseWiseStats: CourseAttendanceStats[];
}

export interface MonthlyTrend {
  month: string;
  year: number;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
}

export interface OutpassImpact {
  totalAbsences: number;
  absencesWithOutpass: number;
  absencesWithoutOutpass: number;
  outpassPercentage: number;
}

export interface RiskCourse {
  courseId: string;
  percentage: number;
}

export interface AttendanceRisk {
  isAtRisk: boolean;
  overallPercentage: number;
  threshold: number;
  atRiskCourses: RiskCourse[];
}

export class AttendanceError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AttendanceError';
  }
}

const getAuthHeaders = (): HeadersInit => {
  try {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  } catch {
    return { 'Content-Type': 'application/json' };
  }
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  if (!response.ok) {
    throw new AttendanceError(data.message || `Request failed`, response.status);
  }
  return (data.data || data) as T;
};

const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout = 10000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error?.name === 'AbortError') {
      throw new AttendanceError('Request timeout', 408, error);
    }
    throw new AttendanceError('Network error: Failed to connect to server', 0, error);
  }
};

export const sessionAPI = {
  getActiveSessions: async (courseIds: string[]): Promise<AttendanceSession[]> => {
    if (!courseIds || courseIds.length === 0) return [];
    const response = await fetchWithTimeout(
      `${ATTENDANCE_API_URL}/sessions/active-sessions?courseIds=${courseIds.join(',')}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse<AttendanceSession[]>(response);
  },
};

export const attendanceAPI = {
  mark: async (data: {
    qrCode: string;
    latitude?: number;
    longitude?: number;
  }): Promise<AttendanceRecord> => {
    const response = await fetchWithTimeout(`${ATTENDANCE_API_URL}/attendance/mark`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<AttendanceRecord>(response);
  },
};

export const formatTime = (date: string): string => {
  try {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return 'Invalid Time';
  }
};
