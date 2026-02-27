'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks';

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && user) {
            if (user.role !== 'MERCHANT') {
                router.push('/dashboard');
                return;
            }

            // If merchant but not approved, redirect to pending screen
            if (user.merchantStatus !== 'APPROVED' && pathname !== '/merchant/application-pending') {
                router.push('/merchant/application-pending');
            }

            // If approved, don't allow access to pending screen
            if (user.merchantStatus === 'APPROVED' && pathname === '/merchant/application-pending') {
                router.push('/merchant/dashboard');
            }
        }
    }, [user, isLoading, pathname, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return <>{children}</>;
}
