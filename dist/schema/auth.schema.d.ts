import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const refreshSchema: z.ZodObject<{
    body: z.ZodObject<{
        refreshToken: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RefreshInput = z.infer<typeof refreshSchema>['body'];
