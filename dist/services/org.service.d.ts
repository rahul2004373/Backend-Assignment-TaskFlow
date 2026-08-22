import type { CreateOrgInput } from '../schema/org.schema.ts';
export declare const orgService: {
    createOrganization(data: CreateOrgInput, userId: string): Promise<any>;
};
