import { Request, Response } from 'express';
import { User, MerchantStatus } from '../models/User';
import { AuditLog, AuditAction } from '../models/AuditLog';

export const finalizeOnboarding = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as any).userId;
        
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userDoc = await User.findById(userId);
        if (!userDoc) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userDoc.role !== 'MERCHANT') {
            return res.status(403).json({ message: 'Only merchants can perform onboarding' });
        }

        // Transition from ACTIVE (or NONE) to PENDING
        userDoc.merchantStatus = MerchantStatus.PENDING;
        await userDoc.save();

        await AuditLog.create({
            userId,
            action: AuditAction.SIGNUP,
            metadata: { 
                details: 'Merchant onboarding application submitted',
                previousStatus: userDoc.merchantStatus, // This is already updated in memory but good to log intent
                newStatus: MerchantStatus.PENDING 
            },
            ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress,
            userAgent: req.headers['user-agent'] || 'unknown'
        });

        return res.status(200).json({ 
            message: 'Onboarding application submitted successfully',
            status: 'PENDING'
        });
    } catch (error) {
        console.error('Finalize onboarding error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
