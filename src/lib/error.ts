import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details: any;

  constructor(message: string, statusCode: number, code: string, details: any = {}) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const errorHandler = ((err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let code = err.code || "INTERNAL_ERROR";
    let details = err.details || {};

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Invalid data provided";
        code = "VALIDATION_ERROR";
    }

    res.status(statusCode).json({
        error: message,
        code,
        details,
    });
});