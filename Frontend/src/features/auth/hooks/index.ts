import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '../api/authApi';
import { getRedirectPath } from '../utils/redirection';
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
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    retry: false,
    onSuccess: async () => {
      // 1. Force refresh user state from server to ensure fresh profile/status
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      await queryClient.refetchQueries({ queryKey: AUTH_QUERY_KEY });
      
      // REDIRECTION REMOVED: Delegated to central AuthProvider/Gate
    },
    onError: () => {
      // REDIRECTION REMOVED: Reverted to showing raw 403 error on LoginPage
    },
  });
}

/**
 * useSignup — register a new merchant account
 */
export function useSignup() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignupData) => authApi.signup(data),
    onSuccess: async (_, variables) => {
      // Funnel user to verification immediately after signup
      router.push(`/auth/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: (data) => {
      // Establish session state immediately
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
    }
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
