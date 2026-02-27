'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { ArrowRight, AlertCircle, RefreshCw, Mail } from 'lucide-react';
import { useVerifyEmail } from '@/features/auth/hooks';

export function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [serverError, setServerError] = useState('');
    const [serverSuccess, setServerSuccess] = useState('');
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        if (!email) {
            router.replace('/auth/login');
        }
    }, [email, router]);

    const { mutate: verifyEmail, isPending } = useVerifyEmail();

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        pastedData.split('').forEach((char, i) => { newOtp[i] = char; });
        setOtp(newOtp);
        const nextEmpty = newOtp.findIndex((v) => !v);
        inputRefs.current[nextEmpty >= 0 ? nextEmpty : 5]?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const token = otp.join('');
        if (token.length < 6) {
            setServerError('Please enter the complete 6-digit code.');
            return;
        }

        setServerError('');
        verifyEmail(token, {
            onSuccess: () => {
                router.push('/superadmin/dashboard');
            },
            onError: (error: unknown) => {
                const axiosError = error as { response?: { data?: { message?: string } } };
                setServerError(
                    axiosError?.response?.data?.message || 'Verification failed. Please try again.'
                );
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">P</span>
                    </div>
                    <span className="font-bold text-gray-900">PSP Gateway</span>
                </div>
                <p className="text-sm text-gray-500">Support: help@pspgateway.com</p>
            </header>

            <main className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-md auth-card">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                            <Mail className="w-7 h-7 text-brand-600" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Verify your email</h1>
                    <p className="text-sm text-gray-500 text-center mb-2">
                        We&apos;ve sent a 6-digit verification code to
                    </p>
                    <p className="text-sm font-semibold text-gray-800 text-center mb-8">
                        {email || 'your registered email address'}
                    </p>

                    {serverError && (
                        <div className="mb-5 flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{serverError}</span>
                        </div>
                    )}

                    {serverSuccess && (
                        <div className="mb-5 flex items-start gap-3 p-3.5 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                            <span>{serverSuccess}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => { inputRefs.current[i] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    className="w-12 h-14 text-center text-xl font-bold text-gray-900
                             border border-gray-200 rounded-xl bg-white
                             focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent
                             transition-all duration-200"
                                />
                            ))}
                        </div>

                        <button type="submit" disabled={isPending} className="btn-primary">
                            {isPending ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Verifying...
                                </>
                            ) : (
                                <>Verify Email <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-500">
                        Didn&apos;t receive the email?{' '}
                        <button
                            type="button"
                            onClick={() => setServerSuccess('A new code has been sent to your email.')}
                            className="text-brand-600 font-semibold hover:text-brand-700 transition-colors inline-flex items-center gap-1"
                        >
                            <RefreshCw className="w-3.5 h-3.5" /> Resend Code
                        </button>
                    </p>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-6 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                        <span>✦ Secure</span>
                        <span>✦ PCI DSS</span>
                        <span>✦ Encrypted</span>
                    </div>
                </div>

                <p className="absolute bottom-8 text-sm text-gray-500">
                    <Link href="/auth/login" className="text-gray-500 hover:text-brand-600 transition-colors">
                        ← Back to login
                    </Link>
                </p>
            </main>
        </div>
    );
}
