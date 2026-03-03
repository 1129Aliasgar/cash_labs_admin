import apiClient from '@/lib/axios';

export interface ClientGatewayPopulated {
  _id: string;
  clientId: { _id: string; name?: string; clientId?: string } | string;
  gatewayId: { _id: string; name?: string; type?: string } | string;
  credentials?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListClientGatewaysParams {
  page?: number;
  limit?: number;
  clientId?: string;
  gatewayId?: string;
}

export interface ListClientGatewaysResponse {
  success: boolean;
  data: ClientGatewayPopulated[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

export interface CreateClientGatewayPayload {
  clientId: string;
  gatewayId: string;
  credentials?: Record<string, unknown>;
}

export type UpdateClientGatewayPayload = Partial<Pick<ClientGatewayPopulated, 'credentials'>>;

export const clientGatewayApi = {
  list: async (params: ListClientGatewaysParams = {}): Promise<ListClientGatewaysResponse> => {
    const sp = new URLSearchParams();
    if (params.page != null) sp.set('page', String(params.page));
    if (params.limit != null) sp.set('limit', String(params.limit));
    if (params.clientId) sp.set('clientId', params.clientId);
    if (params.gatewayId) sp.set('gatewayId', params.gatewayId);
    const response = await apiClient.get<ListClientGatewaysResponse>(
      `/admin/client-gateways?${sp.toString()}`
    );
    return response.data;
  },

  create: async (
    payload: CreateClientGatewayPayload
  ): Promise<{ success: boolean; data: ClientGatewayPopulated }> => {
    const response = await apiClient.post<{ success: boolean; data: ClientGatewayPopulated }>(
      '/admin/client-gateways',
      payload
    );
    return response.data;
  },

  update: async (
    id: string,
    payload: UpdateClientGatewayPayload
  ): Promise<{ success: boolean; data: ClientGatewayPopulated }> => {
    const response = await apiClient.patch<{ success: boolean; data: ClientGatewayPopulated }>(
      `/admin/client-gateways/${id}`,
      payload
    );
    return response.data;
  },
};
