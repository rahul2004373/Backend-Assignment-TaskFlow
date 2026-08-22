import { Queue } from 'bullmq';
import Redis from 'ioredis';

const redisConnection = new (Redis as any)(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const emailQueue = new Queue('email-notifications', {
  connection: redisConnection,
});
