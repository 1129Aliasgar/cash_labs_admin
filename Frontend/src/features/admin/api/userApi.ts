import apiClient from '@/lib/axios';
import type { AuthUser } from '../../auth/types';

export interface CreateUserRequest {
  email: string;
  fullName: string;
  role: string;
  password?: string;
  companyName?: string;
}

export const userApi = {
  /**
   * Get all system users
   */
  getAllUsers: async (): Promise<{ success: boolean; data: AuthUser[] }> => {
    const response = await apiClient.get<{ success: boolean; data: AuthUser[] }>('/users');
    return response.data;
  },

  /**
   * Create a new internal or merchant user
   */
  createUser: async (data: CreateUserRequest): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{ success: boolean; message: string }>('/users/create', data);
    return response.data;
  }
};
