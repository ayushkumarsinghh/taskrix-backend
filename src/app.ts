import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use(limiter);
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Taskrix API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

export default app;
