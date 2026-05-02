import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../config/db';
import { addEscalationJob } from '../queue/taskQueue';
import { AppError } from '../middleware/errorMiddleware';

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, priority, assigned_to, deadline } = req.body;
  const creatorId = req.user?.userId;

  if (!creatorId) throw new AppError('Unauthorized', 401);

  // Use transaction to ensure task creation and logging are atomic
  const task = await prisma.$transaction(async (tx) => {
    const newTask = await tx.task.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        assigned_to,
        created_by: creatorId,
        deadline: new Date(deadline),
      },
    });

    await tx.taskLog.create({
      data: {
        task_id: newTask.id,
        action: 'CREATED',
      },
    });

    return newTask;
  });

  // Push to queue for escalation logic
  await addEscalationJob(task.id, task.priority, task.deadline);

  res.status(201).json(task);
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const { status, user } = req.query;

    const where: any = {};
    if (role !== 'ADMIN') {
      where.assigned_to = userId;
    } else if (user) {
      where.assigned_to = user as string;
    }

    if (status) {
      where.status = status as any;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        creator: { select: { name: true, email: true } },
        assignedUser: { select: { name: true, email: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { userId, role } = req.user!;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (role !== 'ADMIN' && task.assigned_to !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
    });

    await prisma.taskLog.create({
      data: {
        task_id: id,
        action: 'UPDATED',
      },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
};

export const completeTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user!;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (role !== 'ADMIN' && task.assigned_to !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status: 'DONE' },
    });

    await prisma.taskLog.create({
      data: {
        task_id: id,
        action: 'COMPLETED',
      },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error completing task', error });
  }
};

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const where: any = {};
    if (role !== 'ADMIN') {
      where.assigned_to = userId;
    }

    const [total, overdue, completed] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.count({ where: { ...where, is_overdue: true } }),
      prisma.task.count({ where: { ...where, status: 'DONE' } }),
    ]);

    res.json({ total, overdue, completed });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error });
  }
};
