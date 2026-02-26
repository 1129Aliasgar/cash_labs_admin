'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import type { LoginCredentials, SignupData } from '../types';

export const AUTH_QUERY_KEY = ['auth', 'me'] as const;

/**
 * useAuth — current authenticated user state.
 * On 401, query returns null (user not logged in).
 */
export function useAuth() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        const result = await authApi.getMe();
        return result.user;
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,  // 5 min
    retry: false,
  });
}

/**
 * useLogin — authenticate with email + password
 */
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: async (data) => {
      // Populate auth cache immediately with user from response
      if (data.user) {
        queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      }
    },
  });
}

/**
 * useSignup — register a new merchant account
 */
export function useSignup() {
  return useMutation({
    mutationFn: (data: SignupData) => authApi.signup(data),
  });
}

/**
 * useLogout — revoke tokens and clear auth state
 */
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      // Clear auth state from cache even if the logout request fails
      // (network error—cookies will expire eventually)
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
    },
  });
}

/**
 * useVerifyEmail — verify email with token
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
  });
}

/**
 * useForgotPassword — request password reset email
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}
