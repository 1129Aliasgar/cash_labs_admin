'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowRight, AlertCircle, RefreshCw, Mail, ShieldCheck, ExternalLink } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

import { Suspense } from 'react';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const [serverError, setServerError] = useState('');
    const [serverSuccess, setServerSuccess] = useState('');
    const [isResending, setIsResending] = useState(false);

    // Enforce email context
    useEffect(() => {
        if (!email) {
            router.replace('/auth/login');
        }
    }, [email, router]);

    const handleResend = async () => {
        setIsResending(true);
        setServerError('');
        setServerSuccess('');

        try {
            // Placeholder: In real app, call resend API
            await new Promise(resolve => setTimeout(resolve, 1000));
            setServerSuccess('A new verification link has been sent to your email.');
        } catch (err) {
            setServerError('Failed to resend email. Please try again later.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white">
                <div className="flex items-center gap-2">
                    <Logo className="w-32 h-8" />
                </div>
                <p className="text-sm text-gray-500">System Security: Level 1</p>
            </header>

            <main className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-md auth-card">
                    {/* Icon */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center animate-pulse">
                                <Mail className="w-9 h-9 text-brand-600" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full">
                                <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                                    <ShieldCheck className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">Check your inbox</h1>
                    <p className="text-sm text-gray-500 text-center px-6 leading-relaxed">
                        We&apos;ve sent a secure activation link to your registered email address:
                    </p>
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-700 text-center uppercase tracking-wider">
                            {email || 'your@email.com'}
                        </p>
                    </div>

                    <div className="mt-8 space-y-4">
                        {serverError && (
                            <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{serverError}</span>
                            </div>
                        )}

                        {serverSuccess && (
                            <div className="flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
                                <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{serverSuccess}</span>
                            </div>
                        )}

                        <div className="bg-slate-50 p-5 rounded-[24px] border border-dashed border-slate-200 text-center">
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                Click the link in the email to activate your account.
                                The link expires in <span className="font-bold text-slate-700">24 hours</span>.
                            </p>
                        </div>

                        <button
                            onClick={() => window.open(`mailto:${email}`)}
                            className="btn-primary w-full py-3.5 group"
                        >
                            Open Email App <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        <div className="flex justify-center pt-4">
                            <button
                                type="button"
                                disabled={isResending}
                                onClick={handleResend}
                                className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-2"
                            >
                                <RefreshCw className={isResending ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
                                {isResending ? 'Resending Link...' : 'Resend activation link'}
                            </button>
                        </div>
                    </div>

                    {/* Security badges */}
                    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center gap-8 text-[10px] font-black text-gray-400 grayscale opacity-60">
                        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> SECURE</span>
                        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> CRYPTO</span>
                        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> VERIFIED</span>
                    </div>
                </div>

                <p className="absolute bottom-8 text-sm text-gray-500 flex items-center gap-1.5">
                    <Link href="/auth/login" className="font-semibold text-gray-500 hover:text-brand-600 transition-colors">
                        ← Back to login
                    </Link>
                </p>
            </main>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-brand-600 animate-spin" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
