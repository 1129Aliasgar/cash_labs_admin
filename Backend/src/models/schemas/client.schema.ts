import { Schema } from 'mongoose';
import { IClient } from '../../types/Client.types';

const clientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true, trim: true },
    clientId: { type: String, required: true, unique: true, index: true },
    clientSecret: { type: String, required: true, select: false },
  },
  { timestamps: true, versionKey: false }
);

clientSchema.index({ name: 1 });

export default clientSchema;
