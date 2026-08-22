import { taskRepository } from '../repository/task.repository.ts';
import { projectRepository } from '../repository/project.repository.ts';
import { prisma } from '../lib/prisma.ts';
import type { CreateTaskInput, UpdateTaskInput, GetTasksQueryInput } from '../schema/task.schema.ts';
import { AppError } from '../lib/error.ts';

export const taskService = {
  async create(data: CreateTaskInput, organization_id: string) {
    const project = await projectRepository.findById(data.project_id, organization_id);
    if (!project) {
      throw new AppError('Project not found or access denied', 404, 'PROJECT_NOT_FOUND');
    }

    return await taskRepository.create({
      title: data.title,
      description: data.description,
      project_id: data.project_id,
      status: data.status,
      priority: data.priority,
      due_date: new Date(data.due_date),
    });
  },

  async getAll(query: GetTasksQueryInput, organization_id: string) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const result = await taskRepository.findAll(
      organization_id,
      {
        status: query.status,
        priority: query.priority,
        assignee: query.assignee,
        startDate: query.startDate,
        endDate: query.endDate,
      },
      { skip, take: limit }
    );

    return {
      data: result.data,
      total: result.total,
      page,
      limit,
    };
  },

  async getById(id: string, organization_id: string) {
    const task = await taskRepository.findById(id, organization_id);
    if (!task) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }
    return task;
  },

  async update(id: string, data: UpdateTaskInput, organization_id: string) {
    const task = await taskRepository.findById(id, organization_id);
    if (!task) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    const updateData: any = { ...data };
    if (data.due_date) {
      updateData.due_date = new Date(data.due_date);
    }

    return await taskRepository.update(id, updateData);
  },

  async delete(id: string, organization_id: string) {
    const task = await taskRepository.findById(id, organization_id);
    if (!task) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }
    await taskRepository.delete(id);
  },

  async assignUser(id: string, user_id: string, organization_id: string) {
    const task = await taskRepository.findById(id, organization_id);
    if (!task) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    // Verify user belongs to the same org
    const member = await prisma.orgMember.findUnique({
      where: {
        user_id_organization_id: {
          user_id,
          organization_id,
        },
      },
    });

    if (!member) {
      throw new AppError('User does not belong to the organization', 403, 'FORBIDDEN');
    }

    try {
      await taskRepository.assignUser(id, user_id);
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new AppError('User is already assigned to this task', 409, 'ALREADY_ASSIGNED');
      }
      throw e;
    }
  },

  async unassignUser(id: string, user_id: string, organization_id: string) {
    const task = await taskRepository.findById(id, organization_id);
    if (!task) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    try {
      await taskRepository.unassignUser(id, user_id);
    } catch (e: any) {
      if (e.code === 'P2025') {
        throw new AppError('User is not assigned to this task', 404, 'NOT_ASSIGNED');
      }
      throw e;
    }
  },
};
