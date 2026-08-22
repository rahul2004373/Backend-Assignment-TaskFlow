import { z } from 'zod';
export declare const createOrgSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateOrgInput = z.infer<typeof createOrgSchema>['body'];
