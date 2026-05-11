import { Router } from 'express';
import { breakdownTask } from '../controllers/aiController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Protect with authentication so only logged in users can use your AI credits
router.post('/breakdown', authenticate as any, breakdownTask as any);

export default router;
