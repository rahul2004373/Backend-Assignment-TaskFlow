import { describe, it, expect, vi, beforeEach } from 'vitest';
import { taskService } from '../../src/services/task.service.ts';
import { taskRepository } from '../../src/repository/task.repository.ts';
import { prisma } from '../../src/lib/prisma.ts';

vi.mock('../../src/repository/task.repository.ts', () => ({
  taskRepository: {
    findById: vi.fn(),
    assignUser: vi.fn(),
  },
}));

vi.mock('../../src/lib/prisma.ts', () => ({
  prisma: {
    orgMember: {
      findUnique: vi.fn(),
    },
  },
}));

describe('Task Assignment Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error if user is not in the same organization', async () => {
    vi.mocked(taskRepository.findById).mockResolvedValue({ id: 'task-1' } as any);
    // Mock user not found in the organization
    vi.mocked(prisma.orgMember.findUnique).mockResolvedValue(null);

    await expect(
      taskService.assignUser('task-1', 'user-1', 'org-1')
    ).rejects.toThrow('User does not belong to the organization');
  });

  it('should call assignUser if validation passes', async () => {
    vi.mocked(taskRepository.findById).mockResolvedValue({ id: 'task-1' } as any);
    vi.mocked(prisma.orgMember.findUnique).mockResolvedValue({ id: 'member-1' } as any);

    await taskService.assignUser('task-1', 'user-1', 'org-1');

    expect(taskRepository.assignUser).toHaveBeenCalledWith('task-1', 'user-1');
  });
});
