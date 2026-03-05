import apiClient from '@/lib/axios';

export interface GatewayRequestConfigHeaders {
  static?: Record<string, string>;
  mapped?: Record<string, string>;
}

export interface GatewayRequestConfigBodyMapping {
  [key: string]: string;
}

export interface GatewayRequestConfigResponseMapping {
  [key: string]: string;
}

export interface GatewayRequestConfig {
  _id: string;
  gatewayId: string;
  type: string;
  headers: GatewayRequestConfigHeaders;
  bodyMapping: GatewayRequestConfigBodyMapping;
  responseMapping?: GatewayRequestConfigResponseMapping;
  endpoint?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateConfigPayload {
  type: string;
  headers?: GatewayRequestConfigHeaders;
  bodyMapping?: GatewayRequestConfigBodyMapping;
  responseMapping?: GatewayRequestConfigResponseMapping;
  endpoint?: string;
}

export type UpdateConfigPayload = Partial<
  Pick<CreateConfigPayload, 'headers' | 'bodyMapping' | 'responseMapping' | 'endpoint'>
>;

export const gatewayRequestConfigApi = {
  list: async (gatewayId: string): Promise<{ success: boolean; data: GatewayRequestConfig[] }> => {
    const response = await apiClient.get<{ success: boolean; data: GatewayRequestConfig[] }>(
      `/admin/gateways/${gatewayId}/configs`
    );
    return response.data;
  },

  getByType: async (
    gatewayId: string,
    type: string
  ): Promise<{ success: boolean; data: GatewayRequestConfig | null }> => {
    const response = await apiClient.get<{ success: boolean; data: GatewayRequestConfig }>(
      `/admin/gateways/${gatewayId}/configs/${encodeURIComponent(type)}`
    );
    return response.data;
  },

  create: async (
    gatewayId: string,
    payload: CreateConfigPayload
  ): Promise<{ success: boolean; data: GatewayRequestConfig }> => {
    const response = await apiClient.post<{ success: boolean; data: GatewayRequestConfig }>(
      `/admin/gateways/${gatewayId}/configs`,
      payload
    );
    return response.data;
  },

  update: async (
    gatewayId: string,
    type: string,
    payload: UpdateConfigPayload
  ): Promise<{ success: boolean; data: GatewayRequestConfig }> => {
    const response = await apiClient.patch<{ success: boolean; data: GatewayRequestConfig }>(
      `/admin/gateways/${gatewayId}/configs/${encodeURIComponent(type)}`,
      payload
    );
    return response.data;
  },
};
