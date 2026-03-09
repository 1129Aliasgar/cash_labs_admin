import apiClient from '@/lib/axios';

export interface Transaction {
  id: string;
  date: string;
  time: string;
  amount: string;
  method: string;
  icon: string;
  status: 'Approved' | 'Processing' | 'Declined' | 'Refunded';
  customerName?: string;
  customerEmail?: string;
  gateway?: string;
  processor?: string;
}

export const transactionApi = {
  list: async (params: any = {}): Promise<{ success: boolean; data: Transaction[] }> => {
    const response = await apiClient.get<{ success: boolean; data: Transaction[] }>('/admin/transactions', { params });
    return response.data;
  },

  getById: async (id: string): Promise<{ success: boolean; data: Transaction }> => {
    const response = await apiClient.get<{ success: boolean; data: Transaction }>(`/admin/transactions/${id}`);
    return response.data;
  },

  refund: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{ success: boolean; message: string }>(`/admin/transactions/${id}/refund`);
    return response.data;
  }
};
