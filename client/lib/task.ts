// // client/src/lib/task.ts
// import { getToken, getUser } from './auth';

// const API_BASE = process.env.NEXT_PUBLIC_TASK_SERVICE_URL || 'http://localhost:3005';
// const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:3001';

// // ============= TYPES =============
// export type SubmissionStatus = 
//   | 'PENDING' 
//   | 'SUBMITTED' 
//   | 'LATE' 
//   | 'RESUBMITTING' 
//   | 'GRADED';

// export interface Task {
//   id: string;
//   courseId: string;
//   teacherId: string;
//   title: string;
//   description?: string;
//   type?: string;
//   dueDate: string;
//   questionFileUrl?: string;
//   questionFileType?: string;
//   maxMarks: number;
//   createdAt: string;
//   updatedAt: string;
//   submissions?: TaskSubmission[];
// }

// export interface TaskSubmission {
//   id: string;
//   taskId: string;
//   studentId: string;
//   customDueDate?: string;
//   submittedAt?: string;
//   answerFileUrl?: string;
//   answerFileType?: string;
//   comment?: string;
//   status: SubmissionStatus;
//   marks?: number;
//   feedback?: string;
//   gradedAt?: string;
//   attemptCount: number;
//   createdAt?: string;
//   updatedAt: string;
// }


// export interface CreateTaskInput {
//   courseId: string;
//   title: string;
//   description?: string;
//   type?: string;
//   dueDate: string; // ISO string
// }

// export interface GradeSubmissionInput {
//   marks: number;
//   feedback?: string;
// }

// export interface Course {
//   id: string;
//   courseCode: string;
//   courseName: string;
//   semester: number;
//   credits: number;
//   department?: string;
//   school?: string;
//   teacher?: {
//     firstName: string;
//     lastName: string;
//     employeeId: string;
//   };
// }

// // ============= HELPER =============
// function getHeaders(includeContentType = true): HeadersInit {
//   const token = getToken();
//   const headers: HeadersInit = {};
  
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }
  
//   if (includeContentType) {
//     headers['Content-Type'] = 'application/json';
//   }
  
//   return headers;
// }

// async function handleResponse<T>(response: Response): Promise<T> {
//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ message: 'Request failed' }));
//     throw new Error(error.message || `HTTP ${response.status}`);
//   }
//   return response.json();
// }

// // ============= STUDENT APIs =============

// /**
//  * Get all tasks for the current student (from enrolled courses)
//  */
// export async function getMyTasks(): Promise<{ success: boolean; data: Task[] }> {
//   try {
//     const response = await fetch(`${API_BASE}/api/tasks/my`, {
//       headers: getHeaders(),
//     });
//     return handleResponse(response);
//   } catch (error) {
//     console.error('Error fetching my tasks:', error);
//     throw error;
//   }
// }

// /**
//  * Get single task by ID
//  */
// export async function getTaskById(taskId: string): Promise<{ success: boolean; data: Task }> {
//   try {
//     const response = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
//       headers: getHeaders(),
//     });
//     return handleResponse(response);
//   } catch (error) {
//     console.error('Error fetching task by ID:', error);
//     throw error;
//   }
// }

// /**
//  * Get all tasks for a specific course
//  */
// export async function getCourseTasks(courseId: string): Promise<{ success: boolean; data: Task[] }> {
//   try {
//     const response = await fetch(`${API_BASE}/api/tasks/course/${courseId}`, {
//       headers: getHeaders(),
//     });
//     return handleResponse(response);
//   } catch (error) {
//     console.error('Error fetching course tasks:', error);
//     throw error;
//   }
// }

// /**
//  * Submit a task with file upload
//  */
// export async function submitTask(
//   taskId: string,
//   file: File,
//   comment?: string,
//   onProgress?: (progress: number) => void
// ): Promise<{ success: boolean; data: TaskSubmission }> {
//   const formData = new FormData();
//   formData.append('answerFile', file);
//   if (comment) {
//     formData.append('comment', comment);
//   }

