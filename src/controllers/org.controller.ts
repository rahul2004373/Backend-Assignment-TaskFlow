import type { Response, NextFunction } from 'express';
import { orgService } from '../services/org.service.ts';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.ts';

export const orgController = {
  async createOrganization(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const org = await orgService.createOrganization(req.body, req.user.id);
      return res.status(201).json({ message: 'Organization created successfully', data: org });
    } catch (error) {
      next(error);
    }
  },
};
