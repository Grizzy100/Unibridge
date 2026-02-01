
//server/user-service/src/services/course.service.ts
import {
  CreateCourseInput,
  UpdateCourseInput,
} from '../schemas/course.schema.js';
import prisma from '../utils/prisma.js';
/**
 * ADMIN: Create a new course and assign a teacher
 */
export async function createCourse(data: CreateCourseInput) {
  // ✅ FIX: Find teacher by User.id, then use TeacherProfile.id
  const teacher = await prisma.user.findUnique({
    where: { id: data.teacherId },
    include: {
      teacherProfile: true,
    },
  });
  if (!teacher || teacher.role !== 'TEACHER' || !teacher.teacherProfile) {
    throw new Error(
      'Invalid teacher ID. User must be a teacher with a teacher profile.'
    );
  }
  // Check if course code already exists
  const existingCourse = await prisma.course.findUnique({
    where: { courseCode: data.courseCode },
  });
  if (existingCourse) {
    throw new Error(`Course code '${data.courseCode}' already exists.`);
  }
  // ✅ FIX: Use TeacherProfile.id, not User.id
  const courseData: any = {
    courseCode: data.courseCode,
    courseName: data.courseName,
    teacherId: teacher.teacherProfile.id, // ← CHANGED: Use profile ID
    semester: data.semester,
  };
  if (data.credits !== undefined) courseData.credits = data.credits;
  if (data.description !== undefined) courseData.description = data.description;
  if (data.department !== undefined) courseData.department = data.department;
  if (data.school !== undefined) courseData.school = data.school;
  const course = await prisma.course.create({
    data: courseData,
    include: {
      teacher: {
        select: {
          id: true,
          userId: true, // ✅ ADDED: Include userId for reference
          firstName: true,
          lastName: true,
          employeeId: true,
          department: true,
          user: { select: { email: true } },
        },
      },
    },
  });
  return course;
}
/**
 * Get all courses with optional filters
 */
export async function getAllCourses(filters?: {
  semester?: number;
  teacherId?: string;
  department?: string;
}) {
  const where: any = {};
  if (filters?.semester !== undefined) where.semester = filters.semester;
  
  // ✅ FIX: If teacherId is provided, map User.id to TeacherProfile.id
  if (filters?.teacherId) {
    const teacher = await prisma.teacherProfile.findUnique({
      where: { userId: filters.teacherId }
    });
    if (teacher) {
      where.teacherId = teacher.id;
    } else {
      // If no teacher found, return empty results
      where.teacherId = 'invalid';
    }
  }
  
  if (filters?.department) where.department = filters.department;
  const courses = await prisma.course.findMany({
    where,
    include: {
      teacher: {
        select: {
          id: true,
          userId: true, // ✅ ADDED
          firstName: true,
          lastName: true,
          employeeId: true,
          department: true,
          user: { select: { email: true } },
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: [
      { semester: 'desc' },
      { courseName: 'asc' },
    ],
  });
  return courses;
}
/**
 * Get single course by ID with full details
 */
export async function getCourseById(courseId: string) {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      teacher: {
        select: {
          id: true,
          userId: true, // ✅ ADDED
          firstName: true,
          lastName: true,
          employeeId: true,
          department: true,
          user: { select: { email: true } },
        },
      },
      enrollments: {
        include: {
          student: {
            select: {
              id: true,
              userId: true,
              firstName: true,
              lastName: true,
              enrollmentNumber: true,
              semester: true,
              dateOfBirth: true,
              user: { select: { email: true } },
            },
          },
        },
        orderBy: {
          student: {
            enrollmentNumber: 'asc',
          },
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });
  if (!course) {
    throw new Error('Course not found');
  }
  return course;
}
/**
 * ADMIN: Update course details (including teacher reassignment)
 */
export async function updateCourse(courseId: string, data: UpdateCourseInput) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });
  if (!course) {
    throw new Error('Course not found');
  }
  if (data.courseCode && data.courseCode !== course.courseCode) {
    const existing = await prisma.course.findUnique({
      where: { courseCode: data.courseCode },
    });
    if (existing) {
      throw new Error(`Course code '${data.courseCode}' already exists.`);
    }
  }
  // ✅ FIX: Handle teacher ID mapping
  let teacherProfileId: string | undefined;
  if (data.teacherId) {
    const teacher = await prisma.user.findUnique({
      where: { id: data.teacherId },
      include: { teacherProfile: true },
    });
    if (!teacher || teacher.role !== 'TEACHER' || !teacher.teacherProfile) {
      throw new Error(
        'Invalid teacher ID. User must be a teacher with a teacher profile.'
      );
    }
    teacherProfileId = teacher.teacherProfile.id;
  }
  // ✅ FIX: Prepare update data with profile ID
  const courseData: any = { ...data };
  if (teacherProfileId) {
    courseData.teacherId = teacherProfileId;
  }
  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: courseData,
    include: {
      teacher: {
        select: {
          id: true,
          userId: true, // ✅ ADDED
          firstName: true,
          lastName: true,
          employeeId: true,
          department: true,
          user: { select: { email: true } },
        },
      },
    },
  });
  return updatedCourse;
}
/**
 * ADMIN: Assign or reassign teacher to a course
 */