//   // Use XMLHttpRequest for upload progress
//   if (onProgress) {
//     return new Promise((resolve, reject) => {
//       const xhr = new XMLHttpRequest();
      
//       xhr.upload.addEventListener('progress', (e) => {
//         if (e.lengthComputable) {
//           const progress = (e.loaded / e.total) * 100;
//           onProgress(progress);
//         }
//       });

//       xhr.addEventListener('load', () => {
//         if (xhr.status >= 200 && xhr.status < 300) {
//           try {
//             resolve(JSON.parse(xhr.responseText));
//           } catch (err) {
//             reject(new Error('Invalid response from server'));
//           }
//         } else {
//           try {
//             const error = JSON.parse(xhr.responseText);
//             reject(new Error(error.message || xhr.statusText));
//           } catch (err) {
//             reject(new Error(xhr.statusText));
//           }
//         }
//       });

//       xhr.addEventListener('error', () => reject(new Error('Upload failed')));
//       xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

//       const token = getToken();
//       xhr.open('POST', `${API_BASE}/api/submissions/${taskId}`);
//       if (token) {
//         xhr.setRequestHeader('Authorization', `Bearer ${token}`);
//       }
//       xhr.send(formData);
//     });
//   }

//   // Fallback without progress
//   try {
//     const response = await fetch(`${API_BASE}/api/submissions/${taskId}`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${getToken()}`,
//       },
//       body: formData,
//     });

//     return handleResponse(response);
//   } catch (error) {
//     console.error('Error submitting task:', error);
//     throw error;
//   }
// }

// /**
//  * Get student courses for task filtering
//  * ✅ Uses EXISTING endpoint - NO backend changes needed
//  */
// export async function getStudentCoursesForTasks(): Promise<Course[]> {
//   const token = getToken();
//   const user = getUser();
  
//   // Check if user exists and has an id
//   if (!user || !user.id) {
//     console.error('User not found in localStorage');
//     return [];
//   }
  
//   try {
//     // ✅ Use EXISTING endpoint: /api/students/:studentId/courses
//     const response = await fetch(
//       `${USER_SERVICE_URL}/api/students/${user.id}/courses`,
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || 'Failed to fetch courses');
//     }

//     const result = await response.json();
//     return result.success ? result.data : [];
//   } catch (error) {
//     console.error('Error fetching student courses:', error);
//     return [];
//   }
// }

// // ============= TEACHER APIs =============

// /**
//  * Create task without file
//  */
// export async function createTask(data: CreateTaskInput): Promise<{ success: boolean; data: Task }> {
//   try {
//     const response = await fetch(`${API_BASE}/api/tasks`, {
//       method: 'POST',
//       headers: getHeaders(),
//       body: JSON.stringify(data),
//     });
//     return handleResponse(response);
//   } catch (error) {
//     console.error('Error creating task:', error);
//     throw error;
//   }
// }

// /**
//  * Create task with question file
//  */
// export async function createTaskWithFile(
//   data: CreateTaskInput,
//   file: File,
//   onProgress?: (progress: number) => void
// ): Promise<{ success: boolean; data: Task }> {
//   const formData = new FormData();
//   formData.append('questionFile', file);
//   formData.append('courseId', data.courseId);
//   formData.append('title', data.title);
//   if (data.description) formData.append('description', data.description);
//   if (data.type) formData.append('type', data.type);
//   formData.append('dueDate', data.dueDate);

//   if (onProgress) {
//     return new Promise((resolve, reject) => {
//       const xhr = new XMLHttpRequest();
      
//       xhr.upload.addEventListener('progress', (e) => {
//         if (e.lengthComputable) {
//           onProgress((e.loaded / e.total) * 100);
//         }
//       });

