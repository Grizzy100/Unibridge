// client/src/lib/outpass.ts
const BASE_URL = process.env.NEXT_PUBLIC_OUTPASS_SERVICE_URL || "http://localhost:3003";

// Outpass API (Student)
export const outpassAPI = {
  // Get student's own outpasses
  getMyOutpasses: async () => {
    const response = await fetch(`${BASE_URL}/api/outpass/my`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch outpasses');
    }
    return response.json();
  },

  // Create outpass with file upload
  create: async (formData: FormData) => {
    const response = await fetch(`${BASE_URL}/api/outpass`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        // Don't set Content-Type for FormData - browser handles it
      },
      body: formData
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create outpass');
    }
    return response.json();
  },

  // Cancel outpass
  cancel: async (outpassId: string) => {
    const response = await fetch(`${BASE_URL}/api/outpass/${outpassId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel outpass');
    }
    return response.json();
  }
};

// Parent Outpass API
export const parentOutpassAPI = {
  // Get pending outpasses for parent's children
  getPending: async () => {
    const response = await fetch(`${BASE_URL}/api/outpass/parent`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch pending outpasses');
    }
    return response.json();
  },

  // Get parent's outpass history with optional filter
  getHistory: async (filter?: 'approved' | 'cancelled') => {
    const url = filter 
      ? `${BASE_URL}/api/outpass/parent-history?filter=${filter}`
      : `${BASE_URL}/api/outpass/parent-history`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch outpass history');
    }
    return response.json();
  },

  // Approve or reject outpass
  approveOrReject: async (outpassId: string, action: 'APPROVE' | 'REJECT') => {
    const response = await fetch(`${BASE_URL}/api/outpass/${outpassId}/parent-approval`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ action })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to process approval');
    }
    return response.json();
  }
};

// Warden Outpass API
export const wardenOutpassAPI = {
  // Get all outpasses for warden approval
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/api/outpass/warden`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch outpasses');
    }
    return response.json();
  },

  // Approve or reject outpass (comment required for rejection)
  approveOrReject: async (outpassId: string, action: 'APPROVE' | 'REJECT', comment?: string) => {
    const body: any = { action };
    if (comment) body.comment = comment;

    const response = await fetch(`${BASE_URL}/api/outpass/${outpassId}/warden-approval`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to process approval');
    }
    return response.json();
  },
  // ✅ NEW: Search students
  searchStudents: async (query: string) => {
    const response = await fetch(`${BASE_URL}/api/outpass/warden/search-students?q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to search students');
    }
    return response.json();
  },

  // ✅ NEW: Get student history (MUSEUM)
  getStudentHistory: async (studentId: string, filters?: { status?: string; type?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    
    const url = params.toString()
      ? `${BASE_URL}/api/outpass/warden/history/${studentId}?${params.toString()}`
      : `${BASE_URL}/api/outpass/warden/history/${studentId}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch student history');
    }
    return response.json();
  }
};

// Admin Outpass API
export const adminOutpassAPI = {
  // Get all outpasses with optional filters
  getAll: async (filters?: { status?: string; type?: string; studentId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.studentId) params.append('studentId', filters.studentId);
    
    const url = params.toString() 
      ? `${BASE_URL}/api/outpass/all?${params.toString()}`
      : `${BASE_URL}/api/outpass/all`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch outpasses');
    }
    return response.json();
  },

  // Delete outpass
  delete: async (outpassId: string) => {
    const response = await fetch(`${BASE_URL}/api/outpass/${outpassId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete outpass');
    }
    return response.json();
  }
};
