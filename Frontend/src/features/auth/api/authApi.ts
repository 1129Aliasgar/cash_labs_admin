import apiClient from '@/lib/axios';
import type { AuthUser, AuthResponse, LoginCredentials, SignupData } from '../types';

/**
 * Auth API layer — all calls use the pre-configured Axios instance
 * which handles withCredentials and 401 auto-refresh automatically.
 * Tokens are never stored in JS — they live in HTTP-only cookies.
 */
export const authApi = {
  /**
   * Register a new merchant account
   */
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  /**
   * Verify email with token (or OTP)
   */
  verifyEmail: async (token: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/verify-email', { token });
    return response.data;
  },

  /**
   * Sign in and receive tokens via HTTP-only cookies
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Rotate tokens — no args needed, reads refresh cookie automatically
   */
  refresh: async (): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh');
    return response.data;
  },

  /**
   * Logout and clear cookies on server
   */
  logout: async (): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/logout');
    return response.data;
  },

  /**
   * Get current user profile
   */
  getMe: async (): Promise<{ success: boolean; user: AuthUser }> => {
    const response = await apiClient.get<{ success: boolean; user: AuthUser }>('/auth/me');
    return response.data;
  },

  /**
   * Request a password reset email
   */
  forgotPassword: async (email: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/forgot-password', { email });
    return response.data;
  },
};