//       xhr.addEventListener('load', () => {
//         if (xhr.status >= 200 && xhr.status < 300) {
//           try {
//             resolve(JSON.parse(xhr.responseText));
//           } catch (err) {
//             reject(new Error('Invalid response from server'));
//           }
//         } else {
//           try {
//             const error = JSON.parse(xhr.responseText);
//             reject(new Error(error.message || xhr.statusText));
//           } catch (err) {
//             reject(new Error(xhr.statusText));
//           }
//         }
//       });

//       xhr.addEventListener('error', () => reject(new Error('Upload failed')));

//       const token = getToken();
//       xhr.open('POST', `${API_BASE}/api/tasks/with-file`);
//       if (token) {
//         xhr.setRequestHeader('Authorization', `Bearer ${token}`);
//       }
//       xhr.send(formData);
//     });
//   }

//   try {
//     const response = await fetch(`${API_BASE}/api/tasks/with-file`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${getToken()}`,
//       },
//       body: formData,
//     });

//     return handleResponse(response);
//   } catch (error) {
//     console.error('Error creating task with file:', error);
//     throw error;
//   }
// }

// /**
//  * Grade a student's submission
//  */
// export async function gradeSubmission(
//   taskId: string,
//   studentId: string,
//   data: GradeSubmissionInput
// ): Promise<{ success: boolean; data: TaskSubmission }> {
//   try {
//     const response = await fetch(
//       `${API_BASE}/api/submissions/${taskId}/student/${studentId}/grade`,
//       {
//         method: 'PATCH',
//         headers: getHeaders(),
//         body: JSON.stringify(data),
//       }
//     );
//     return handleResponse(response);
//   } catch (error) {
//     console.error('Error grading submission:', error);
//     throw error;
//   }
// }


// export async function getTaskSubmissionsForTeacher(
//   taskId: string
// ): Promise<{ success: boolean; data: TaskSubmission[] }> {
//   const response = await fetch(`${API_BASE}/api/submissions/${taskId}`, {
//     headers: getHeaders(),
//   });
//   return handleResponse(response);
// }


// /**
//  * Allow student to resubmit
//  */
// export async function allowResubmission(
//   taskId: string,
//   studentId: string
// ): Promise<{ success: boolean; data: TaskSubmission; message: string }> {
//   try {
//     const response = await fetch(
//       `${API_BASE}/api/submissions/${taskId}/student/${studentId}/allow-resubmit`,
//       {
//         method: 'PATCH',
//         headers: getHeaders(),
//       }
//     );
//     return handleResponse(response);
//   } catch (error) {
//     console.error('Error allowing resubmission:', error);
//     throw error;
//   }
// }

// /**
//  * Extend deadline for individual student
//  */
// export async function extendSubmissionDeadline(
//   taskId: string,
//   studentId: string,
//   customDueDate: string
// ): Promise<{ success: boolean; data: TaskSubmission }> {
//   try {
//     const response = await fetch(
//       `${API_BASE}/api/submissions/${taskId}/student/${studentId}/extend`,
//       {
//         method: 'PATCH',
//         headers: getHeaders(),
//         body: JSON.stringify({ customDueDate }),
//       }
//     );
//     return handleResponse(response);
//   } catch (error) {
//     console.error('Error extending submission deadline:', error);
//     throw error;
//   }
// }

// /**
//  * Extend deadline for all students in a task
//  */
// export async function extendTaskDeadline(
//   taskId: string,
//   newDueDate: string
// ): Promise<{ success: boolean; data: Task }> {
//   try {
//     const response = await fetch(`${API_BASE}/api/tasks/${taskId}/extend`, {
//       method: 'PATCH',
//       headers: getHeaders(),
//       body: JSON.stringify({ dueDate: newDueDate }),
//     });
//     return handleResponse(response);
//   } catch (error) {
//     console.error('Error extending task deadline:', error);
//     throw error;
//   }
// }

// // ============= UTILITY FUNCTIONS =============

