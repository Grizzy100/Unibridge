//server\user-service\src\routes\profile.routes.ts
import { Router } from "express";
import * as profileCtrl from "../controllers/profile.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
const router = Router();
// ✅ Student routes - SPECIFIC ROUTES FIRST
router.post("/students", authenticate, authorize("ADMIN"), profileCtrl.createStudentProfile);
router.get("/students", authenticate, authorize("ADMIN"), profileCtrl.getAllStudents);
// 🆕 MOVE THESE BEFORE /:userId ROUTE
router.get("/students/profile/:studentId", profileCtrl.getStudentByProfileId);
router.get("/students/profile/:studentId/parents", profileCtrl.getParentsByStudentProfileId);
// ⚠️ DYNAMIC ROUTES COME AFTER SPECIFIC ONES
router.get("/students/:userId", authenticate, profileCtrl.getStudentById);
router.delete("/students/:userId", authenticate, authorize("ADMIN"), profileCtrl.deleteStudent);
// Teacher routes
router.post("/teachers", authenticate, authorize("ADMIN"), profileCtrl.createTeacherProfile);
router.get("/teachers", authenticate, authorize("ADMIN"), profileCtrl.getAllTeachers);
router.get("/teachers/:userId", authenticate, profileCtrl.getTeacherById);
router.delete("/teachers/:userId", authenticate, authorize("ADMIN"), profileCtrl.deleteTeacher);
// Warden routes
router.post("/wardens", authenticate, authorize("ADMIN"), profileCtrl.createWardenProfile);
router.get("/wardens", authenticate, authorize("ADMIN"), profileCtrl.getAllWardens);
router.get("/wardens/:userId", authenticate, profileCtrl.getWardenById);
router.delete("/wardens/:userId", authenticate, authorize("ADMIN"), profileCtrl.deleteWarden);
router.get("/wardens-ids", profileCtrl.getWardenUserIds);
// Parent routes
router.post("/parents", authenticate, authorize("ADMIN"), profileCtrl.createParentProfile);
router.get("/parents", authenticate, authorize("ADMIN"), profileCtrl.getAllParents);
router.get("/parents/:userId", authenticate, profileCtrl.getParentById);
router.delete("/parents/:userId", authenticate, authorize("ADMIN"), profileCtrl.deleteParent);
// Parent-Student linking routes
router.post("/parent-student-link", authenticate, authorize("ADMIN"), profileCtrl.linkParentToStudent);
router.delete("/parent-student-link/:parentId/:studentId", authenticate, authorize("ADMIN"), profileCtrl.unlinkParentFromStudent);
router.get("/students/:studentId/parents", authenticate, profileCtrl.getStudentParents);
export default router;
