import { z } from 'zod';
import { Status, Priority } from '../../generated/prisma/client.ts';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Task title is required'),
    description: z.string().min(1, 'Task description is required'),
    project_id: z.string().uuid('Invalid project ID'),
    status: z.nativeEnum(Status, { message: 'Invalid status' }),
    priority: z.nativeEnum(Priority, { message: 'Invalid priority' }),
    due_date: z.string().datetime({ message: 'Invalid due date (must be ISO 8601)' }),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Task title is required').optional(),
    description: z.string().min(1, 'Task description is required').optional(),
    status: z.nativeEnum(Status).optional(),
    priority: z.nativeEnum(Priority).optional(),
    due_date: z.string().datetime().optional(),
  }),
});

export const getTasksQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default(20),
    status: z.nativeEnum(Status).optional(),
    priority: z.nativeEnum(Priority).optional(),
    assignee: z.string().uuid().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

export const assignTaskSchema = z.object({
  body: z.object({
    user_id: z.string().uuid('Invalid user ID'),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>['body'];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>['body'];
export type GetTasksQueryInput = z.infer<typeof getTasksQuerySchema>['query'];
export type AssignTaskInput = z.infer<typeof assignTaskSchema>['body'];
