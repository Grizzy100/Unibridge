//server/notification-service/src/services/user.service.ts
import axios from 'axios';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
// Get all warden user IDs
export async function getAllWardenUserIds(): Promise<string[]> {
  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/api/profile/wardens-ids`,
      { timeout: 5000 }
    );
    
    // wardens-ids route should return array of userIds directly
    return response.data?.data || [];
  } catch (error: any) {
    console.error('Error fetching warden user IDs:', error.message);
    return [];
  }
}
// Get parent details for a student (by StudentProfile.id)
export async function getParentsByStudentId(studentProfileId: string): Promise<any[]> {
  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/api/profile/students/profile/${studentProfileId}/parents`,
      { timeout: 5000 }
    );
    return response.data?.data || [];
  } catch (error: any) {
    console.error('Error fetching parents for student:', error.message);
    return [];
  }
}
// Get student details by StudentProfile.id
export async function getStudentById(studentProfileId: string): Promise<any> {
  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/api/profile/students/profile/${studentProfileId}`,
      { timeout: 5000 }
    );
    return response.data?.data || null;
  } catch (error: any) {
    console.error('Error fetching student by profile ID:', error.message);
    return null;
  }
}
