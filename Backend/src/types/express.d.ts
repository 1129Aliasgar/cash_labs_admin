import { UserRole } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      userId: string;
      role: UserRole;
    }
  }
}

export {};
