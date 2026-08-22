import { emailQueue } from '../worker/queue.ts';
import { AppError } from '../lib/error.ts';

export const jobService = {
  async getJobStatus(jobId: string) {
    const job = await emailQueue.getJob(jobId);

    if (!job) {
      throw new AppError('Job not found', 404, 'JOB_NOT_FOUND');
    }

    const state = await job.getState();

    // Map bullmq state to our expected response format
    let status = 'pending'; // 'waiting', 'delayed', 'prioritized'
    if (state === 'active') status = 'active';
    else if (state === 'completed') status = 'completed';
    else if (state === 'failed') status = 'failed';

    return {
      id: job.id,
      status,
      metadata: {
        attemptsMade: job.attemptsMade,
        failedReason: job.failedReason,
        data: job.data,
      },
    };
  },
};