// /**
//  * Check if task is overdue
//  */
// export function isTaskOverdue(task: Task, submission?: TaskSubmission): boolean {
//   const now = new Date();
//   const deadline = new Date(submission?.customDueDate || task.dueDate);
//   return now > deadline && submission?.status !== 'GRADED';
// }

// /**
//  * Get status color for UI
//  */
// export function getStatusColor(status: SubmissionStatus): string {
//   const colors: Record<SubmissionStatus, string> = {
//     PENDING: 'yellow',
//     SUBMITTED: 'green',
//     LATE: 'red',
//     RESUBMITTING: 'blue',
//     GRADED: 'gray',
//   };
//   return colors[status];
// }

// /**
//  * Format time remaining until deadline
//  */
// export function getTimeRemaining(dueDate: string): string {
//   const now = new Date();
//   const deadline = new Date(dueDate);
//   const diff = deadline.getTime() - now.getTime();

//   if (diff < 0) return 'Overdue';

//   const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//   const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//   const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

//   if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
//   if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
//   if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
//   return 'Less than a minute';
// }

// /**
//  * Check if student can submit/resubmit
//  */
// export function canSubmitTask(submission?: TaskSubmission): boolean {
//   if (!submission) return true; // No submission yet
//   return submission.status === 'RESUBMITTING' || submission.status === 'PENDING';
// }

// /**
//  * Validate file before upload
//  */
// export function validateTaskFile(file: File): { valid: boolean; error?: string } {
//   const maxSize = 10 * 1024 * 1024; // 10MB
//   const allowedTypes = [
//     'application/pdf',
//     'application/msword',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     'application/vnd.ms-powerpoint',
//     'application/vnd.openxmlformats-officedocument.presentationml.presentation',
//     'image/jpeg',
//     'image/png',
//   ];

//   if (file.size > maxSize) {
//     return { valid: false, error: 'File size must be less than 10MB' };
//   }

//   if (!allowedTypes.includes(file.type)) {
//     return { valid: false, error: 'Invalid file type. Allowed: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG' };
//   }

//   return { valid: true };
// }

// /**
//  * Format file size to human readable
//  */
// export function formatFileSize(bytes: number): string {
//   if (bytes === 0) return '0 Bytes';
//   const k = 1024;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
// }

// /**
//  * Get file icon based on mime type
//  */
// export function getFileIcon(mimeType?: string): string {
//   if (!mimeType) return '📄';
//   if (mimeType.includes('pdf')) return '📕';
//   if (mimeType.includes('word')) return '📘';
//   if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📊';
//   if (mimeType.includes('image')) return '🖼️';
//   return '📄';
// }

// /**
//  * Get deadline urgency level
//  */
// export function getDeadlineUrgency(dueDate: string, customDueDate?: string): 'critical' | 'urgent' | 'normal' {
//   const deadline = new Date(customDueDate || dueDate);
//   const now = new Date();
//   const diff = deadline.getTime() - now.getTime();
//   const hours = diff / (1000 * 60 * 60);

//   if (hours < 0) return 'critical'; // Overdue
//   if (hours < 6) return 'critical';
//   if (hours < 24) return 'urgent';
//   return 'normal';
// }

// /**
//  * Calculate submission statistics
//  */
// export function calculateTaskStats(tasks: Task[]) {
//   const stats = {
//     total: tasks.length,
//     pending: 0,
//     submitted: 0,
//     graded: 0,
//     overdue: 0,
//   };

//   tasks.forEach(task => {
//     const submission = task.submissions?.[0];
//     if (!submission || submission.status === 'PENDING') {
//       stats.pending++;
//     } else if (submission.status === 'SUBMITTED' || submission.status === 'RESUBMITTING') {
//       stats.submitted++;
//     } else if (submission.status === 'GRADED') {
//       stats.graded++;
//     } else if (submission.status === 'LATE') {
//       stats.overdue++;
//     }
//   });