export async function assignTeacherToCourse(courseId: string, teacherId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });
  if (!course) throw new Error('Course not found');
  
  // ✅ FIX: Map User.id to TeacherProfile.id
  const teacher = await prisma.user.findUnique({
    where: { id: teacherId },
    include: { teacherProfile: true },
  });
  if (!teacher || teacher.role !== 'TEACHER' || !teacher.teacherProfile) {
    throw new Error('Invalid teacher ID. User must be a teacher with a teacher profile.');
  }
  
  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: { teacherId: teacher.teacherProfile.id }, // ← CHANGED: Use profile ID
    include: {
      teacher: {
        select: {
          id: true,
          userId: true, // ✅ ADDED
          firstName: true,
          lastName: true,
          employeeId: true,
          department: true,
          user: { select: { email: true } },
        },
      },
    },
  });
  return updatedCourse;
}
/**
 * ADMIN: Delete course
 */
export async function deleteCourse(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { _count: { select: { enrollments: true } } },
  });
  if (!course) throw new Error('Course not found');
  if (course._count.enrollments > 0)
    throw new Error(
      `Cannot delete course. There are ${course._count.enrollments} students enrolled. Please unenroll all students first.`
    );
  await prisma.course.delete({ where: { id: courseId } });
  return { message: 'Course deleted successfully' };
}
/**
 * Get all available teachers (for admin dropdown)
 */
export async function getAvailableTeachers() {
  const teachers = await prisma.user.findMany({
    where: {
      role: 'TEACHER',
      teacherProfile: { isNot: null },
    },
    select: {
      id: true, // ✅ This is User.id (for form submission)
      email: true,
      teacherProfile: {
        select: {
          id: true, // ✅ ADDED: TeacherProfile.id (actual FK in Course)
          firstName: true,
          lastName: true,
          employeeId: true,
          department: true
        },
      },
    },
    orderBy: { teacherProfile: { firstName: 'asc' } },
  });
  return teachers;
}
/**
 * Get courses taught by a specific teacher
 */
export async function getTeacherCourses(teacherId: string) {
  // ✅ FIX: teacherId might be User.id, map to TeacherProfile.id
  const teacher = await prisma.teacherProfile.findUnique({
    where: { userId: teacherId }
  });
  
  if (!teacher) {
    throw new Error('Teacher not found');
  }
  
  const courses = await prisma.course.findMany({
    where: { teacherId: teacher.id }, // ← Use profile ID
    include: { 
      _count: { select: { enrollments: true } },
      teacher: {
        select: {
          id: true,
          userId: true,
          firstName: true,
          lastName: true,
          employeeId: true,
          department: true,
          user: { select: { email: true } }
        }
      }
    },
    orderBy: [{ semester: 'desc' }, { courseName: 'asc' }],
  });
  return courses;
}
/**
 * Get students enrolled in a course
 */
export async function getCourseStudents(courseId: string) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new Error('Course not found');
  
  const enrollments = await prisma.courseEnrollment.findMany({
    where: { courseId },
    include: {
      student: {
        select: {
          id: true, // ✅ StudentProfile.id
          userId: true,
          firstName: true,
          lastName: true,
          enrollmentNumber: true,
          phoneNumber: true,
          semester: true,
          dateOfBirth: true,
          user: { select: { email: true } },
        }
      },
    },
    orderBy: { student: { enrollmentNumber: 'asc' } },
  });
  return enrollments.map(e => e.student);
}
/**
 * ADMIN: Enroll a student in a course
 */
