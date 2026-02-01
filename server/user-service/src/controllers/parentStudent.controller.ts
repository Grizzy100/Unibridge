
//server/user-service/src/controllers/parentStudent.controller.ts
import { Request, Response } from "express";
import * as parentStudentService from "../services/parentStudent.service.js";
// Link parent to student
export async function linkParentToStudent(req: Request, res: Response) {
  try {
    const { parentId, studentId, relationship, isPrimary } = req.body;
    const link = await parentStudentService.linkParentToStudent({
      parentId,
      studentId,
      relationship,
      isPrimary
    });
    return res.status(201).json({
      success: true,
      message: "Parent linked to student successfully",
      data: link
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}
// Get parent's children
export async function getParentChildren(req: Request, res: Response) {
  try {
    const { parentId } = req.params;
    const children = await parentStudentService.getParentChildren(parentId);
    return res.json({
      success: true,
      data: children
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
// Get student's parents
export async function getStudentParents(req: Request, res: Response) {
  try {
    const { studentId } = req.params;
    const parents = await parentStudentService.getStudentParents(studentId);
    return res.json({
      success: true,
      data: parents
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
