import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

export const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

const redisConnection = new Redis({
  ...redisConfig,
  maxRetriesPerRequest: null,
});

export default redisConnection;
