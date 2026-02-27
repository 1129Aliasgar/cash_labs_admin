'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { userApi, type CreateUserRequest } from '../api/userApi';

export const ADMIN_QUERY_KEYS = {
  pendingMerchants: ['admin', 'merchants', 'pending'] as const,
  allMerchants: ['admin', 'merchants', 'all'] as const,
  allUsers: ['admin', 'users', 'all'] as const,
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
