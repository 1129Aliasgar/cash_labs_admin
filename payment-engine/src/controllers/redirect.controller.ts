import { controller, httpGet, requestParam, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Response } from 'express';
import { TYPES } from '../types';
import { TenantContextProvider } from '../utils/tenantContext.provider';
import { ITransactionDoc } from '../types/Transaction.types';

@controller('/redirect')
export class RedirectController {
  constructor(
    @inject(TYPES.TenantContextProvider) private readonly tenantContextProvider: TenantContextProvider
  ) {}

  @httpGet('/:transactionId')
  public async redirectByTransactionId(
    @requestParam('transactionId') transactionId: string,
    @response() res: Response
  ): Promise<void> {
    const models = this.tenantContextProvider.models as Record<string, unknown> | undefined;
    const Transaction = models?.transaction as { findOne: (q: { transactionId: string }) => Promise<ITransactionDoc | null> } | undefined;

    if (!Transaction) {
      res.status(503).json({ success: false, error: 'Transaction model not available' });
      return;
    }

    const doc = await Transaction.findOne({ transactionId: transactionId.trim() });
    if (!doc) {
      res.status(404).json({ success: false, error: 'Transaction not found' });
      return;
    }

    const redirectUrl = doc.redirectUrl?.trim();
    if (!redirectUrl) {
      res.status(404).json({ success: false, error: 'Redirect URL not set for this transaction' });
      return;
    }

    res.redirect(302, redirectUrl);
  }
}
