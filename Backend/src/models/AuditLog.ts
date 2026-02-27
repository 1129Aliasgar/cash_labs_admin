import mongoose, { Document, Schema } from 'mongoose';

export enum AuditAction {
  SIGNUP = 'SIGNUP',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  TOKEN_REFRESHED = 'TOKEN_REFRESHED',
  TOKEN_REUSE_DETECTED = 'TOKEN_REUSE_DETECTED',
  MERCHANT_APPROVED = 'MERCHANT_APPROVED',
  MERCHANT_REJECTED = 'MERCHANT_REJECTED',
  USER_CREATED = 'USER_CREATED',
  USER_DELETED = 'USER_DELETED',
  LOGOUT = 'LOGOUT',
}

export interface IAuditLog extends Document {
  userId?: string;
  action: AuditAction;
  ip: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: String,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'SIGNUP',
        'EMAIL_VERIFIED',
        'LOGIN_SUCCESS',
        'LOGIN_FAILED',
        'ACCOUNT_LOCKED',
        'TOKEN_REFRESHED',
        'TOKEN_REUSE_DETECTED',
        'MERCHANT_APPROVED',
        'MERCHANT_REJECTED',
        'LOGOUT',
      ],
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

// Compound index for efficient per-user audit trail queries
auditLogSchema.index({ userId: 1, createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
