import { prisma } from '../lib/prisma.ts';

export const userRepository = {
  async createUser(data: any) {
    return await prisma.user.create({
      data,
    });
  },

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }
};
