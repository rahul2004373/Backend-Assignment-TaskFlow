import type { Request, Response, NextFunction } from 'express';
import { jobService } from '../services/job.service.ts';

export const jobController = {
  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const jobDetails = await jobService.getJobStatus(req.params.id as string);
      return res.status(200).json({ data: jobDetails });
    } catch (error) {
      next(error);
    }
  },
};
