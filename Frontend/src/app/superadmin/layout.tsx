'use client';

import { useAuth } from '@/features/auth/hooks';
import { SuperAdminSidebar } from '@/components/superadmin/SuperAdminSidebar';
import { SuperAdminHeader } from '@/components/superadmin/SuperAdminHeader';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#138aec]"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#f6f7f8]">
            <SuperAdminSidebar />

            <main className="flex-1 ml-64 flex flex-col overflow-hidden relative">
                <SuperAdminHeader />

                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

