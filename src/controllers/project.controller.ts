import type { Response, NextFunction } from 'express';
import { projectService } from '../services/project.service.ts';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.ts';
import { AppError } from '../lib/error.ts';

export const projectController = {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.orgContext) throw new AppError('Organization context required', 401, 'UNAUTHORIZED');
      const project = await projectService.create(req.body, req.orgContext.org_id);
      return res.status(201).json({ data: project });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.orgContext) throw new AppError('Organization context required', 401, 'UNAUTHORIZED');
      const projects = await projectService.getAll(req.orgContext.org_id);
      return res.status(200).json({ data: projects });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.orgContext) throw new AppError('Organization context required', 401, 'UNAUTHORIZED');
      const project = await projectService.getById(req.params.id as string, req.orgContext.org_id);
      return res.status(200).json({ data: project });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.orgContext) throw new AppError('Organization context required', 401, 'UNAUTHORIZED');
      const project = await projectService.update(req.params.id as string, req.orgContext.org_id, req.body);
      return res.status(200).json({ data: project });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.orgContext) throw new AppError('Organization context required', 401, 'UNAUTHORIZED');
      await projectService.delete(req.params.id as string, req.orgContext.org_id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.orgContext) throw new AppError('Organization context required', 401, 'UNAUTHORIZED');
      const dashboard = await projectService.getDashboard(req.params.id as string, req.orgContext.org_id);
      return res.status(200).json({ data: dashboard });
    } catch (error) {
      next(error);
    }
  },
};
