import type { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
    orgContext?: {
        org_id: string;
        role: string;
    };
}
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