//   return stats;
// }





// client/lib/task.ts
import { getToken, getUser, clearAuth } from './auth'

const API_BASE = process.env.NEXT_PUBLIC_TASK_SERVICE_URL || 'http://localhost:3005'
const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:3001'

// ============================================================================
// TYPES
// ============================================================================

export type SubmissionStatus = 
  | 'PENDING' 
  | 'SUBMITTED' 
  | 'LATE' 
  | 'RESUBMITTING' 
  | 'GRADED'

export interface Task {
  id: string
  courseId: string
  teacherId: string
  title: string
  description?: string
  type?: string
  dueDate: string
  questionFileUrl?: string
  questionFileType?: string
  maxMarks: number
  createdAt: string
  updatedAt: string
  submissions?: TaskSubmission[]
}

export interface TaskSubmission {
  id: string
  taskId: string
  studentId: string
  customDueDate?: string
  submittedAt?: string
  answerFileUrl?: string
  answerFileType?: string
  comment?: string
  status: SubmissionStatus
  marks?: number
  feedback?: string
  gradedAt?: string
  attemptCount: number
  createdAt?: string
  updatedAt: string
}

export interface CreateTaskInput {
  courseId: string
  title: string
  description?: string
  type?: string
  dueDate: string
  maxMarks?: number
}

export interface GradeSubmissionInput {
  marks: number
  feedback?: string
}

export interface Course {
  id: string
  courseCode: string
  courseName: string
  semester: number
  credits: number
  department?: string
  school?: string
  teacher?: {
    firstName: string
    lastName: string
    employeeId: string
  }
}

export interface ApiSuccess<T> {
  success: boolean
  data: T
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class TaskAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'TaskAPIError'
  }
}

// ============================================================================
// REQUEST HELPER
// ============================================================================

async function request<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const token = getToken()

  if (!token) {
    console.error('❌ [Task API] No authentication token found')
    clearAuth()
    window.location.href = '/login'
    throw new TaskAPIError('Authentication required. Please login.', 401, 'NO_TOKEN')
  }

  const url = `${API_BASE}${path}`
  console.log(`📤 [Task API] ${init?.method || 'GET'} ${path}`)

  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
        Authorization: `Bearer ${token}`,
      },
    })

    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      console.error('❌ [Task API] Unauthorized - Token expired')
      clearAuth()
      window.location.href = '/login'
      throw new TaskAPIError('Session expired. Please login again.', response.status, 'TOKEN_EXPIRED')
    }

    // Parse response
    const data = await response.json().catch(() => null)

    if (!response.ok) {
      const errorMsg = data?.error || data?.message || `HTTP ${response.status}`
      console.error(`❌ [Task API] Request failed:`, errorMsg)
      throw new TaskAPIError(errorMsg, response.status, data?.code)
    }

    console.log(`✅ [Task API] ${init?.method || 'GET'} ${path} - Success`)
    return data as T
  } catch (error) {
    if (error instanceof TaskAPIError) {
      throw error
    }

    console.error('❌ [Task API] Network error:', error)
    throw new TaskAPIError(
      'Network error. Please check your connection.',
      0,
      'NETWORK_ERROR'
    )
  }
}

// ============================================================================
// STUDENT APIs
// ============================================================================

/**
 * Get all tasks for the current student
 */
export async function getMyTasks(): Promise<ApiSuccess<Task[]>> {
  try {
    return await request<ApiSuccess<Task[]>>('/api/tasks/my')
  } catch (error) {
    console.error('❌ [Task API] Failed to fetch my tasks:', error)
    throw error
  }
}

/**
 * Get single task by ID
 */
export async function getTaskById(taskId: string): Promise<ApiSuccess<Task>> {
  try {
    return await request<ApiSuccess<Task>>(`/api/tasks/${taskId}`)
  } catch (error) {
    console.error('❌ [Task API] Failed to fetch task:', error)
    throw error
  }
}

