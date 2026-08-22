import type { Response, NextFunction } from 'express';
import { taskService } from '../services/task.service.ts';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.ts';
import { AppError } from '../lib/error.ts';
import type { GetTasksQueryInput } from '../schema/task.schema.ts';

export const taskController = {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.orgContext) throw new AppError('Organization context required', 401, 'UNAUTHORIZED');
      const task = await taskService.create(req.body, req.orgContext.org_id);
      return res.status(201).json({ data: task });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.orgContext) throw new AppError('Organization context required', 401, 'UNAUTHORIZED');
      const result = await taskService.getAll(req.query as unknown as GetTasksQueryInput, req.orgContext.org_id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.orgContext) throw new AppError('Organization context required', 401, 'UNAUTHORIZED');
      const task = await taskService.getById(req.params.id as string, req.orgContext.org_id);
      return res.status(200).json({ data: task });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.orgContext) throw new AppError('Organization context required', 401, 'UNAUTHORIZED');
      const task = await taskService.update(req.params.id as string, req.body, req.orgContext.org_id);
      return res.status(200).json({ data: task });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.orgContext) throw new AppError('Organization context required', 401, 'UNAUTHORIZED');
      await taskService.delete(req.params.id as string, req.orgContext.org_id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async assignUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.orgContext) throw new AppError('Organization context required', 401, 'UNAUTHORIZED');
      await taskService.assignUser(req.params.id as string, req.body.user_id, req.orgContext.org_id);
      return res.status(200).json({ message: 'User assigned successfully' });
    } catch (error) {
      next(error);
    }
  },

  async unassignUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.orgContext) throw new AppError('Organization context required', 401, 'UNAUTHORIZED');
      await taskService.unassignUser(req.params.id as string, req.body.user_id, req.orgContext.org_id);
      return res.status(200).json({ message: 'User unassigned successfully' });
    } catch (error) {
      next(error);
    }
  },
};
