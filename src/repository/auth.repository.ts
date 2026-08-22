import { prisma } from '../lib/prisma.ts';
import { randomBytes } from 'crypto';

export const authRepository = {
  async createRefreshToken(userId: string, expiresInDays: number = 7) {
    const token = randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    return await prisma.refreshToken.create({
      data: {
        token,
        user_id: userId,
        expires_at: expiresAt,
      },
    });
  },

  async findRefreshToken(token: string) {
    return await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  },

  async revokeRefreshToken(token: string) {
    return await prisma.refreshToken.update({
      where: { token },
      data: { revoked: true },
    });
  },
  
  async revokeAllUserTokens(userId: string) {
    return await prisma.refreshToken.updateMany({
      where: { user_id: userId, revoked: false },
      data: { revoked: true },
    });
  }
};
