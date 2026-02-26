// ─── Auth API types ───────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  companyName?: string;
  isVerified?: boolean;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  companyName: string;
  telegramId?: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
}

export interface ApiError {
  success: false;
  message: string;
}
