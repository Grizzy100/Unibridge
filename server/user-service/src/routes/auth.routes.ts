
// user-service/src/routes/auth.routes.ts
import { Router } from "express";
import * as authCtrl from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

// Public login
router.post("/login", authCtrl.login);

// Admin protected route to create accounts
router.post("/admin/users", authenticate, authorize("ADMIN"), authCtrl.adminCreateUser);

export default router;
