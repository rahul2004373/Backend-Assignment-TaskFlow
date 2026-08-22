import { prisma } from '../lib/prisma.ts';
export const orgRepository = {
    async createOrganization(name, adminUserId) {
        return await prisma.$transaction(async (tx) => {
            const org = await tx.organization.create({
                data: {
                    name,
                },
            });
            await tx.orgMember.create({
                data: {
                    role: 'org_admin',
                    user_id: adminUserId,
                    organization_id: org.id,
                },
            });
            return org;
        });
    },
};
//# sourceMappingURL=org.repository.js.map