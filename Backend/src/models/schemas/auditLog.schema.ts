import { Schema, model } from 'mongoose';
import { AuditAction } from '../../constants/user.constants';

export interface IAuditLog {
  userId?: string;
  action: string;
  ip: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: String, index: true },
    action: {
      type: String,
      required: true,
      enum: Object.values(AuditAction),
    },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

auditLogSchema.index({ userId: 1, createdAt: -1 });

export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema);
export default auditLogSchema;
