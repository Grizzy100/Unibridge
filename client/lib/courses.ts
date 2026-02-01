import { getUser, getToken } from "./auth";

const USER_SERVICE_URL =
  process.env.NEXT_PUBLIC_USER_SERVICE_URL || "http://localhost:3001";

export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  semester: number;
  department: string;
  description?: string;
}

export async function getUserCourses(): Promise<Course[]> {
  try {
    const user = getUser();
    const token = getToken();

    if (!user || !token) {
      throw new Error("Unauthorized");
    }

    const response = await fetch(
      `${USER_SERVICE_URL}/api/students/${user.id}/courses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch courses");
    }

    return data.data || [];
  } catch (error) {
    console.error("[getUserCourses] Error:", error);
    throw error;
  }
}
