'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useForgotPassword } from '@/features/auth/hooks';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/features/auth/schemas';

export default function ForgotPasswordPage() {
    const [serverError, setServerError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const { mutate: forgotPassword, isPending } = useForgotPassword();

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = (data: ForgotPasswordFormData) => {
        setServerError('');
        forgotPassword(data.email, {
            onSuccess: () => setSubmitted(true),
            onError: (error: unknown) => {
                const axiosError = error as { response?: { data?: { message?: string } } };
                // Security: return success even on unknown email to prevent enumeration
                setSubmitted(true);
                void axiosError;
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-md auth-card">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">P</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">PSPManager</span>
                    </div>
                </div>

                {!submitted ? (
                    <>
                        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Forgot Password?</h1>
                        <p className="text-sm text-gray-500 text-center mb-8">
                            Enter your email address and we will send you a link to reset your password.
                        </p>

                        {serverError && (
                            <div className="mb-5 flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{serverError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        {...register('email')}
                                        type="email"
                                        placeholder="e.g. name@company.com"
                                        autoComplete="email"
                                        className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <button type="submit" disabled={isPending} className="btn-primary">
                                {isPending ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Sending...
                                    </>
                                ) : (
                                    <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    /* Email sent confirmation */
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h2>
                        <p className="text-sm text-gray-500 mb-1">
                            If <span className="font-semibold text-gray-700">{getValues('email')}</span> is registered,
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            you&apos;ll receive a password reset link shortly.
                        </p>
                        <p className="text-xs text-gray-400">Didn&apos;t receive it? Check your spam folder.</p>
                    </div>
                )}

                {/* Security badges */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-6">
                    <span className="security-badge text-green-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Secure
                    </span>
                    <span className="security-badge text-blue-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> PCI DSS
                    </span>
                    <span className="security-badge text-orange-500">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Encrypted
                    </span>
                </div>
            </div>

            <p className="mt-5 text-sm text-center">
                <Link
                    href="/auth/login"
                    className="text-brand-600 font-semibold hover:text-brand-700 transition-colors"
                >
                    ‹ Back to Sign In
                </Link>
            </p>

            {/* Footer */}
            <footer className="mt-8 flex gap-4 text-xs text-gray-400">
                <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
                <Link href="/support" className="hover:text-gray-600 transition-colors">Contact Support</Link>
            </footer>
        </div>
    );
}
