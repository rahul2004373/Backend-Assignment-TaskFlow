import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../../src/services/auth.service.ts';
import { authRepository } from '../../src/repository/auth.repository.ts';
import bcrypt from 'bcryptjs';

vi.mock('../../src/repository/auth.repository.ts', () => ({
  authRepository: {
    findUserByEmail: vi.fn(),
    createUser: vi.fn(),
    createRefreshToken: vi.fn(),
  },
}));

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue(null);
    vi.mocked(authRepository.createUser).mockResolvedValue({
      id: 'user-1',
      name: 'Test',
      email: 'test@example.com',
      password_hash: 'hashed',
      created_at: new Date(),
      updated_at: new Date(),
    });

    const result = await authService.register({
      name: 'Test',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result).toHaveProperty('id');
    expect(authRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
    expect(authRepository.createUser).toHaveBeenCalled();
  });

  it('should throw error if email is already in use', async () => {
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue({
      id: 'user-1',
      name: 'Test',
      email: 'test@example.com',
      password_hash: 'hashed',
      created_at: new Date(),
      updated_at: new Date(),
    });

    await expect(
      authService.register({
        name: 'Test',
        email: 'test@example.com',
        password: 'password123',
      })
    ).rejects.toThrow('Email already in use');
  });
});
