'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';
import { Shield, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useVerifyEmail } from '@/features/auth/hooks';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';

function VerifyTokenContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [error, setError] = useState<string | null>(null);
    const hasAttempted = useRef(false);

    const { mutate: verify, isPending } = useVerifyEmail();

    useEffect(() => {
        if (!token) {
            setError('Verification token is missing or malformed.');
            return;
        }

        if (hasAttempted.current) return;
        hasAttempted.current = true;

        verify(token, {
            onSuccess: () => {
                // AuthGate in AuthProvider will handle redirection automatically
                // once it detects the user state in query cache
            },
            onError: (err: any) => {
                const message = err?.response?.data?.message || 'Verification failed. The link may be expired or invalid.';
                setError(message);
            }
        });
    }, [token, verify, router]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-md auth-card text-center">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Logo />
                </div>

                {isPending ? (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        <h1 className="text-2xl font-bold text-gray-900">Verifying Identity</h1>
                        <p className="text-gray-500 text-sm">Securing your account access with CashLabs...</p>
                        <div className="flex justify-center py-6">
                            <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
                        </div>
                    </div>
                ) : error ? (
                    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col items-center gap-3">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                            <h2 className="text-lg font-bold text-red-700">Verification Error</h2>
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>

                        <div className="pt-2">
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-brand-600 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Sign In
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold text-gray-900">Success!</h1>
                        <p className="text-gray-500 text-sm">Your email has been verified. Redirecting...</p>
                        <div className="flex justify-center py-6">
                            <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
                        </div>
                    </div>
                )}

                {/* Footer Security Badges */}
                <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center gap-6 opacity-40">
                    <div className="flex flex-col items-center gap-1">
                        <Shield className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Secure</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-[8px] text-white">256</div>
                        <span className="text-[10px] font-black uppercase tracking-tighter">SHA-256</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function VerifyTokenPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
            </div>
        }>
            <VerifyTokenContent />
        </Suspense>
    );
}
