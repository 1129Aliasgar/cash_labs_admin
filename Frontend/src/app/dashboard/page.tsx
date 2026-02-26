'use client';

import { useRouter } from 'next/navigation';
import { useAuth, useLogout } from '@/features/auth/hooks';
import { LogOut, User, Shield } from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const { data: user, isLoading } = useAuth();
    const { mutate: logout, isPending } = useLogout();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center gap-3 text-gray-500">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Loading dashboard...
                </div>
            </div>
        );
    }

    if (!user) {
        router.push('/auth/login');
        return null;
    }

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => router.push('/auth/login'),
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xs">P</span>
                        </div>
                        <span className="font-bold text-gray-900">PSPManager</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {user.fullName}
                        </div>
                        <button
                            onClick={handleLogout}
                            disabled={isPending}
                            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            {isPending ? 'Logging out...' : 'Logout'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="auth-card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Welcome back, {user.fullName}!</h1>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-700">
                        ✅ Authentication system is working correctly. You are securely authenticated with HTTP-only JWT cookies.
                    </div>
                </div>
            </main>
        </div>
    );
}
