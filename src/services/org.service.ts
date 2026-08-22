import { orgRepository } from '../repository/org.repository.ts';
import type { CreateOrgInput } from '../schema/org.schema.ts';

export const orgService = {
  async createOrganization(data: CreateOrgInput, userId: string) {
    return await orgRepository.createOrganization(data.name, userId);
  },
};
