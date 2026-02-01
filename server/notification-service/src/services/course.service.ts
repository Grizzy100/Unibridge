
//server/notification-service/src/services/course.service.ts
import axios from 'axios';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
export async function getEnrolledStudents(courseId: string): Promise<any[]> {
  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/api/courses/${courseId}/enrollments`,
      { timeout: 5000 }
    );
    
    return response.data?.data || [];
  } catch (error: any) {
    console.error('Error fetching enrolled students:', error.message);
    return [];
  }
}
