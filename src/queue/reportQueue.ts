import { Queue } from 'bullmq';
import redisConnection from '../config/redis';

export const reportQueue = new Queue('reports', {
  connection: redisConnection,
});

export const addReportJob = async (userId: string) => {
  await reportQueue.add('generate-report', { userId }, {
    removeOnComplete: true,
    removeOnFail: { count: 1000 },
  });
};
