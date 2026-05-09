import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisConnection = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null })
  : new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: null,
    });

redisConnection.on('error', (err) => {
  console.error('❌ Redis Connection Error:', err);
});

redisConnection.on('connect', () => {
  console.log('✅ Successfully connected to Redis');
});

export default redisConnection;
