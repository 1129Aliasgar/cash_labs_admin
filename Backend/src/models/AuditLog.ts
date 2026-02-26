import mongoose, { Document, Schema } from 'mongoose';

export type AuditAction =
  | 'SIGNUP'
  | 'EMAIL_VERIFIED'
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'ACCOUNT_LOCKED'
  | 'TOKEN_REFRESHED'
  | 'TOKEN_REUSE_DETECTED'
  | 'LOGOUT';

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
