import { Schema, model } from 'mongoose';

export interface IBlacklistedToken {
  tokenHash: string;
  expiresAt: Date;
}

const blacklistedTokenSchema = new Schema<IBlacklistedToken>(
  {
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
  },
  { versionKey: false }
);

export const BlacklistedToken = model<IBlacklistedToken>(
  'BlacklistedToken',
  blacklistedTokenSchema
);
export default blacklistedTokenSchema;
