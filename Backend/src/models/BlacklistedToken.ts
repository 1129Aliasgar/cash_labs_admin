import mongoose, { Document, Schema } from 'mongoose';

export interface IBlacklistedToken extends Document {
  tokenHash: string;
  expiresAt: Date;
}

const blacklistedTokenSchema = new Schema<IBlacklistedToken>(
  {
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // TTL index: MongoDB automatically deletes documents when expiresAt passes.
    // This means the blacklist is self-cleaning — no cron job needed.
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    versionKey: false,
  }
);

export const BlacklistedToken = mongoose.model<IBlacklistedToken>(
  'BlacklistedToken',
  blacklistedTokenSchema
);
