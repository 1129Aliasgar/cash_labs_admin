import { Document } from 'mongoose';
import { UserRole, MerchantStatus } from '../constants/user.constants';

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
export type MerchantStatusType = (typeof MerchantStatus)[keyof typeof MerchantStatus];

export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  companyName: string;
  telegramId?: string;
  role: UserRoleType;
  merchantStatus: MerchantStatusType;
  approvedBy?: string;
  approvedAt?: Date;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  failedLoginAttempts: number;
  lockUntil?: Date;
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
}
