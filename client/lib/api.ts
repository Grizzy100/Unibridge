// //client/lib/api.ts
import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const resolveToken = () => {
  const token = getToken();
  if (token) return token;

  if (typeof window !== "undefined") {
    const legacyToken = localStorage.getItem("token");
    if (legacyToken) return legacyToken;
  }

  return null;
};

const authHeaders = (options?: { json?: boolean }): HeadersInit => {
  const token = resolveToken();
  if (!token) {
    throw new Error("Authentication required. Please log in again.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (options?.json) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

const buildApiErrorMessage = (error: any, fallback: string): string => {
  if (error?.message && typeof error.message === "string") {
    return error.message;
  }

  if (Array.isArray(error?.errors) && error.errors.length > 0) {
    const details = error.errors
      .map((e: any) => {
        const field = e?.field ? `${e.field}: ` : "";
        const msg = e?.message ?? "Invalid value";
        return `${field}${msg}`;
      })
      .join("; ");

    if (details.trim()) {
      return details;
    }
  }

  return fallback;
};

// Student API
export const studentAPI = {
  create: async (data: any) => {
    const response = await fetch(`${API_URL}/profile/students`, {
      method: 'POST',
      headers: authHeaders({ json: true }),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(buildApiErrorMessage(error, 'Failed to create student'));
    }
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/profile/students`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  },

  getById: async (userId: string) => {
    const response = await fetch(`${API_URL}/profile/students/${userId}`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch student');
    return response.json();
  },

  delete: async (userId: string) => {
    const response = await fetch(`${API_URL}/profile/students/${userId}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete student');
    }
    return response.json();
  }
};

// Teacher API
export const teacherAPI = {
  create: async (data: any) => {
    const response = await fetch(`${API_URL}/profile/teachers`, {
      method: 'POST',
      headers: authHeaders({ json: true }),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(buildApiErrorMessage(error, 'Failed to create teacher'));
    }
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/profile/teachers`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch teachers');
    return response.json();
  },

  getById: async (userId: string) => {
    const response = await fetch(`${API_URL}/profile/teachers/${userId}`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch teacher');
    return response.json();
  },

  delete: async (userId: string) => {  // ✅ ADD THIS METHOD
    const response = await fetch(`${API_URL}/profile/teachers/${userId}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete teacher');
    }
    return response.json();
  }
};

// Course API
export const courseAPI = {
  create: async (data: any) => {
    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: authHeaders({ json: true }),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create course');
    }
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/courses`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  getById: async (courseId: string) => {
    const response = await fetch(`${API_URL}/courses/${courseId}`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
  },

  getStudentCourses: async (studentId: string) => {
    const response = await fetch(`${API_URL}/courses/student/${studentId}`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch student courses');
    return response.json();
  },

  enroll: async (studentId: string, courseId: string) => {
    const response = await fetch(`${API_URL}/courses/enroll`, {
      method: 'POST',
      headers: authHeaders({ json: true }),
      body: JSON.stringify({ studentId, courseId })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to enroll in course');
    }
    return response.json();
  },

  unenroll: async (studentId: string, courseId: string) => {
    const response = await fetch(`${API_URL}/courses/unenroll`, {
      method: 'POST',
      headers: authHeaders({ json: true }),
      body: JSON.stringify({ studentId, courseId })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to unenroll from course');
    }
    return response.json();
  }
};




// Warden API
export const wardenAPI = {
  create: async (data: any) => {
    const response = await fetch(`${API_URL}/profile/wardens`, {
      method: 'POST',
      headers: authHeaders({ json: true }),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(buildApiErrorMessage(error, 'Failed to create warden'));
    }
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/profile/wardens`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch wardens');
    return response.json();
  },

  getById: async (userId: string) => {
    const response = await fetch(`${API_URL}/profile/wardens/${userId}`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch warden');
    return response.json();
  },

  delete: async (userId: string) => {
    const response = await fetch(`${API_URL}/profile/wardens/${userId}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete warden');
    }
    return response.json();
  }
};







// Parent API
export const parentAPI = {
  create: async (data: any) => {
    const response = await fetch(`${API_URL}/profile/parents`, {
      method: 'POST',
      headers: authHeaders({ json: true }),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(buildApiErrorMessage(error, 'Failed to create parent'));
    }
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/profile/parents`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch parents');
    return response.json();
  },

  getById: async (userId: string) => {
    const response = await fetch(`${API_URL}/profile/parents/${userId}`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch parent');
    return response.json();
  },

  delete: async (userId: string) => {
    const response = await fetch(`${API_URL}/profile/parents/${userId}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete parent');
    }
    return response.json();
  }
};








