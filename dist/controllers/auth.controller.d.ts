import type { Request, Response, NextFunction } from 'express';
export declare const authController: {
    register(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    login(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    refresh(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    logout(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
};
