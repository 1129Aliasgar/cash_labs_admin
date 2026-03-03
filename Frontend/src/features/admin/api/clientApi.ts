import apiClient from '@/lib/axios';

export interface Client {
  _id: string;
  name: string;
  clientId: string;
  clientSecret?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListClientsParams {
  page?: number;
  limit?: number;
  name?: string;
  clientId?: string;
}

export interface ListClientsResponse {
  success: boolean;
  data: Client[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

export interface CreateClientPayload {
  name: string;
  clientId: string;
  clientSecret: string;
}

export type UpdateClientPayload = Partial<Pick<Client, 'name' | 'clientSecret'>>;

export const clientApi = {
  list: async (params: ListClientsParams = {}): Promise<ListClientsResponse> => {
    const sp = new URLSearchParams();
    if (params.page != null) sp.set('page', String(params.page));
    if (params.limit != null) sp.set('limit', String(params.limit));
    if (params.name) sp.set('name', params.name);
    if (params.clientId) sp.set('clientId', params.clientId);
    const response = await apiClient.get<ListClientsResponse>(`/admin/clients?${sp.toString()}`);
    return response.data;
  },

  create: async (payload: CreateClientPayload): Promise<{ success: boolean; data: Client }> => {
    const response = await apiClient.post<{ success: boolean; data: Client }>('/admin/clients', payload);
    return response.data;
  },

  update: async (id: string, payload: UpdateClientPayload): Promise<{ success: boolean; data: Client }> => {
    const response = await apiClient.patch<{ success: boolean; data: Client }>(`/admin/clients/${id}`, payload);
    return response.data;
  },
};
