import { injectable } from 'inversify';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/index';

@injectable()
export abstract class BaseService {
  protected createError(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ): AppError {
    return new AppError(message, statusCode, isOperational);
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
    if (!condition) {
      throw this.createError(message, statusCode);
    }
  }
}
