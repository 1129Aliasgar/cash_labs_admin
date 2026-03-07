'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, Suspense } from 'react';
import { AlertCircle, RefreshCw, Mail, ShieldCheck, ExternalLink, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { useVerifyEmail } from '@/features/auth/hooks';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const [serverError, setServerError] = useState('');
    const [serverSuccess, setServerSuccess] = useState('');
    const [isResending, setIsResending] = useState(false);
    const hasAttempted = useRef(false);

    const { mutate: verify, isPending: isVerifying, isSuccess: verifiedSuccessfully } = useVerifyEmail();

    // Handle Token Verification
    useEffect(() => {
        if (token && !hasAttempted.current) {
            hasAttempted.current = true;
            verify(token, {
                onError: (err: any) => {
                    const message = err?.response?.data?.message || 'Verification failed. The link may be expired or invalid.';
                    setServerError(message);
                }
            });
        }
    }, [token, verify]);

    // Enforce context if neither token nor email is present
    useEffect(() => {
        if (!email && !token) {
            router.replace('/auth/login');
        }
    }, [email, token, router]);

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

    // ─── Verification States ───────────────────────────────────────────

    // 1. Loading/Verifying State
    if (token && isVerifying) {
        return (
            <div className="w-full max-w-md auth-card text-center animate-in fade-in duration-500">
                <div className="flex justify-center mb-8">
                    <Logo />
                </div>
                <div className="space-y-4">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Verifying Identity</h1>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">Securing your account access with CashLabs... Just a moment.</p>
                    <div className="flex justify-center py-8">
                        <div className="relative">
                            <div className="absolute inset-0 size-16 bg-[#138aec]/10 rounded-full animate-ping"></div>
                            <div className="relative size-16 bg-white border-4 border-[#138aec]/20 border-t-[#138aec] rounded-full animate-spin"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Success State (after token verification)
    if (token && verifiedSuccessfully) {
        return (
            <div className="w-full max-w-md auth-card text-center animate-in zoom-in-95 duration-500">
                <div className="mb-8 relative flex justify-center">
                    <div className="absolute inset-0 bg-green-100 rounded-full scale-125 blur-xl opacity-40" />
                    <div className="relative h-20 w-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-500/20">
                        <CheckCircle2 className="w-10 h-10 stroke-[2.5px]" />
                    </div>
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Account Verified!</h1>
                <p className="text-gray-500 mb-10 leading-relaxed font-medium px-4">
                    Your identity has been successfully confirmed. Your account is now active and ready for setup.
                </p>
                <Link
                    href="/auth/registration-success"
                    className="btn-primary w-full group shadow-xl shadow-[#138aec]/20"
                >
                    Proceed to Setup
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        );
    }

    // 3. Error / Manual Verification State (Check Inbox)
    return (
        <div className="w-full max-w-md auth-card animate-in fade-in duration-500">
            {/* Icon */}
            <div className="flex justify-center mb-8">
                <div className="relative">
                    <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center">
                        <Mail className="w-9 h-9 text-brand-600" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full">
                        <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                            <ShieldCheck className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            <h1 className="text-2xl font-black text-gray-900 text-center mb-3 tracking-tight">
                {serverError && !token ? 'Verification Error' : 'Check your inbox'}
            </h1>
            <p className="text-sm text-gray-500 text-center px-6 leading-relaxed font-medium">
                {serverError
                    ? serverError
                    : `We've sent a secure activation link to your registered email address:`
                }
            </p>

            {!serverError && (
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-700 text-center  tracking-wider">
                        {email || 'your@email.com'}
                    </p>
                </div>
            )}

            <div className="mt-8 space-y-4">
                {serverSuccess && (
                    <div className="flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
                        <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{serverSuccess}</span>
                    </div>
                )}

                {serverError && (
                    <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{serverError}</span>
                    </div>
                )}

                <div className="bg-slate-50 p-5 rounded-[24px] border border-dashed border-slate-200 text-center">
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">
                        Click the link in the email to activate your account.
                        The link expires in <span className="text-[#138aec]">24 hours</span>.
                    </p>
                </div>

                {!token && (
                    <button
                        onClick={() => window.open(`mailto:${email}`)}
                        className="btn-primary w-full py-3.5 group shadow-lg shadow-[#138aec]/10"
                    >
                        Open Email App <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                )}

                <div className="flex justify-center pt-4">
                    <button
                        type="button"
                        disabled={isResending}
                        onClick={handleResend}
                        className="text-sm font-black text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-2 uppercase tracking-widest"
                    >
                        <RefreshCw className={isResending ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
                        {isResending ? 'Resending Link...' : 'Resend activation link'}
                    </button>
                </div>
            </div>

            {/* Security badges */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center gap-8 text-[10px] font-black text-gray-400 grayscale opacity-40">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> SECURE</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> CRYPTO</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> VERIFIED</span>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white">
                <div className="flex items-center gap-2">
                    <Logo className="w-32 h-8" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Security Layer Active</p>
            </header>

            <main className="flex flex-1 items-center justify-center px-4 py-12 relative overflow-hidden">
                <Suspense fallback={
                    <div className="auth-card flex flex-col items-center justify-center p-12">
                        <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
                    </div>
                }>
                    <VerifyEmailContent />
                </Suspense>

                {/* Footer Link */}
                <p className="absolute bottom-8 text-sm font-bold text-gray-400 flex items-center gap-1.5 hover:text-gray-600 transition-colors">
                    <Link href="/auth/login" className="flex items-center gap-2 uppercase tracking-widest">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Back to login
                    </Link>
                </p>
            </main>
        </div>
    );
}
