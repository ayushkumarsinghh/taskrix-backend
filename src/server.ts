import http from 'http';
import { Server, Socket } from 'socket.io';
import app from './app';
import './workers/taskWorker';
import './workers/reportWorker';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*', 
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket: Socket) => {
  console.log('⚡ Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
});

const httpServer = server.listen(PORT, () => {
  console.log(`🚀 Taskrix Backend running on http://localhost:${PORT}`);
});

// Graceful Shutdown implementation
import prisma from './config/db';
import redisConnection from './config/redis';

const shutdown = async (signal: string) => {
  console.log(`\n${signal} signal received: closing HTTP server`);
  
  httpServer.close(async () => {
    console.log('HTTP server closed');
    
    try {
      await prisma.$disconnect();
      console.log('Prisma disconnected');
      
      redisConnection.disconnect();
      console.log('Redis disconnected');
      
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
