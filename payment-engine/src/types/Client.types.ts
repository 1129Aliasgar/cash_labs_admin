import { Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  clientId: string;
  clientSecret: string;
  createdAt?: Date;
  updatedAt?: Date;
}
