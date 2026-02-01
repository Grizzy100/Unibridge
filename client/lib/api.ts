// //client/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Student API
export const studentAPI = {
  create: async (data: any) => {
    const response = await fetch(`${API_URL}/profiles/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create student');
    }
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/profiles/students`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  },

  getById: async (userId: string) => {
    const response = await fetch(`${API_URL}/profiles/students/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch student');
    return response.json();
  },

  delete: async (userId: string) => {
    const response = await fetch(`${API_URL}/profiles/students/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
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
    const response = await fetch(`${API_URL}/profiles/teachers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create teacher');
    }
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/profiles/teachers`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch teachers');
    return response.json();
  },

  getById: async (userId: string) => {
    const response = await fetch(`${API_URL}/profiles/teachers/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch teacher');
    return response.json();
  },

  delete: async (userId: string) => {  // ✅ ADD THIS METHOD
    const response = await fetch(`${API_URL}/profiles/teachers/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
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
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
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
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  getById: async (courseId: string) => {
    const response = await fetch(`${API_URL}/courses/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
  },

  getStudentCourses: async (studentId: string) => {
    const response = await fetch(`${API_URL}/courses/student/${studentId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch student courses');
    return response.json();
  },

  enroll: async (studentId: string, courseId: string) => {
    const response = await fetch(`${API_URL}/courses/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
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
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
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
    const response = await fetch(`${API_URL}/profiles/wardens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create warden');
    }
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/profiles/wardens`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch wardens');
    return response.json();
  },

  getById: async (userId: string) => {
    const response = await fetch(`${API_URL}/profiles/wardens/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch warden');
    return response.json();
  },

  delete: async (userId: string) => {
    const response = await fetch(`${API_URL}/profiles/wardens/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
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
    const response = await fetch(`${API_URL}/profiles/parents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create parent');
    }
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/profiles/parents`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch parents');
    return response.json();
  },

  getById: async (userId: string) => {
    const response = await fetch(`${API_URL}/profiles/parents/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch parent');
    return response.json();
  },

  delete: async (userId: string) => {
    const response = await fetch(`${API_URL}/profiles/parents/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete parent');
    }
    return response.json();
  }
};









// const API_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || "http://localhost:3001";

// export async function apiRequest(endpoint: string, options: RequestInit = {}) {
//   const token = localStorage.getItem("token");
  
//   const response = await fetch(`${API_URL}${endpoint}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     },
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Request failed");
//   }

//   return data;
// }

// // Student APIs
// export const studentAPI = {
//   create: (data: any) => apiRequest("/api/profiles/students", {
//     method: "POST",
//     body: JSON.stringify(data),
//   }),
//   getAll: () => apiRequest("/api/profiles/students"),
//   getById: (userId: string) => apiRequest(`/api/profiles/students/${userId}`),
// };

// // Teacher APIs
// export const teacherAPI = {
//   create: (data: any) => apiRequest("/api/profiles/teachers", {
//     method: "POST",
//     body: JSON.stringify(data),
//   }),
//   getAll: () => apiRequest("/api/profiles/teachers"),
//   getById: (userId: string) => apiRequest(`/api/profiles/teachers/${userId}`),
// };

// // Course APIs
// export const courseAPI = {
//   create: (data: any) => apiRequest("/api/courses", {
//     method: "POST",
//     body: JSON.stringify(data),
//   }),
//   getAll: () => apiRequest("/api/courses"),
//   enroll: (studentId: string, courseId: string) => apiRequest("/api/courses/enroll", {
//     method: "POST",
//     body: JSON.stringify({ studentId, courseId }),
//   }),
//   getStudentCourses: (studentId: string) => apiRequest(`/api/courses/student/${studentId}`),
//   getTeacherCourses: (teacherId: string) => apiRequest(`/api/courses/teacher/${teacherId}`),
// };

// // Parent-Student APIs
// export const parentStudentAPI = {
//   link: (parentId: string, studentId: string, relationship: string, isPrimary?: boolean) =>
//     apiRequest("/api/parent-student/link", {
//       method: "POST",
//       body: JSON.stringify({ parentId, studentId, relationship, isPrimary }),
//     }),
//   getParentChildren: (parentId: string) =>
//     apiRequest(`/api/parent-student/parent/${parentId}/children`),
//   getStudentParents: (studentId: string) =>
//     apiRequest(`/api/parent-student/student/${studentId}/parents`),
// };
