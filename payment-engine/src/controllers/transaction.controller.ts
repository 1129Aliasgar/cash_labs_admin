import { controller, httpPost, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../types';
import { TransactionService } from '../services/transaction.service';
import { apmTransactionBodySchema } from '../validators/transaction.validator';
import { HTTP_STATUS } from '../constants/index';

const CLIENT_ID_HEADER = 'x-client-id';
const CLIENT_SECRET_HEADER = 'x-client-secret';

@controller('/transactions')
export class TransactionController {
  constructor(
    @inject(TYPES.TransactionService) private readonly transactionService: TransactionService
  ) {}

  @httpPost('/apm')
  public async createApmTransaction(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    const clientId = (req.headers[CLIENT_ID_HEADER] as string)?.trim();
    const clientSecret = (req.headers[CLIENT_SECRET_HEADER] as string)?.trim();

    if (!clientId || !clientSecret) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: 'Missing x-client-id or x-client-secret header',
      });
      return;
    }

    const { error, value } = apmTransactionBodySchema.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    if (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map((d) => ({ path: d.path.join('.'), message: d.message })),
      });
      return;
    }

    try {
      const result = await this.transactionService.createApmTransaction(
        clientId,
        clientSecret,
        value
      );
      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (err: unknown) {
      const statusCode =
        err && typeof err === 'object' && 'statusCode' in err
          ? (err as { statusCode: number }).statusCode
          : HTTP_STATUS.INTERNAL_SERVER_ERROR;
      const message =
        err instanceof Error ? err.message : 'Internal server error';
      res.status(statusCode).json({
        success: false,
        error: message,
      });
    }
  }
}
