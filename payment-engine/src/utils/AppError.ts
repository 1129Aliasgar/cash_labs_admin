/**
 * BetSea Admin Backend - Application Error Class
 *
 * This class extends the built-in Error class to provide additional
 * functionality for handling application-specific errors. It includes
 * HTTP status codes and operational flags for better error management
 * and debugging.
 *
 * @author s.adarsh1996@gmail.com
 * @version 1.0.0
 */

import { injectable } from 'inversify';
import { HTTP_STATUS } from '../constants/index';

/**
 * Application Error Class
 * Extends Error class with additional properties for HTTP status and operational state
 */
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

  /**
   * Additional data to be included in the error response
   */
  public data?: unknown;

  /**
   * Constructor for creating application errors
   *
   * @param message - Error message describing what went wrong
   * @param statusCode - HTTP status code (defaults to 500 Internal Server Error)
   * @param isOperational - Whether this is an operational error (defaults to true)
   * @param data - Additional data to be included in the error response
   */
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
