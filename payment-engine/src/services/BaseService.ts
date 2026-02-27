/**
 * Payment Engine - Base Service Class
 *
 * This class provides a foundation for all service classes in the application.
 * It includes common functionality such as error handling and validation.
 * All other services should extend this class.
 *
 * @author s.adarsh1996@gmail.com
 * @version 1.0.0
 */

import { injectable } from 'inversify';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/index';

@injectable()
export abstract class BaseService {
  /**
   * Create a new application error
   */
  protected createError(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ): AppError {
    return new AppError(message, statusCode, isOperational);
  }

  /**
   * Handle and wrap errors with consistent error handling
   */
  protected handleError(
    error: unknown,
    defaultMessage: string = 'An unexpected error occurred',
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
  ): AppError {
    if (error instanceof AppError) {
      return error;
    }
    const message = error instanceof Error ? error.message : defaultMessage;
    return this.createError(message, statusCode);
  }

  /**
   * Validate that a value exists and throw error if missing
   */
  protected validateValue(
    value: unknown,
    paramName: string,
    statusCode: number = HTTP_STATUS.NOT_FOUND
  ): void {
    if (value === undefined || value === null) {
      throw this.createError(`${paramName} is required`, statusCode);
    }
  }

  /**
   * Validate business rule and throw error if violated
   */
  protected validateBusinessRule(
    condition: boolean,
    message: string,
    statusCode: number = HTTP_STATUS.BAD_REQUEST
  ): void {
    if (!condition) {
      throw this.createError(message, statusCode);
    }
  }
}
