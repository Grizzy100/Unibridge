
//server/notification-service/src/services/course.service.ts
import axios from 'axios';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

const serviceHeaders = () => ({
  'x-service-key': process.env.NOTIFICATION_SERVICE_KEY,
});

export async function getEnrolledStudents(courseId: string): Promise<any[]> {
  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/api/courses/${courseId}/enrollments`,
      {
        timeout: 10000,
        headers: serviceHeaders(),
      }
    );
    return response.data?.data || [];
  } catch (error: any) {
    console.error('Error fetching enrolled students:', error.message);
    return [];
  }
}

/**
 * Fetch a single course's details (id, courseCode, courseName) from user-service.
 * Returns null on any error so callers can gracefully fall back to the courseId.
 */
export async function getCourseById(courseId: string): Promise<{ id: string; courseCode: string; courseName: string } | null> {
  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/api/courses/${courseId}`,
      {
        timeout: 5000,
        headers: serviceHeaders(),
      }
    );
    return response.data?.data ?? null;
  } catch (error: any) {
    console.error('Error fetching course by ID:', error.message);
    return null;
  }
}
