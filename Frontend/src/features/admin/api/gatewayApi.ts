import apiClient from '@/lib/axios';

export interface GatewayCapability {
  enabled: boolean;
  configured: boolean;
}

export interface Gateway {
  _id: string;
  logo?: string;
  name: string;
  type: string;
  refund: GatewayCapability;
  payment: GatewayCapability;
  apm: GatewayCapability;
  authorization: GatewayCapability;
  subscription: GatewayCapability;
  token: GatewayCapability;
  payout: GatewayCapability;
  payin: GatewayCapability;
  cardTypes?: string[];
  endpoint?: string;
  apiKey?: string;
  apiSecret?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListGatewaysParams {
  page?: number;
  limit?: number;
  type?: string;
  name?: string;
}

export interface ListGatewaysResponse {
  success: boolean;
  data: Gateway[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

export interface CreateGatewayPayload {
  name: string;
  type: string;
  logo?: string;
  endpoint?: string;
  apiKey?: string;
  apiSecret?: string;
  refund?: GatewayCapability;
  payment?: GatewayCapability;
  apm?: GatewayCapability;
  authorization?: GatewayCapability;
  subscription?: GatewayCapability;
  token?: GatewayCapability;
  payout?: GatewayCapability;
  payin?: GatewayCapability;
  cardTypes?: string[];
}

export type UpdateGatewayPayload = Partial<CreateGatewayPayload>;

export const gatewayApi = {
  list: async (params: ListGatewaysParams = {}): Promise<ListGatewaysResponse> => {
    const sp = new URLSearchParams();
    if (params.page != null) sp.set('page', String(params.page));
    if (params.limit != null) sp.set('limit', String(params.limit));
    if (params.type) sp.set('type', params.type);
    if (params.name) sp.set('name', params.name);
    const response = await apiClient.get<ListGatewaysResponse>(`/admin/gateways?${sp.toString()}`);
    return response.data;
  },

  create: async (payload: CreateGatewayPayload): Promise<{ success: boolean; data: Gateway }> => {
    const response = await apiClient.post<{ success: boolean; data: Gateway }>('/admin/gateways', payload);
    return response.data;
  },

  update: async (id: string, payload: UpdateGatewayPayload): Promise<{ success: boolean; data: Gateway }> => {
    const response = await apiClient.patch<{ success: boolean; data: Gateway }>(`/admin/gateways/${id}`, payload);
    return response.data;
  },
};
