import { HTTP_STATUS } from '../constants/index';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public data?: unknown;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true,
    data?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.data = data;
    Object.setPrototypeOf(this, AppError.prototype);
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
