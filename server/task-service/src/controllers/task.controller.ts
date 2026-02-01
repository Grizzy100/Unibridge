//server/task-service/src/controllers/task.controller.ts
import { Request, Response } from 'express';
import * as taskService from '../services/task.service.js';
import { createTaskSchema } from '../validators/task.validator.js';
import { extendTaskSchema } from '../validators/submission.validator.js';
import { uploadTaskFile } from '../services/cloudinary.service.js';

export async function createTask(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const validationResult = createTaskSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        errors: validationResult.error.issues,
      });
    }

    const token = req.headers.authorization?.replace('Bearer ', '');

    const task = await taskService.createTask(
      req.user.userId,
      validationResult.data,
      token
    );

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error('Error in createTask controller:', errorMessage);

    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
}

export async function createTaskWithFile(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Question file is required',
      });
    }

    const uploadedFile = await uploadTaskFile(req.file);

    const requestBody = {
      ...req.body,
      questionFileUrl: uploadedFile.url,
      questionFileType: uploadedFile.mimeType,
      maxMarks: 5,
    };

    const validationResult = createTaskSchema.safeParse(requestBody);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        errors: validationResult.error.issues,
      });
    }

    const token = req.headers.authorization?.replace('Bearer ', '');

    const task = await taskService.createTask(
      req.user.userId,
      validationResult.data,
      token
    );

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error('Error in createTaskWithFile controller:', errorMessage);

    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
}

export async function getCourseTasks(req: Request, res: Response) {
  try {
    const { courseId } = req.params;

    const tasks = await taskService.getCourseTasks(courseId);

    return res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error('Error in getCourseTasks controller:', errorMessage);

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
}

export async function getMyTasks(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const token = req.headers.authorization?.replace('Bearer ', '');

    const tasks = await taskService.getStudentTasks(req.user.userId, token);

    return res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error('Error in getMyTasks controller:', errorMessage);

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
}

export async function extendTask(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { id } = req.params;

    const validationResult = extendTaskSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        errors: validationResult.error.issues,
      });
    }

    const token = req.headers.authorization?.replace('Bearer ', '');

    const updatedTask = await taskService.extendTaskForAll(
      req.user.userId,
      id,
      new Date(validationResult.data.dueDate),
      token
    );

    return res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error('Error in extendTask controller:', errorMessage);

    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
}

export async function getTaskById(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { taskId } = req.params;

    const task = await taskService.getTaskById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error('Error in getTaskById controller:', errorMessage);

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
}










// import { Request, Response } from 'express';
// import * as taskService from '../services/task.service.js';
// import { createTaskSchema } from '../validators/task.validator.js';
// import { extendTaskSchema } from '../validators/submission.validator.js';
// import { uploadTaskFile } from '../services/cloudinary.service.js';
// /* ---------- teacher create task ---------- */
// export async function createTask(req: Request, res: Response) {
//   try {
//     if (!req.user)
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     const parsed = createTaskSchema.safeParse(req.body);
//     if (!parsed.success) {
//       return res.status(400).json({ success: false, errors: parsed.error.issues });
//     }
//     const token = req.headers.authorization?.replace('Bearer ', '');
//     const task = await taskService.createTask(req.user.userId, parsed.data, token);
//     res.status(201).json({ success: true, data: task });
//   } catch (e: any) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// }
// export async function createTaskWithFile(req: Request, res: Response) {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: 'File is required' });
//     }
//     const uploaded = await uploadTaskFile(req.file);
//     const raw = {
//       ...req.body,
//       questionFileUrl: uploaded.url,
//       questionFileType: uploaded.mimeType,
//     };
//     const body = {
//       ...raw,
//       maxMarks: 5,  // Always 5
//     };
//     const parsed = createTaskSchema.safeParse(body);
//     if (!parsed.success) {
//       return res.status(400).json({ success: false, errors: parsed.error.issues });
//     }
//     const token = req.headers.authorization?.replace('Bearer ', '');
//     const task = await taskService.createTask(req.user.userId, parsed.data, token);
//     return res.status(201).json({ success: true, data: task });
//   } catch (e: any) {
//     return res.status(400).json({ success: false, message: e.message });
//   }
// }
// /* ---------- queries & extend ---------- */
// export async function getCourseTasks(req: Request, res: Response) {
//   try {
//     const { courseId } = req.params;
//     const tasks = await taskService.getCourseTasks(courseId);
//     res.json({ success: true, data: tasks });
//   } catch (e: any) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// }
// export async function getMyTasks(req: Request, res: Response) {
//   try {
//     if (!req.user)
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     const token = req.headers.authorization?.replace('Bearer ', '');
//     const tasks = await taskService.getStudentTasks(req.user.userId, token);
//     res.json({ success: true, data: tasks });
//   } catch (e: any) {
//     res.status(500).json({ success: false, message: e.message });
//   }
// }
// export async function extendTask(req: Request, res: Response) {
//   try {
//     if (!req.user)
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     const { id } = req.params;
//     const parsed = extendTaskSchema.safeParse(req.body);
//     if (!parsed.success) {
//       return res.status(400).json({ success: false, errors: parsed.error.issues });
//     }
//     const token = req.headers.authorization?.replace('Bearer ', '');
//     const updated = await taskService.extendTaskForAll(
//       req.user.userId,
//       id,
//       new Date(parsed.data.dueDate),
//       token
//     );
//     res.json({ success: true, data: updated });
//   } catch (e: any) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// }
// /* ---------- student: get single task ---------- */
// export async function getTaskById(req: Request, res: Response) {
//   try {
//     if (!req.user)
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     const { taskId } = req.params;
//     const task = await taskService.getTaskById(taskId);
    
//     if (!task) {
//       return res.status(404).json({ success: false, message: 'Task not found' });
//     }
//     return res.json({ success: true, data: task });
//   } catch (e: any) {
//     return res.status(500).json({ success: false, message: e.message });
//   }
// }
