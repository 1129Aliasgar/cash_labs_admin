'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5,    // 5 minutes — auth state doesn't change often
                        retry: (failureCount, error: unknown) => {
                            // Don't retry 401/403/404 — these are expected error states
                            const axiosError = error as { response?: { status: number } };
                            if ([401, 403, 404].includes(axiosError?.response?.status ?? 0)) {
                                return false;
                            }
                            return failureCount < 2;
                        },
                    },
                    mutations: {
                        retry: false, // Never auto-retry mutations (payment/auth mutations must be explicit)
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}
