//server\task-service\src\services\user.service.ts
import axios from 'axios';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface StudentProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  enrollmentNumber: string;
}

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
}

interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  semester: number;
  credits: number;
  teacher?: Teacher;
  teacherId?: string;
}

function getHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}

export async function getStudentProfileIdFromUserId(
  userId: string,
  token?: string
): Promise<string> {
  try {
    // ✅ FIXED: Match user-service route /api/profile/students/:userId
    const url = `${USER_SERVICE_URL}/api/profile/students/${userId}`;
    
    console.log('Fetching student profile from:', url);
    
    const response = await axios.get<ApiResponse<StudentProfile>>(url, {
      headers: getHeaders(token),
      timeout: 20000,
    });

    const studentProfile = response.data?.data;

    if (!studentProfile) {
      throw new Error('Student profile not found in response');
    }

    if (!studentProfile.id) {
      throw new Error('Student profile ID is missing');
    }

    console.log('Found student profile ID:', studentProfile.id);
    
    return studentProfile.id;
  } catch (error: unknown) {
    const err = error as any;
    const status = err.response?.status;
    const message = err.response?.data?.message || err.message || 'Unknown error';
    
    console.error('Failed to fetch student profile:', {
      status,
      message,
      userId,
    });
    
    throw new Error(`Failed to fetch student profile: ${message}`);
  }
}

export async function getTeacherCourses(
  userId: string,
  token?: string
): Promise<Course[]> {
  try {
    // ✅ This should already work since courses are mounted at /api
    const url = `${USER_SERVICE_URL}/api/teachers/${userId}/courses`;
    
    console.log('Fetching teacher courses from:', url);
    
    const response = await axios.get<ApiResponse<Course[]>>(url, {
      headers: getHeaders(token),
      timeout: 10000,
    });

    const courses = response.data?.data ?? [];
    
    console.log(`Found ${courses.length} courses for teacher`);
    
    return courses;
  } catch (error: unknown) {
    const err = error as any;
    const status = err.response?.status;
    const message = err.response?.data?.message || err.message || 'Unknown error';
    
    console.error('Failed to fetch teacher courses:', {
      status,
      message,
      userId,
    });
    
    throw new Error(`Failed to fetch teacher courses: ${message}`);
  }
}

export async function getStudentCourses(
  studentUserId: string,
  token?: string
): Promise<Course[]> {
  try {
    // ✅ This should already work since courses are mounted at /api
    const url = `${USER_SERVICE_URL}/api/students/${studentUserId}/courses`;
    
    console.log('Fetching student courses from:', url);
    console.log('Using student User ID:', studentUserId);
    
    const response = await axios.get<ApiResponse<Course[]>>(url, {
      headers: getHeaders(token),
      timeout: 10000,
    });

    const courses = response.data?.data ?? [];
    
    console.log(`Found ${courses.length} courses for student`);
    
    return courses;
  } catch (error: unknown) {
    const err = error as any;
    const status = err.response?.status;
    const message = err.response?.data?.message || err.message || 'Unknown error';
    
    console.error('Failed to fetch student courses:', {
      status,
      message,
      studentUserId,
    });
    
    throw new Error(`Failed to fetch student courses: ${message}`);
  }
}











// import axios from 'axios';
// const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
// function headers(token?: string) {
//   const h: any = {};
//   if (token) h.Authorization = `Bearer ${token}`;
//   return h;
// }
// export async function getStudentProfileIdFromUserId(userId: string, token?: string) {
//   const res = await axios.get<any>(
//     `${USER_SERVICE_URL}/api/profiles/students/${userId}`,
//     { headers: headers(token), timeout: 5000 }
//   );
  
//   // The response structure from your screenshot:
//   // { "success": true, "data": { "id": "...", "userId": "...", ... } }
//   const studentProfile = res.data?.data;
  
//   if (!studentProfile) {
//     throw new Error('Student profile not found');
//   }
  
//   // Return the StudentProfile.id (NOT userId!)
//   if (!studentProfile.id) {
//     throw new Error(`StudentProfile.id not found. Got: ${JSON.stringify(studentProfile)}`);
//   }
  
//   return studentProfile.id as string;
// }
// export async function getTeacherCourses(userId: string, token?: string) {
//   const res = await axios.get<any>(
//     `${USER_SERVICE_URL}/api/teachers/${userId}/courses`,
//     { headers: headers(token), timeout: 5000 }
//   );
//   return (res.data?.data ?? []) as any[];
// }
// export async function getStudentCourses(userId: string, token?: string) {
//   const res = await axios.get<any>(
//     `${USER_SERVICE_URL}/api/students/${userId}/courses`,
//     { headers: headers(token), timeout: 5000 }
//   );
//   return (res.data?.data ?? []) as any[];
// }
