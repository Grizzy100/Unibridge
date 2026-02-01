
//server/user-service/src/routes/parentStudent.routes.ts
import { Router } from "express";
import * as parentStudentCtrl from "../controllers/parentStudent.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
const router = Router();
// Admin links parent to student
router.post(
  "/link",
  authenticate,
  authorize("ADMIN"),
  parentStudentCtrl.linkParentToStudent
);
// Get parent's children
router.get(
  "/parent/:parentId/children",
  authenticate,
  parentStudentCtrl.getParentChildren
);
// Get student's parents
router.get(
  "/student/:studentId/parents",
  authenticate,
  parentStudentCtrl.getStudentParents
);
export default router;
