import { Router } from 'express';
import { login, register, getUsers } from '../controllers/authController';
import { validate } from '../middleware/validateMiddleware';
import { loginSchema, registerSchema } from '../validation/authSchema';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/users', authMiddleware, getUsers);

export default router;
