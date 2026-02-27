import express from 'express';
import { finalizeOnboarding } from '../controllers/MerchantController';
import { authenticate } from '../middleware/authenticate';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../models/User';

const router = express.Router();

// Finalize onboarding - only for MERCHANTS
router.post('/onboarding/finalize', 
    authenticate, 
    requireRole(UserRole.MERCHANT), 
    finalizeOnboarding
);

export default router;
