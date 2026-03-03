'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { userApi, type CreateUserRequest } from '../api/userApi';
import {
  gatewayApi,
  type ListGatewaysParams,
  type CreateGatewayPayload,
  type UpdateGatewayPayload,
} from '../api/gatewayApi';
import {
  gatewayRequestConfigApi,
  type CreateConfigPayload,
  type UpdateConfigPayload,
} from '../api/gatewayRequestConfigApi';
import {
  clientApi,
  type ListClientsParams,
  type CreateClientPayload,
  type UpdateClientPayload,
} from '../api/clientApi';
import {
  clientGatewayApi,
  type ListClientGatewaysParams,
  type CreateClientGatewayPayload,
  type UpdateClientGatewayPayload,
} from '../api/clientGatewayApi';

export const ADMIN_QUERY_KEYS = {
  pendingMerchants: ['admin', 'merchants', 'pending'] as const,
  allMerchants: ['admin', 'merchants', 'all'] as const,
  allUsers: ['admin', 'users', 'all'] as const,
  gateways: ['admin', 'gateways'] as const,
  gatewayConfigs: (gatewayId: string) => ['admin', 'gateways', gatewayId, 'configs'] as const,
  clients: ['admin', 'clients'] as const,
  clientGateways: ['admin', 'client-gateways'] as const,
};

/**
 * usePendingMerchants — Get list of unapproved merchants
 */
export function usePendingMerchants() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.pendingMerchants,
    queryFn: () => adminApi.getPendingMerchants(),
    staleTime: 1000 * 60 * 2, // 2 min
  });
}

/**
 * useAllMerchants — Get list of all merchants
 */
export function useAllMerchants() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.allMerchants,
    queryFn: () => adminApi.getAllMerchants(),
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

/**
 * useApproveMerchant — Mark a merchant as APPROVED
 */
export function useApproveMerchant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (merchantId: string) => adminApi.approveMerchant(merchantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.pendingMerchants });
    },
  });
}

/**
 * useRejectMerchant — Mark a merchant as REJECTED
 */
export function useRejectMerchant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (merchantId: string) => adminApi.rejectMerchant(merchantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.pendingMerchants });
    },
  });
}
/**
 * useUsers — Get a list of all system users
 */
export function useUsers() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.allUsers,
    queryFn: () => userApi.getAllUsers(),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * useCreateUser — Admin-driven user creation
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserRequest) => userApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.allUsers });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.allMerchants });
    },
  });
}

/**
 * useGateways — List gateways with filters and pagination
 */
export function useGateways(params: ListGatewaysParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEYS.gateways, params],
    queryFn: () => gatewayApi.list(params),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * useCreateGateway — Create a new gateway
 */
export function useCreateGateway() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGatewayPayload) => gatewayApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.gateways });
    },
  });
}

/**
 * useUpdateGateway — Update a gateway by id
 */
export function useUpdateGateway() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGatewayPayload }) =>
      gatewayApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.gateways });
    },
  });
}

/**
 * useGatewayConfigs — List request configs for a gateway
 */
export function useGatewayConfigs(gatewayId: string | null) {
  return useQuery({
    queryKey: gatewayId ? ADMIN_QUERY_KEYS.gatewayConfigs(gatewayId) : ['admin', 'gateways', 'configs', 'skip'],
    queryFn: () => gatewayRequestConfigApi.list(gatewayId!),
    enabled: !!gatewayId,
    staleTime: 1000 * 60,
  });
}

/**
 * useCreateGatewayConfig — Create a request config for a gateway
 */
export function useCreateGatewayConfig(gatewayId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateConfigPayload) => gatewayRequestConfigApi.create(gatewayId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.gatewayConfigs(gatewayId) });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.gateways });
    },
  });
}

/**
 * useUpdateGatewayConfig — Update a request config by type
 */
export function useUpdateGatewayConfig(gatewayId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ type, data }: { type: string; data: UpdateConfigPayload }) =>
      gatewayRequestConfigApi.update(gatewayId, type, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.gatewayConfigs(gatewayId) });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.gateways });
    },
  });
}

// ─── Clients ─────────────────────────────────────────────────────────────────

export function useClients(params: ListClientsParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEYS.clients, params],
    queryFn: () => clientApi.list(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateClientPayload) => clientApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.clients });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientPayload }) =>
      clientApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.clients });
    },
  });
}

// ─── Client Gateways ─────────────────────────────────────────────────────────

export function useClientGateways(params: ListClientGatewaysParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEYS.clientGateways, params],
    queryFn: () => clientGatewayApi.list(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateClientGateway() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateClientGatewayPayload) => clientGatewayApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.clientGateways });
    },
  });
}

export function useUpdateClientGateway() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientGatewayPayload }) =>
      clientGatewayApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.clientGateways });
    },
  });
}
