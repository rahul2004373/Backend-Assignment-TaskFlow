import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().min(1, 'Project description is required'),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required').optional(),
    description: z.string().min(1, 'Project description is required').optional(),
  }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>['body'];
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>['body'];
