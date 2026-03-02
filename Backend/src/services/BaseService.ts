import { injectable } from 'inversify';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../config/http.constants';

@injectable()
export abstract class BaseService {
  protected createError(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ): AppError {
    return new AppError(message, statusCode, isOperational);
  }

  protected handleError(
    error: unknown,
    defaultMessage: string = 'An unexpected error occurred',
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
  ): AppError {
    if (error instanceof AppError) return error;
    const message = error instanceof Error ? error.message : defaultMessage;
    return this.createError(message, statusCode);
  }

  protected validateValue(
    value: unknown,
    paramName: string,
    statusCode: number = HTTP_STATUS.NOT_FOUND
  ): void {
    if (value === undefined || value === null) {
      throw this.createError(`${paramName} is required`, statusCode);
    }
  }

  protected validateBusinessRule(
    condition: boolean,
    message: string,
    statusCode: number = HTTP_STATUS.BAD_REQUEST
  ): void {
    if (!condition) throw this.createError(message, statusCode);
  }
}
