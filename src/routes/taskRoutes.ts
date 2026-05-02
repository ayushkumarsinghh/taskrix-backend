import { Router } from 'express';
import { createTask, getTasks, updateTask, completeTask, getStats } from '../controllers/taskController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { createTaskSchema } from '../validation/taskSchema';

const router = Router();

router.use(authMiddleware);

router.get('/stats', getStats);
router.get('/', getTasks);
router.post('/', roleMiddleware('ADMIN'), validate(createTaskSchema), createTask);
router.patch('/:id', updateTask);
router.patch('/:id/complete', completeTask);

export default router;
