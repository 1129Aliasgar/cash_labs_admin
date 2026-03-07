import apiClient from '@/lib/axios';

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  totalTransactions: number;
  totalSpent: string;
  status: 'Active' | 'Inactive' | 'Blocked';
  lastTransactionDate: string;
  createdAt: string;
}

export const customerApi = {
  list: async (params: any = {}): Promise<{ success: boolean; data: Customer[] }> => {
    const response = await apiClient.get<{ success: boolean; data: Customer[] }>('/admin/customers', { params });
    return response.data;
  },

  getById: async (id: string): Promise<{ success: boolean; data: Customer }> => {
    const response = await apiClient.get<{ success: boolean; data: Customer }>(`/admin/customers/${id}`);
    return response.data;
  }
};
