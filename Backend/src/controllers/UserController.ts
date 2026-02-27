import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User, UserRole, MerchantStatus } from '../models/User';
import { AuditLog, AuditAction } from '../models/AuditLog';
import { createError } from '../middleware/errorHandler';
import { config } from '../config';

/**
 * createUser — Admin-only endpoint to create other users (internal/merchants)
 * @route POST /api/users/create
 */
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password, fullName, role, companyName } = req.body;
    const currentUserRole = (req as any).user?.role || (req as any).role;

    // 1. Role Hierarchy Validation
    const roleHierarchy: Record<UserRole, number> = {
      [UserRole.SUPER_ADMIN]: 4,
      [UserRole.ADMIN]: 3,
      [UserRole.MERCHANT]: 2,
      [UserRole.AGENT]: 1,
    };

    const targetRole = role as UserRole;

    if (!roleHierarchy[targetRole]) {
        throw createError('Invalid role specified.', 400);
    }

    // A user can ONLY create a role equal to or lower than their own, 
    // but typically ADMINS shouldn't create other ADMINS unless specified.
    // Spec: "Ensure SUPER_ADMIN can create ADMINS, MERCHANTS, and AGENTS."
    // Spec: "Ensure ADMINS can create MERCHANTS and AGENTS."
    
    if (currentUserRole !== UserRole.SUPER_ADMIN) {
        if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
            throw createError('Insufficient permissions to create this role.', 403);
        }
    }

    // 2. Check for existence
    const existing = await User.findOne({ email });
    if (existing) {
      throw createError('User already exists.', 409);
    }

    // 3. Create user
    const passwordHash = await bcrypt.hash(password, config.bcrypt.rounds);
    
    const user = await User.create({
      email,
      password: passwordHash,
      fullName,
      companyName: companyName || '',
      role,
      isVerified: true, // Internal creation usually bypasses email verification
      merchantStatus: role === UserRole.MERCHANT ? MerchantStatus.PENDING : MerchantStatus.NONE,
    });

    // 4. Audit Log
    await AuditLog.create({
      userId: (req as any).userId,
      action: AuditAction.USER_CREATED,
      ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'] || 'unknown',
      metadata: { createdUserId: user._id, createdUserEmail: user.email, role: user.role },
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: `User ${user.email} created successfully as ${user.role}.`,
      data: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * getAllUsers — Get all users in the system (for Team Management)
 * @route GET /api/users
 */
export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await User.find()
      .select('-password -refreshTokenHash')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}
