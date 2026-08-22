import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.ts';
export declare const orgController: {
    createOrganization(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
};
