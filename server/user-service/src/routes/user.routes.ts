
//server/user-service/src/routes/user.routes.ts
import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import prisma from '../utils/prisma.js';
const router = Router();
// Get current user info (for /api/users/me)
router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error: any) {
    console.error('[User Routes] Error getting current user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});
export default router;
