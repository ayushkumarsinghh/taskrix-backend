import { Queue } from 'bullmq';
import redisConnection from '../config/redis';

export const taskQueue = new Queue('tasks', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
  },
});

export const addEscalationJob = async (taskId: string, priority: string, deadline: Date) => {
  const delay = new Date(deadline).getTime() - Date.now();
  
  await taskQueue.add(
    'process-task',
    { taskId, priority, deadline },
    { delay: delay > 0 ? delay : 0 }
  );
};
