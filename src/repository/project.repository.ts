import { prisma } from '../lib/prisma.ts';

export const projectRepository = {
  async create(data: { name: string; description: string; organization_id: string }) {
    return prisma.project.create({ data });
  },

  async findAll(organization_id: string) {
    return prisma.project.findMany({
      where: { organization_id },
      orderBy: { created_at: 'desc' },
    });
  },

  async findById(id: string, organization_id: string) {
    return prisma.project.findFirst({
      where: { id, organization_id },
    });
  },

  async update(id: string, organization_id: string, data: { name?: string; description?: string }) {
    return prisma.project.update({
      where: { id },
      data,
    });
  },

  async delete(id: string, organization_id: string) {
    return prisma.project.delete({
      where: { id },
    });
  },

  async getDashboardCounts(projectId: string, organization_id: string) {
    // Make sure project belongs to org
    const project = await this.findById(projectId, organization_id);
    if (!project) return null;

    const counts = await prisma.task.groupBy({
      by: ['status'],
      where: { project_id: projectId },
      _count: {
        _all: true,
      },
    });

    return counts.map((c: any) => ({
      status: c.status,
      count: c._count._all,
    }));
  }
};
