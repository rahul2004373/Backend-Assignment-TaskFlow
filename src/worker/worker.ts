import 'dotenv/config';
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { sendMockEmail } from './mock-email.ts';

const redisConnection = new (Redis as any)(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  'email-notifications',
  async (job) => {
    console.log(`[Worker] Processing job ${job.id}`);
    const { to, subject, body } = job.data;
    
    // Simulate email sending
    await sendMockEmail(job.id as string, to, 'noreply@taskflow.local', subject, body);
  },
  {
    connection: redisConnection,
    limiter: {
      max: 50, // 50 emails
      duration: 60000, // per minute (60,000 ms)
    },
  }
);

worker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed:`, err.message);
});

console.log('[Worker] Started listening for email-notifications jobs...');
