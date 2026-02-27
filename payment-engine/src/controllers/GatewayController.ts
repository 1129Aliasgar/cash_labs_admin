import { controller, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { TYPES } from '../types';
import { GatewayService } from '../services/GatewayService';
import { getGatewaysQuerySchema } from '../validators/gateway.validator';
import { HTTP_STATUS } from '../constants/index';
import { AppError } from '../utils/AppError';

@controller('/gateways')
export class GatewayController extends BaseController {
  constructor(
    @inject(TYPES.GatewayService) private readonly gatewayService: GatewayService
  ) {
    super();
  }

  @httpGet('/')
  public async getGateways(req: Request, res: Response): Promise<void> {
    const { error, value } = getGatewaysQuerySchema.validate(req.query, {
      stripUnknown: true,
      abortEarly: false,
    });

    if (error) {
      const message = error.details.map((d) => d.message).join('; ');
      this.sendErrorResponse(res, new AppError(message, HTTP_STATUS.BAD_REQUEST), HTTP_STATUS.BAD_REQUEST);
      return;
    }

    try {
      const result = await this.gatewayService.getGateways(value);
      this.sendSuccessResponse(res, result, 'Gateways retrieved', HTTP_STATUS.OK);
    } catch (err) {
      const appError = err instanceof AppError ? err : new AppError('Failed to fetch gateways', HTTP_STATUS.INTERNAL_SERVER_ERROR);
      this.sendErrorResponse(res, appError, appError.statusCode);
    }
  }
}
