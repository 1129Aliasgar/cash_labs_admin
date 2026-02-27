import mongoose, { Document, Schema, Model } from 'mongoose';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MERCHANT = 'MERCHANT',
  AGENT = 'AGENT',
}

export enum MerchantStatus {
  NONE = 'NONE',
  ACTIVE = 'ACTIVE', // Has signed up, needs onboarding
  PENDING = 'PENDING', // Has submitted onboarding, awaiting approval
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  companyName: string;
  telegramId?: string;

  role: UserRole;
  merchantStatus: MerchantStatus;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;

  isVerified: boolean;
  verificationToken?: string;       // hashed
  verificationTokenExpiry?: Date;

  failedLoginAttempts: number;
  lockUntil?: Date;

  refreshTokenHash?: string;

  createdAt: Date;
  updatedAt: Date;
}

// Virtual — is the account currently locked?
export interface IUserMethods {
  isLocked(): boolean;
}

type UserModel = Model<IUser, object, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
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
      select: false, // Never return password in queries unless explicitly requested
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    telegramId: {
      type: String,
      trim: true,
    },

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
        if (this.role === UserRole.SUPER_ADMIN || this.role === UserRole.ADMIN || this.role === UserRole.AGENT) {
          return MerchantStatus.NONE;
        }
        // Merchants start in ACTIVE state (onboarding phase)
        return MerchantStatus.ACTIVE;
      },
      index: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },

    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpiry: {
      type: Date,
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      index: true,
    },

    refreshTokenHash: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Instance method: check if account is currently locked
userSchema.methods.isLocked = function (this: IUser): boolean {
  return !!(this.lockUntil && this.lockUntil.getTime() > Date.now());
};

export const User = mongoose.model<IUser, UserModel>('User', userSchema);
