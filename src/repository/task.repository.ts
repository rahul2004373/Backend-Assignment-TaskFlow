import { prisma } from '../lib/prisma.ts';
import type { Prisma } from '../../generated/prisma/client.ts';
import { emailQueue } from '../worker/queue.ts';

export const taskRepository = {
  async create(data: Prisma.TaskUncheckedCreateInput) {
    return prisma.task.create({ data });
  },

  async findAll(
    organization_id: string,
    filters: { status?: any; priority?: any; assignee?: string; startDate?: string; endDate?: string },
    pagination: { skip: number; take: number }
  ) {
    const where: Prisma.TaskWhereInput = {
      project: {
        organization_id,
      },
    };

    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.startDate || filters.endDate) {
      where.due_date = {};
      if (filters.startDate) where.due_date.gte = new Date(filters.startDate);
      if (filters.endDate) where.due_date.lte = new Date(filters.endDate);
    }
    if (filters.assignee) {
      where.task_assignments = {
        some: {
          user_id: filters.assignee,
        },
      };
    }

    const [data, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { created_at: 'desc' },
        include: {
          task_assignments: {
            include: { user: { select: { id: true, name: true, email: true } } },
          },
        },
      }),
      prisma.task.count({ where }),
    ]);

    return { data, total };
  },

  async findById(id: string, organization_id: string) {
    return prisma.task.findFirst({
      where: {
        id,
        project: { organization_id },
      },
      include: {
        task_assignments: true,
      },
    });
  },

  async update(id: string, data: Prisma.TaskUpdateInput) {
    return prisma.task.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.task.delete({
      where: { id },
    });
  },

  async assignUser(task_id: string, user_id: string) {
    return prisma.$transaction(async (tx) => {
      const assignment = await tx.taskAssignment.create({
        data: {
          task_id,
          user_id,
        },
      });

      const user = await tx.user.findUnique({ where: { id: user_id } });
      const task = await tx.task.findUnique({ where: { id: task_id } });

      if (user && task) {
        // Enqueue email job. If this fails, the assignment creation is rolled back.
        await emailQueue.add(
          'send-email',
          {
            to: user.email,
            subject: `New Task Assigned: ${task.title}`,
            body: `You have been assigned to task: ${task.title}\n\nDescription: ${task.description}`,
          },
          {
            jobId: `assign-${task_id}-${user_id}`, // Deduplication within 5 seconds based on Redis expiry? Actually jobId deduplicates as long as it's in the queue or within retention.
            attempts: 4, // 1 initial + 3 retries
            backoff: { type: 'exponential', delay: 1000 }, // 1s, 2s, 4s
            removeOnComplete: { age: 3600 },
            removeOnFail: { age: 24 * 3600 }, // Keep failed jobs for inspection (dead-letter)
          }
        );
      }

      return assignment;
    });
  },

  async unassignUser(task_id: string, user_id: string) {
    return prisma.taskAssignment.delete({
      where: {
        task_id_user_id: {
          task_id,
          user_id,
        },
      },
    });
  },
};
