import { prisma } from '../lib/prisma.ts';

export const orgRepository = {
  async createOrganization(name: string, adminUserId: string) {
    return await prisma.$transaction(async (tx: any) => {
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
