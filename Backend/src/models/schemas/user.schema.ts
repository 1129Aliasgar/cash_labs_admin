import { Schema, model } from 'mongoose';
import { IUser } from '../../types/User.types';
import { UserRole, MerchantStatus } from '../../constants/user.constants';

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    fullName: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    telegramId: { type: String, trim: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.MERCHANT,
      index: true,
    },
    merchantStatus: {
      type: String,
      enum: Object.values(MerchantStatus),
      default: function (this: IUser) {
        if (
          this.role === UserRole.SUPER_ADMIN ||
          this.role === UserRole.ADMIN ||
          this.role === UserRole.AGENT
        ) {
          return MerchantStatus.NONE;
        }
        return MerchantStatus.ACTIVE;
      },
      index: true,
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    isVerified: { type: Boolean, default: false, index: true },
    verificationToken: { type: String, select: false },
    verificationTokenExpiry: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, index: true },
    refreshTokenHash: { type: String, select: false },
  },
  { timestamps: true, versionKey: false }
);

userSchema.method('isLocked', function (this: IUser): boolean {
  return !!(this.lockUntil && this.lockUntil.getTime() > Date.now());
});

export const User = model<IUser>('User', userSchema);
export default userSchema;