/**
 * Get all tasks for a specific course
 */
export async function getCourseTasks(courseId: string): Promise<ApiSuccess<Task[]>> {
  try {
    return await request<ApiSuccess<Task[]>>(`/api/tasks/course/${courseId}`)
  } catch (error) {
    console.error('❌ [Task API] Failed to fetch course tasks:', error)
    throw error
  }
}

/**
 * Submit a task with file upload
 */
export async function submitTask(
  taskId: string,
  file: File,
  comment?: string,
  onProgress?: (progress: number) => void
): Promise<ApiSuccess<TaskSubmission>> {
  const token = getToken()

  if (!token) {
    throw new TaskAPIError('Authentication required', 401, 'NO_TOKEN')
  }

  const formData = new FormData()
  formData.append('answerFile', file)
  if (comment) {
    formData.append('comment', comment)
  }

  console.log(`📤 [Task API] Submitting task ${taskId}`)

  // Use XMLHttpRequest for upload progress
  if (onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100
          onProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText)
            console.log('✅ [Task API] Task submitted successfully')
            resolve(result)
          } catch (err) {
            reject(new TaskAPIError('Invalid response from server'))
          }
        } else if (xhr.status === 401) {
          clearAuth()
          window.location.href = '/login'
          reject(new TaskAPIError('Session expired', 401, 'TOKEN_EXPIRED'))
        } else {
          try {
            const error = JSON.parse(xhr.responseText)
            reject(new TaskAPIError(error.message || xhr.statusText, xhr.status))
          } catch (err) {
            reject(new TaskAPIError(xhr.statusText, xhr.status))
          }
        }
      })

      xhr.addEventListener('error', () => reject(new TaskAPIError('Upload failed')))
      xhr.addEventListener('abort', () => reject(new TaskAPIError('Upload cancelled')))

      xhr.open('POST', `${API_BASE}/api/submissions/${taskId}`)
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      xhr.send(formData)
    })
  }

  // Fallback without progress
  try {
    const response = await fetch(`${API_BASE}/api/submissions/${taskId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (response.status === 401) {
      clearAuth()
      window.location.href = '/login'
      throw new TaskAPIError('Session expired', 401, 'TOKEN_EXPIRED')
    }

    const result = await response.json()

    if (!response.ok) {
      throw new TaskAPIError(result.message || 'Upload failed', response.status)
    }

    console.log('✅ [Task API] Task submitted successfully')
    return result as ApiSuccess<TaskSubmission>
  } catch (error) {
    console.error('❌ [Task API] Failed to submit task:', error)
    throw error
  }
}

/**
 * Get student courses for task filtering
 */
export async function getStudentCoursesForTasks(): Promise<Course[]> {
  const token = getToken()
  const user = getUser()
  
  if (!user || !user.id) {
    console.error('❌ [Task API] User not found')
    return []
  }
  
  console.log(`📤 [Task API] Fetching courses for user: ${user.id} (${user.role})`)
  
  try {
    const response = await fetch(
      `${USER_SERVICE_URL}/api/students/${user.id}/courses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.status === 401) {
      clearAuth()
      window.location.href = '/login'
      throw new TaskAPIError('Session expired', 401, 'TOKEN_EXPIRED')
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ [Task API] Failed to fetch courses:', errorData)
      throw new TaskAPIError(errorData.message || 'Failed to fetch courses', response.status)
    }

    const result = await response.json()
    console.log(`✅ [Task API] Loaded ${result.data?.length || 0} courses`)
    return result.success ? result.data : []
  } catch (error) {
    console.error('❌ [Task API] Error fetching student courses:', error)
    return []
  }
}

// ============================================================================
// TEACHER APIs
// ============================================================================

/**
 * Create task without file
 */
