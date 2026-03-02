import { injectable } from 'inversify';
import { HTTP_STATUS } from '../config/http.constants';

@injectable()
export class AppError extends Error {
  /**
   * HTTP status code for the error response
   */
  public statusCode: number;

  /**
   * Flag indicating if the error is operational (expected) or programming (unexpected)
   */
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/** Helper to create an AppError with message and status code (e.g. 400, 401, 404). */
export function createError(message: string, statusCode: number): AppError {
  return new AppError(message, statusCode, true);
}
