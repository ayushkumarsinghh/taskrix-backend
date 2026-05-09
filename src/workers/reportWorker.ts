import { Worker, Job } from 'bullmq';
import redisConnection from '../config/redis';
import prisma from '../config/db';
import { io } from '../server';

const reportWorker = new Worker(
  'reports',
  async (job: Job) => {
    const { userId } = job.data;
    console.log(`📊 Generating report for user: ${userId}...`);

    // Simulate intensive work
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const tasks = await prisma.task.findMany({
      where: { assigned_to: userId },
    });

    // In a real app, you'd generate a PDF/CSV and upload to S3 here
    // For this demo, we'll just send a "ready" event with task count
    const reportUrl = '#'; // Mock URL
    
    io.emit(`report-ready-${userId}`, {
      message: 'Your task report is ready for download!',
      taskCount: tasks.length,
      downloadUrl: reportUrl,
      timestamp: new Date()
    });

    console.log(`✅ Report ready for user: ${userId}`);
  },
  { connection: redisConnection }
);

export default reportWorker;
