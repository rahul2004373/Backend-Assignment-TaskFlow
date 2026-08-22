import { prisma } from '../lib/prisma.ts';
export const userRepository = {
    async createUser(data) {
        return await prisma.user.create({
            data,
        });
    },
    async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email },
        });
    },
    async findById(id) {
        return await prisma.user.findUnique({
            where: { id },
        });
    }
};
//# sourceMappingURL=user.repository.js.map