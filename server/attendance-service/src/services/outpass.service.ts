
//server/attendance-service/src/services/outpass.service.ts
import axios from 'axios';
const OUTPASS_SERVICE_URL = process.env.OUTPASS_SERVICE_URL || 'http://localhost:3003';
export async function checkStudentOutpass(
  studentId: string,
  sessionDate: Date,
  token?: string
): Promise<boolean> {
  try {
    const isoDate = sessionDate.toISOString();
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    console.log('[checkStudentOutpass] url =',
      `${OUTPASS_SERVICE_URL}/api/outpass/check-active/${studentId}`,
      'date =', isoDate
    );
    const response = await axios.get(
      `${OUTPASS_SERVICE_URL}/api/outpass/check-active/${studentId}`,
      {
        params: { date: isoDate },
        timeout: 5000,
        headers
      }
    );
    console.log('[checkStudentOutpass] response.data =', response.data);
    return !!response.data?.hasActiveOutpass;
  } catch (error: any) {
    console.error('Error checking outpass:', error.message);
    // If outpass service is down, assume no outpass
    return false;
  }
}