export async function createTask(data: CreateTaskInput): Promise<ApiSuccess<Task>> {
  try {
    console.log('📤 [Task API] Creating task:', data.title)
    return await request<ApiSuccess<Task>>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error('❌ [Task API] Failed to create task:', error)
    throw error
  }
}

/**
 * Create task with question file
 */
export async function createTaskWithFile(
  data: CreateTaskInput,
  file: File,
  onProgress?: (progress: number) => void
): Promise<ApiSuccess<Task>> {
  const token = getToken()

  if (!token) {
    throw new TaskAPIError('Authentication required', 401, 'NO_TOKEN')
  }

  const formData = new FormData()
  formData.append('questionFile', file)
  formData.append('courseId', data.courseId)
  formData.append('title', data.title)
  if (data.description) formData.append('description', data.description)
  if (data.type) formData.append('type', data.type)
  if (data.maxMarks) formData.append('maxMarks', data.maxMarks.toString())
  formData.append('dueDate', data.dueDate)

  console.log('📤 [Task API] Creating task with file:', data.title)

  if (onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress((e.loaded / e.total) * 100)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText)
            console.log('✅ [Task API] Task created successfully')
            resolve(result)
          } catch (err) {
            reject(new TaskAPIError('Invalid response from server'))
          }
        } else if (xhr.status === 401) {
          clearAuth()
          window.location.href = '/login'
          reject(new TaskAPIError('Session expired', 401, 'TOKEN_EXPIRED'))
        } else {
          try {
            const error = JSON.parse(xhr.responseText)
            reject(new TaskAPIError(error.message || xhr.statusText, xhr.status))
          } catch (err) {
            reject(new TaskAPIError(xhr.statusText, xhr.status))
          }
        }
      })

      xhr.addEventListener('error', () => reject(new TaskAPIError('Upload failed')))

      xhr.open('POST', `${API_BASE}/api/tasks/with-file`)
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      xhr.send(formData)
    })
  }

  try {
    const response = await fetch(`${API_BASE}/api/tasks/with-file`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (response.status === 401) {
      clearAuth()
      window.location.href = '/login'
      throw new TaskAPIError('Session expired', 401, 'TOKEN_EXPIRED')
    }

    const result = await response.json()

    if (!response.ok) {
      throw new TaskAPIError(result.message || 'Failed to create task', response.status)
    }

    console.log('✅ [Task API] Task created successfully')
    return result as ApiSuccess<Task>
  } catch (error) {
    console.error('❌ [Task API] Failed to create task with file:', error)
    throw error
  }
}

/**
 * Grade a student's submission
 */
export async function gradeSubmission(
  taskId: string,
  studentId: string,
  data: GradeSubmissionInput
): Promise<ApiSuccess<TaskSubmission>> {
  try {
    console.log(`📤 [Task API] Grading submission for student ${studentId}`)
    return await request<ApiSuccess<TaskSubmission>>(
      `/api/submissions/${taskId}/student/${studentId}/grade`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    )
  } catch (error) {
    console.error('❌ [Task API] Failed to grade submission:', error)
    throw error
  }
}

/**
 * Get all submissions for a task (Teacher only)
 */
export async function getTaskSubmissionsForTeacher(
  taskId: string
): Promise<ApiSuccess<TaskSubmission[]>> {
  try {
    console.log(`📤 [Task API] Fetching submissions for task ${taskId}`)
    return await request<ApiSuccess<TaskSubmission[]>>(`/api/submissions/${taskId}`)
  } catch (error) {
    console.error('❌ [Task API] Failed to fetch submissions:', error)
    throw error
  }
}

/**
 * Allow student to resubmit
 */
export async function allowResubmission(
  taskId: string,
  studentId: string
): Promise<ApiSuccess<TaskSubmission>> {
  try {
    console.log(`📤 [Task API] Allowing resubmission for student ${studentId}`)
    return await request<ApiSuccess<TaskSubmission>>(
      `/api/submissions/${taskId}/student/${studentId}/allow-resubmit`,
      {
        method: 'PATCH',
      }
    )
  } catch (error) {
    console.error('❌ [Task API] Failed to allow resubmission:', error)
    throw error
  }
}