export async function enrollStudent(studentId: string, courseId: string) {
  // ✅ FIX: studentId is User.id, map to StudentProfile.id
  const student = await prisma.studentProfile.findUnique({ 
    where: { userId: studentId } 
  });
  if (!student) throw new Error('Student not found');
  
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new Error('Course not found');
  
  const existing = await prisma.courseEnrollment.findUnique({
    where: { studentId_courseId: { studentId: student.id, courseId } },
  });
  if (existing) throw new Error('Student is already enrolled in this course');
  
  const enrollment = await prisma.courseEnrollment.create({
    data: { studentId: student.id, courseId }, // ← Use profile ID
    include: {
      student: { 
        select: { 
          id: true, // ✅ ADDED
          userId: true, 
          firstName: true, 
          lastName: true, 
          enrollmentNumber: true,
          user: { select: { email: true } }
        } 
      },
      course: { select: { courseCode: true, courseName: true } },
    },
  });
  return enrollment;
}
/**
 * ADMIN: Bulk enroll students in a course
 */
export async function bulkEnrollStudents(courseId: string, studentIds: string[]) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new Error('Course not found');
  
  // ✅ FIX: studentIds are User.ids, map to StudentProfile.ids
  const students = await prisma.studentProfile.findMany({ 
    where: { userId: { in: studentIds } } 
  });
  
  if (students.length === 0) {
    throw new Error('No valid students found');
  }
  
  if (students.length !== studentIds.length) {
    console.warn(`Warning: Only ${students.length} out of ${studentIds.length} students found`);
  }
  
  const existingEnrollments = await prisma.courseEnrollment.findMany({
    where: { courseId, studentId: { in: students.map(s => s.id) } },
  });
  
  const enrolledIds = new Set(existingEnrollments.map(e => e.studentId));
  const newEnrollments = students
    .filter(s => !enrolledIds.has(s.id))
    .map(s => ({ studentId: s.id, courseId })); // ← Use profile IDs
  
  if (newEnrollments.length === 0) {
    throw new Error('All students are already enrolled in this course');
  }
  
  await prisma.courseEnrollment.createMany({ data: newEnrollments });
  
  return {
    enrolled: newEnrollments.length,
    skipped: students.length - newEnrollments.length,
    total: students.length,
  };
}
/**
 * ADMIN: Unenroll a student from a course
 */
export async function unenrollStudent(studentId: string, courseId: string) {
  // ✅ FIX: studentId is User.id, map to StudentProfile.id
  const student = await prisma.studentProfile.findUnique({ 
    where: { userId: studentId } 
  });
  if (!student) throw new Error('Student not found');
  
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { studentId_courseId: { studentId: student.id, courseId } },
  });
  if (!enrollment) throw new Error('Student is not enrolled in this course');
  
  await prisma.courseEnrollment.delete({ where: { id: enrollment.id } });
  return { message: 'Student unenrolled successfully' };
}
/**
 * Get courses for a student
 */
export async function getStudentCourses(studentId: string) {
  // ✅ FIX: studentId is User.id, map to StudentProfile.id
  const student = await prisma.studentProfile.findUnique({ 
    where: { userId: studentId } 
  });
  if (!student) throw new Error('Student not found');
  
  const enrollments = await prisma.courseEnrollment.findMany({
    where: { studentId: student.id }, // ← Use profile ID
    include: {
      course: {
        include: {
          teacher: {
            select: {
              id: true,
              userId: true, // ✅ ADDED
              firstName: true,
              lastName: true,
              employeeId: true,
              department: true,
              user: { select: { email: true } },
            },
          },
        },
      },
    },
    orderBy: { course: { semester: 'desc' } },
  });
  return enrollments.map(e => e.course);
}

export async function getCourseEnrollments(courseId: string) {
  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { courseId },
      include: {
        student: {
          select: {
            id: true,
            userId: true,
            firstName: true,
            lastName: true,
            enrollmentNumber: true,
            user: {
              select: {
                email: true
              }
            }
          }
        }
      }
    });
    return enrollments;
  } catch (error: any) {
    console.error('Error fetching course enrollments:', error.message);
    throw error;
  }
}
