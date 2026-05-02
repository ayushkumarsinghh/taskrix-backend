import { Worker, Job } from 'bullmq';
import redisConnection from '../config/redis';
import prisma from '../config/db';

const worker = new Worker(
  'tasks',
  async (job: Job) => {
    const { taskId, deadline } = job.data;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (task && task.status !== 'DONE') {
      const now = new Date();
      if (new Date(deadline) <= now) {
        // Mark overdue and escalate
        await prisma.task.update({
          where: { id: taskId },
          data: {
            is_overdue: true,
            priority: 'HIGH', // Automatically boost to HIGH if not already
          },
        });

        await prisma.taskLog.create({
          data: {
            task_id: taskId,
            action: 'ESCALATED',
          },
        });

        console.log('Task overdue and escalated:', taskId);
      }
    }
  },
  { connection: redisConnection }
);

export default worker;