/**
 * Extend deadline for individual student
 */
export async function extendSubmissionDeadline(
  taskId: string,
  studentId: string,
  customDueDate: string
): Promise<ApiSuccess<TaskSubmission>> {
  try {
    console.log(`📤 [Task API] Extending deadline for student ${studentId}`)
    return await request<ApiSuccess<TaskSubmission>>(
      `/api/submissions/${taskId}/student/${studentId}/extend`,
      {
        method: 'PATCH',
        body: JSON.stringify({ customDueDate }),
      }
    )
  } catch (error) {
    console.error('❌ [Task API] Failed to extend submission deadline:', error)
    throw error
  }
}

/**
 * Extend deadline for all students in a task
 */
export async function extendTaskDeadline(
  taskId: string,
  newDueDate: string
): Promise<ApiSuccess<Task>> {
  try {
    console.log(`📤 [Task API] Extending task deadline to ${newDueDate}`)
    return await request<ApiSuccess<Task>>(`/api/tasks/${taskId}/extend`, {
      method: 'PATCH',
      body: JSON.stringify({ dueDate: newDueDate }),
    })
  } catch (error) {
    console.error('❌ [Task API] Failed to extend task deadline:', error)
    throw error
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function isTaskOverdue(task: Task, submission?: TaskSubmission): boolean {
  const now = new Date()
  const deadline = new Date(submission?.customDueDate || task.dueDate)
  return now > deadline && submission?.status !== 'GRADED'
}

export function getStatusColor(status: SubmissionStatus): string {
  const colors: Record<SubmissionStatus, string> = {
    PENDING: 'yellow',
    SUBMITTED: 'green',
    LATE: 'red',
    RESUBMITTING: 'blue',
    GRADED: 'gray',
  }
  return colors[status]
}

export function getTimeRemaining(dueDate: string): string {
  const now = new Date()
  const deadline = new Date(dueDate)
  const diff = deadline.getTime() - now.getTime()

  if (diff < 0) return 'Overdue'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} left`
  return 'Less than a minute'
}

export function canSubmitTask(submission?: TaskSubmission): boolean {
  if (!submission) return true
  return submission.status === 'RESUBMITTING' || submission.status === 'PENDING'
}

export function validateTaskFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
  ]

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Allowed: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG' }
  }

  return { valid: true }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export function getFileIcon(mimeType?: string): string {
  if (!mimeType) return '📄'
  if (mimeType.includes('pdf')) return '📕'
  if (mimeType.includes('word')) return '📘'
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📊'
  if (mimeType.includes('image')) return '🖼️'
  return '📄'
}

export function getDeadlineUrgency(dueDate: string, customDueDate?: string): 'critical' | 'urgent' | 'normal' {
  const deadline = new Date(customDueDate || dueDate)
  const now = new Date()
  const diff = deadline.getTime() - now.getTime()
  const hours = diff / (1000 * 60 * 60)

  if (hours < 0) return 'critical'
  if (hours < 6) return 'critical'
  if (hours < 24) return 'urgent'
  return 'normal'
}

export function calculateTaskStats(tasks: Task[]) {
  const stats = {
    total: tasks.length,
    pending: 0,
    submitted: 0,
    graded: 0,
    overdue: 0,
  }

  tasks.forEach(task => {
    const submission = task.submissions?.[0]
    if (!submission || submission.status === 'PENDING') {
      stats.pending++
    } else if (submission.status === 'SUBMITTED' || submission.status === 'RESUBMITTING') {
      stats.submitted++
    } else if (submission.status === 'GRADED') {
      stats.graded++
    } else if (submission.status === 'LATE') {
      stats.overdue++
    }
  })

  return stats
}
