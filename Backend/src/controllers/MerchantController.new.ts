import { controller, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../config/inversifyTypes';
import { MerchantService } from '../services/MerchantService';
import { authenticate } from '../middlewares/authenticate.middleware';
import { requireRole } from '../middlewares/requireRole.middleware';
import { UserRole } from '../constants/user.constants';

@controller('/api/merchant')
export class MerchantController {
  constructor(@inject(TYPES.MerchantService) private merchantService: MerchantService) {}

  @httpPost('/onboarding/finalize', authenticate, requireRole(UserRole.MERCHANT))
  public async finalizeOnboarding(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const result = await this.merchantService.finalizeOnboarding(userId, req);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
