
//server/task-service/src/controllers/submission.controller.ts
import { Request, Response } from 'express';
import * as submissionService from '../services/submission.service.js';
import {
  createSubmissionSchema,
  extendSubmissionSchema,
  gradeSubmissionSchema,
} from '../validators/submission.validator.js';
import { uploadTaskFile } from '../services/cloudinary.service.js';
export async function submitTask(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const parsed = createSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.issues });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File is required' });
    }
    const uploaded = await uploadTaskFile(req.file);
    const token = req.headers.authorization?.replace('Bearer ', '');
    const submission = await submissionService.submitTask(
      req.user.userId,
      req.params.taskId,
      { url: uploaded.url, mimeType: uploaded.mimeType, comment: parsed.data.comment },
      token
    );
    res.status(201).json({ success: true, data: submission });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
}
export async function extendSubmission(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { taskId, studentId } = req.params;
    const parsed = extendSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.issues });
    }
    const updated = await submissionService.extendSubmissionDeadline(
      taskId,
      studentId,
      new Date(parsed.data.customDueDate)
    );
    res.json({ success: true, data: updated });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
}
// ✅ NEW: Teacher allows resubmission
export async function allowResubmission(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { taskId, studentId } = req.params;
    const token = req.headers.authorization?.replace('Bearer ', '');
    const updated = await submissionService.allowResubmission(
      req.user.userId,
      taskId,
      studentId,
      token
    );
    res.json({ success: true, data: updated, message: 'Student can now resubmit' });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
}
export async function gradeSubmission(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { taskId, studentId } = req.params;
    const parsed = gradeSubmissionSchema.safeParse({
      marks: Number(req.body.marks),
      feedback: req.body.feedback,
    });
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.issues });
    }
    const token = req.headers.authorization?.replace('Bearer ', '');
    const graded = await submissionService.gradeSubmission(
      req.user.userId,
      taskId,
      studentId,
      { marks: parsed.data.marks, feedback: parsed.data.feedback },
      token
    );
    res.json({ success: true, data: graded });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
}






export async function getTaskSubmissions(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { taskId } = req.params;
    const token = req.headers.authorization?.replace('Bearer ', '');

    const list = await submissionService.getSubmissionsForTask(
      req.user.userId,
      taskId,
      token
    );

    res.json({ success: true, data: list });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
}

