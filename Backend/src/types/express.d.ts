// Extend Express Request to carry userId after authentication middleware
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {};
