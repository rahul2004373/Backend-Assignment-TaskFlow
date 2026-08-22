import { projectRepository } from '../repository/project.repository.ts';
import type { CreateProjectInput, UpdateProjectInput } from '../schema/project.schema.ts';
import { AppError } from '../lib/error.ts';

export const projectService = {
  async create(data: CreateProjectInput, organization_id: string) {
    return await projectRepository.create({
      ...data,
      organization_id,
    });
  },

  async getAll(organization_id: string) {
    return await projectRepository.findAll(organization_id);
  },

  async getById(id: string, organization_id: string) {
    const project = await projectRepository.findById(id, organization_id);
    if (!project) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }
    return project;
  },

  async update(id: string, organization_id: string, data: UpdateProjectInput) {
    const project = await projectRepository.findById(id, organization_id);
    if (!project) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }
    return await projectRepository.update(id, organization_id, data);
  },

  async delete(id: string, organization_id: string) {
    const project = await projectRepository.findById(id, organization_id);
    if (!project) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }
    await projectRepository.delete(id, organization_id);
  },

  async getDashboard(id: string, organization_id: string) {
    const counts = await projectRepository.getDashboardCounts(id, organization_id);
    if (!counts) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }
    return counts;
  },
};
