import apiClient from '@/lib/axios';
import type { AuthUser } from '../../auth/types';

export interface AdminResponse {
  success: boolean;
  message: string;
}

export const adminApi = {
  /**
   * Get list of merchants awaiting approval
   */
  getPendingMerchants: async (): Promise<{ success: boolean; data: AuthUser[] }> => {
    const response = await apiClient.get<{ success: boolean; data: AuthUser[] }>('/admin/merchants/pending');
    return response.data;
  },

  /**
   * Get list of all merchants (all statuses)
   */
  getAllMerchants: async (): Promise<{ success: boolean; data: AuthUser[] }> => {
    const response = await apiClient.get<{ success: boolean; data: AuthUser[] }>('/admin/merchants');
    return response.data;
  },

  /**
   * Approve a merchant account
   */
  approveMerchant: async (merchantId: string): Promise<AdminResponse> => {
    const response = await apiClient.patch<AdminResponse>(`/admin/merchant/${merchantId}/approve`);
    return response.data;
  },

  /**
   * Reject a merchant account
   */
  rejectMerchant: async (merchantId: string): Promise<AdminResponse> => {
    const response = await apiClient.patch<AdminResponse>(`/admin/merchant/${merchantId}/reject`);
    return response.data;
  },
};
