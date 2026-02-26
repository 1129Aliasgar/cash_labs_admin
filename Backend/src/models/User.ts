import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  companyName: string;
  telegramId?: string;

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
