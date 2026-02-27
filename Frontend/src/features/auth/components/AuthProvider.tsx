'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../hooks';
import { getRedirectPath } from '../utils/redirection';

interface AuthProviderProps {
    children: React.ReactNode;
}

/**
 * AuthProvider — Root Auth Gate & Navigation Controller.
 * 
 * CENTRALIZED REDIRECTION: This is the ONLY component allowed to perform
 * auth-related routing (router.replace).
 */
export function AuthProvider({ children }: AuthProviderProps) {
    const { data: user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const isRedirecting = useRef(false);

    const isAuthRoute = pathname.startsWith('/auth');
    const isPublicRoute = isAuthRoute || pathname === '/' || pathname === '/favicon.ico';

    useEffect(() => {
        if (isLoading) return;

        // Reset guard on every state cycle
        isRedirecting.current = false;

        const handleRedirection = () => {
            // 1. Unauthenticated users on protected routes
            if (!user) {
                if (!isPublicRoute) {
                    if (!isRedirecting.current) {
                        isRedirecting.current = true;
                        router.replace('/auth/login');
                    }
                }
                return;
            }

            // 2. Authenticated users
            const role = user.role;
            const status = user.merchantStatus;
            let targetRoute = '/superadmin/dashboard';

            if (role === 'MERCHANT') {
                if (status === 'ACTIVE') {
                    targetRoute = '/merchant/onboarding';
                } else if (status === 'PENDING') {
                    targetRoute = '/merchant/application-pending';
                } else {
                    targetRoute = '/superadmin/dashboard';
                }
            }

            // Execute Redirection
            if (pathname !== targetRoute) {
                // Special case: Allow sub-paths (e.g. nested dashboard pages or onboarding steps)
                if (pathname.startsWith(targetRoute) && pathname !== '/' && targetRoute !== '/') {
                    return;
                }

                // Block authenticated users from auth pages (login/signup)
                if (isAuthRoute || !pathname.startsWith(targetRoute) || (targetRoute === '/superadmin/dashboard' && pathname === '/dashboard')) {
                    if (!isRedirecting.current) {
                        isRedirecting.current = true;
                        router.replace(targetRoute);
                    }
                }
            }
        };

        handleRedirection();

    }, [user, isLoading, pathname, router, isPublicRoute, isAuthRoute]);

    // Hydration Gate: Show nothing while session is being confirmed
    if (isLoading && !isPublicRoute) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
}
