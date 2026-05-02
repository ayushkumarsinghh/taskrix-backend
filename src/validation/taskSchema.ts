import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  assigned_to: z.string().uuid('Invalid user ID').optional(),
  deadline: z.string().datetime('Invalid deadline date format'),
});

export const updateTaskSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});
