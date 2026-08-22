import { describe, it, expect } from 'vitest';
import { taskService } from '../../src/services/task.service.ts';
import { taskRepository } from '../../src/repository/task.repository.ts';
import { vi } from 'vitest';

vi.mock('../../src/repository/task.repository.ts', () => ({
  taskRepository: {
    findAll: vi.fn(),
  },
}));

describe('Pagination logic', () => {
  it('should calculate skip and take correctly', async () => {
    vi.mocked(taskRepository.findAll).mockResolvedValue({ data: [], total: 0 });

    await taskService.getAll({ page: 2, limit: 15 }, 'org-1');

    expect(taskRepository.findAll).toHaveBeenCalledWith(
      'org-1',
      expect.any(Object),
      { skip: 15, take: 15 } // (2 - 1) * 15 = 15
    );
  });
});
