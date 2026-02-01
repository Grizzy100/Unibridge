
// //server/attendance-service/src/services/user.service.ts
// import axios from 'axios';
// const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
// /**
//  * Resolve StudentProfile.id from a User.id by calling user-service.
//  */
// export async function getStudentProfileIdFromUserId(
//   userId: string,
//   token?: string
// ): Promise<string> {
//   try {
//     const headers: any = {};
//     if (token) {
//       headers.Authorization = `Bearer ${token}`;
//     }
//     // This hits user-service: GET /api/profiles/students/:userId
//     const res = await axios.get(
//       `${USER_SERVICE_URL}/api/profile/students/${userId}`,
//       {
//         timeout: 10000,
//         headers
//       }
//     );
//     const student = res.data?.data;
//     if (!student || !student.id) {
//       throw new Error('Student profile not found');
//     }
//     // student.id is StudentProfile.id (the one used in CourseEnrollment / AttendanceRecord)
//     return student.id;
//   } catch (err: any) {
//     console.error('Error fetching student profile:', err.message);
//     throw new Error('Failed to resolve student profile');
//   }
// }




//server/attendance-service/src/services/user.service.ts

import axios, { AxiosError } from 'axios';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const REQUEST_TIMEOUT = 10000;
const MAX_RETRIES = 2;

interface StudentProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  enrollmentNumber: string;
}

interface ApiResponse {
  success: boolean;
  data?: StudentProfile;
  message?: string;
}

/**
 * Resolve StudentProfile.id from a User.id by calling user-service.
 * Implements retry logic and graceful error handling.
 * 
 * @param userId - User.id from JWT token
 * @param token - JWT token for authentication
 * @returns StudentProfile.id
 * @throws Error if profile cannot be resolved after retries
 */
export async function getStudentProfileIdFromUserId(
  userId: string,
  token?: string
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[user.service] Attempt ${attempt}/${MAX_RETRIES}: Fetching student profile for userId=${userId}`);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.warn('[user.service] No JWT token provided - request may fail if endpoint requires auth');
      }

      const response = await axios.get<ApiResponse>(
        `${USER_SERVICE_URL}/api/profile/students/${userId}`,
        {
          headers,
          timeout: REQUEST_TIMEOUT,
          validateStatus: (status) => status < 500,
        }
      );

      if (response.status === 200 && response.data?.success && response.data?.data?.id) {
        console.log(`[user.service] Resolved: userId=${userId} to studentProfileId=${response.data.data.id}`);
        return response.data.data.id;
      }

      if (response.status === 404) {
        console.error(`[user.service] Student profile not found for userId=${userId}`);
        throw new Error('Student profile not found. Please ensure student account is properly created.');
      }

      if (response.status === 401 || response.status === 403) {
        console.error(`[user.service] Authentication failed (${response.status}):`, response.data);
        throw new Error('Authentication failed. Please log in again.');
      }

      if (response.status >= 400 && response.status < 500) {
        console.error(`[user.service] Client error (${response.status}):`, response.data);
        const errorMsg = response.data?.message || 'Unknown error';
        throw new Error(`Failed to fetch student profile: ${errorMsg}`);
      }

      throw new Error(`Unexpected response: ${response.status} ${response.statusText}`);

    } catch (error) {
      lastError = error as Error;

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
          console.error(`[user.service] Timeout on attempt ${attempt}/${MAX_RETRIES}`);
          if (attempt < MAX_RETRIES) {
            await sleep(1000 * attempt);
            continue;
          }
        }

        if (axiosError.code === 'ECONNREFUSED') {
          console.error(`[user.service] user-service is not running at ${USER_SERVICE_URL}`);
          throw new Error('User service is currently unavailable. Please try again later.');
        }

        if (!axiosError.response) {
          console.error(`[user.service] Network error:`, axiosError.message);
          if (attempt < MAX_RETRIES) {
            await sleep(1000 * attempt);
            continue;
          }
          throw new Error('Network error while fetching student profile. Please check your connection.');
        }
      }

      console.error(`[user.service] Error on attempt ${attempt}:`, lastError.message);
      
      if (lastError.message.includes('not found') || 
          lastError.message.includes('Authentication failed')) {
        throw lastError;
      }

      if (attempt < MAX_RETRIES) {
        await sleep(1000 * attempt);
        continue;
      }
    }
  }

  console.error(`[user.service] Failed to resolve student profile after ${MAX_RETRIES} attempts`);
  throw new Error(
    `Failed to resolve student profile after ${MAX_RETRIES} attempts. ` +
    `Last error: ${lastError?.message || 'Unknown error'}`
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
