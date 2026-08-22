import { orgRepository } from '../repository/org.repository.ts';
export const orgService = {
    async createOrganization(data, userId) {
        return await orgRepository.createOrganization(data.name, userId);
    },
};
//# sourceMappingURL=org.service.js.map