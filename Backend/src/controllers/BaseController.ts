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
    error: { message?: string; statusCode?: number },
    statusCode?: number
  ): void {
    const code = statusCode ?? error.statusCode ?? 500;
    res.status(code).json({
      success: false,
      message: error?.message ?? 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
}
