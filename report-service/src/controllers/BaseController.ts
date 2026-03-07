import { Request, Response } from 'express';

export abstract class BaseController {
  protected sendSuccessResponse(
    res: Response,
    data: unknown,
    message: string = 'Success',
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  protected sendErrorResponse(
    res: Response,
    error: { message?: string; code?: string },
    statusCode: number = 500
  ): void {
    res.status(statusCode).json({
      success: false,
      error: error?.message || 'Internal server error',
      code: error?.code || 'UNKNOWN_ERROR',
      timestamp: new Date().toISOString(),
    });
  }

  protected validateRequiredFields(req: Request, fields: string[]): string[] {
    const missing: string[] = [];
    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }
    return missing;
  }
}
