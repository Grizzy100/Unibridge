//server/task-service/src/services/task.service.ts
import { getPrisma } from '../utils/prisma.js';
import { CreateTaskInput } from '../validators/task.validator.js';
import {
  getTeacherCourses,
  getStudentCourses,
  getStudentProfileIdFromUserId,
} from './user.service.js';
import { publishTaskCreated } from '../events/task-events.publisher.js';

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
}

interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  semester: number;
  credits: number;
  teacher?: Teacher;
  teacherId?: string;
}

export async function createTask(
  teacherUserId: string,
  data: CreateTaskInput,
  token?: string
) {
  try {
    const prisma = getPrisma();
    
    console.log('Creating task for teacher:', teacherUserId);
    
    const courses = await getTeacherCourses(teacherUserId, token);
    
    if (courses.length === 0) {
      throw new Error('You are not assigned to any courses');
    }

    const courseExists = courses.some(course => course.id === data.courseId);
    
    if (!courseExists) {
      throw new Error('You are not assigned to this course');
    }

    const targetCourse = courses.find(course => course.id === data.courseId);
    
    if (!targetCourse) {
      throw new Error('Course not found in teacher assignments');
    }

    const teacherId = targetCourse.teacher?.id || targetCourse.teacherId;
    
    if (!teacherId) {
      throw new Error('Teacher ID not found in course data');
    }

    const task = await prisma.task.create({
      data: {
        courseId: data.courseId,
        teacherId,
        title: data.title,
        description: data.description ?? null,
        type: data.type ?? 'LAB',
        dueDate: new Date(data.dueDate),
        maxMarks: 5,
        questionFileUrl: data.questionFileUrl ?? null,
        questionFileType: data.questionFileType ?? null,
      },
    });

    console.log('Task created successfully:', task.id);

    try {
      await publishTaskCreated({
        taskId: task.id,
        courseId: task.courseId,
        teacherId: task.teacherId,
        title: task.title,
        description: task.description ?? undefined,
        dueDate: task.dueDate,
        maxMarks: task.maxMarks,
      });
      
      console.log('Task creation event published');
    } catch (eventError) {
      console.error('Failed to publish task.created event:', eventError);
    }

    return task;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function getCourseTasks(courseId: string) {
  try {
    const prisma = getPrisma();
    
    console.log('Fetching tasks for course:', courseId);
    
    const tasks = await prisma.task.findMany({
      where: { courseId },
      orderBy: { dueDate: 'asc' },
    });
    
    console.log(`Found ${tasks.length} tasks for course`);
    
    return tasks;
  } catch (error) {
    console.error('Error fetching course tasks:', error);
    throw error;
  }
}

export async function getStudentTasks(studentUserId: string, token?: string) {
  try {
    const prisma = getPrisma();
    
    console.log('Fetching tasks for student user:', studentUserId);

    // ✅ Step 1: Get ProfileId from UserId (for database queries)
    const studentProfileId = await getStudentProfileIdFromUserId(
      studentUserId,
      token
    );

    console.log('Student profile ID:', studentProfileId);

    // ✅ Step 2: Pass User.id (NOT Profile.id) to get courses
    const courses = await getStudentCourses(studentUserId, token);
    //                                      ^^^^^^^^^^^^ 
    //                                      CHANGED: Use userId, not profileId

    if (courses.length === 0) {
      console.log('Student has no enrolled courses');
      return [];
    }

    const courseIds = courses.map(course => course.id);
    
    console.log('Fetching tasks for courses:', courseIds);

    const tasks = await prisma.task.findMany({
      where: {
        courseId: {
          in: courseIds,
        },
      },
      include: {
        submissions: {
          where: {
            studentId: studentProfileId,  // ✅ CORRECT: Use profileId for DB
          },
          select: {
            id: true,
            status: true,
            submittedAt: true,
            marks: true,
            answerFileUrl: true,
            attemptCount: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    console.log(`Found ${tasks.length} tasks for student`);

    return tasks;
  } catch (error) {
    console.error('Error fetching student tasks:', error);
    throw error;
  }
}


export async function extendTaskForAll(
  teacherUserId: string,
  taskId: string,
  newDueDate: Date,
  token?: string
) {
  try {
    const prisma = getPrisma();
    
    console.log('Extending task deadline:', taskId);

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    const courses = await getTeacherCourses(teacherUserId, token);

    const teachesThisCourse = courses.some(
      course => course.id === task.courseId
    );

    if (!teachesThisCourse) {
      throw new Error('You are not assigned to this course');
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { dueDate: newDueDate },
    });

    console.log('Task deadline extended successfully');

    return updatedTask;
  } catch (error) {
    console.error('Error extending task deadline:', error);
    throw error;
  }
}

export async function getTaskById(taskId: string) {
  try {
    const prisma = getPrisma();
    
    console.log('Fetching task by ID:', taskId);

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      console.log('Task not found:', taskId);
      return null;
    }

    console.log('Task found:', task.title);

    return task;
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    throw error;
  }
}












// import { getPrisma } from '../utils/prisma.js';
// import { CreateTaskInput } from '../validators/task.validator.js';
// import {
//   getTeacherCourses,
//   getStudentCourses,
//   getStudentProfileIdFromUserId,
// } from './user.service.js';
// import { publishTaskCreated } from '../events/task-events.publisher.js';
// export async function createTask(
//   teacherUserId: string,
//   data: CreateTaskInput,
//   token?: string
// ) {
//   const prisma = getPrisma();
//   const courses = await getTeacherCourses(teacherUserId, token);
//   const teaches = courses.some(c => c.id === data.courseId);
//   if (!teaches) throw new Error('You are not assigned to this course');
//   const task = await prisma.task.create({
//     data: {
//       courseId: data.courseId,
//       teacherId: courses[0].teacher?.id ?? courses[0].teacherId ?? '',
//       title: data.title,
//       description: data.description ?? null,
//       type: data.type ?? 'LAB',
//       dueDate: new Date(data.dueDate),
//       maxMarks: 5,
//       questionFileUrl: data.questionFileUrl ?? null,
//       questionFileType: data.questionFileType ?? null,
//     },
//   });
//   try {
//     await publishTaskCreated({
//       taskId: task.id,
//       courseId: task.courseId,
//       teacherId: task.teacherId,
//       title: task.title,
//       description: task.description ?? undefined,
//       dueDate: task.dueDate,
//       maxMarks: task.maxMarks,
//     });
//   } catch (error) {
//     console.error('Failed to publish task.created event:', error);
//   }
//   return task;
// }
// export async function getCourseTasks(courseId: string) {
//   const prisma = getPrisma();
//   return prisma.task.findMany({
//     where: { courseId },
//     orderBy: { dueDate: 'asc' },
//   });
// }
// export async function getStudentTasks(studentUserId: string, token?: string) {
//   const prisma = getPrisma();
//   const courses = await getStudentCourses(studentUserId, token);
//   const courseIds = courses.map(c => c.id);
//   if (!courseIds.length) return [];
//   const studentProfileId = await getStudentProfileIdFromUserId(studentUserId, token);
//   const tasks = await prisma.task.findMany({
//     where: { courseId: { in: courseIds } },
//     include: {
//       submissions: {
//         where: { studentId: studentProfileId },
//         select: {
//           id: true,
//           status: true,
//           submittedAt: true,
//           marks: true,
//           answerFileUrl: true,
//           attemptCount: true,
//         },
//       },
//     },
//     orderBy: { dueDate: 'asc' },
//   });
//   return tasks;
// }
// export async function extendTaskForAll(
//   teacherUserId: string,
//   taskId: string,
//   newDueDate: Date,
//   token?: string
// ) {
//   const prisma = getPrisma();
//   const task = await prisma.task.findUnique({ where: { id: taskId } });
//   if (!task) throw new Error('Task not found');
//   const courses = await getTeacherCourses(teacherUserId, token);
//   const teaches = courses.some(c => c.id === task.courseId);
//   if (!teaches) throw new Error('You are not assigned to this course');
//   return prisma.task.update({
//     where: { id: taskId },
//     data: { dueDate: newDueDate },
//   });
// }
// export async function getTaskById(taskId: string) {
//   const prisma = getPrisma();
//   return prisma.task.findUnique({ where: { id: taskId } });
// }
