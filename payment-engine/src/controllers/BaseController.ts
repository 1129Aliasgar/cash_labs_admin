/**
 * Base Controller for Payment Engine
 *
 * This base controller provides common functionality for all controllers,
 * including standardized success/error responses and validation helpers.
 *
 * @author s.adarsh1996@gmail.com
 * @version 1.0.0
 */

import { Request, Response } from 'express';

/**
 * Base Controller Class
 * Provides common functionality for all controllers
 */
export abstract class BaseController {
  /**
   * Create a standardized success response
   */
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

  /**
   * Create a standardized error response
   */
  protected sendErrorResponse(
    res: Response,
    error: { message?: string; code?: string },
    statusCode: number = 500
  ): void {
    const errorMessage = error?.message || 'Internal server error';
    const errorCode = error?.code || 'UNKNOWN_ERROR';

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      code: errorCode,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Validate required fields in request body
   */
  protected validateRequiredFields(req: Request, fields: string[]): string[] {
    const missingFields: string[] = [];
    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missingFields.push(field);
      }
    }
    return missingFields;
  }
}
