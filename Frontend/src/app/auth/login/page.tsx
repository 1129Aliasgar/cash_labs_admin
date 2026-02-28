'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import { useLogin } from '@/features/auth/hooks';
import { loginSchema, type LoginFormData } from '@/features/auth/schemas';
import { Logo } from '@/components/common/Logo';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState('');

    const { mutate: login, isPending } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormData) => {
        setServerError('');
        login(data, {
            onSuccess: () => {
                // REDIRECTION REMOVED: Managed by root AuthProvider/Gate
            },
            onError: (error: unknown) => {
                const axiosError = error as { response?: { data?: { message?: string } } };
                setServerError(
                    axiosError?.response?.data?.message || 'Login failed. Please try again.'
                );
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="auth-card">
                    {/* Header & Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <Logo className="mb-4" />
                        <h1 className="text-xl font-bold text-gray-900">Admin Gate</h1>
                        <p className="text-sm text-gray-500 mt-1">CashLabs Multi-Gateway Network</p>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 text-center mb-6">Sign In</h2>

                    {serverError && (
                        <div className="mb-5 flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{serverError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="name@company.com"
                                    autoComplete="email"
                                    className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                    Password
                                </label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-xs text-brand-600 font-semibold hover:text-brand-700 transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className={`auth-input pr-10 ${errors.password ? 'auth-input-error' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="btn-primary mt-2 flex items-center justify-center gap-2"
                        >
                            {isPending ? 'Signing in...' : 'Sign In to Dashboard'}
                            {!isPending && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    <div className="mt-7 pt-6 border-t border-gray-100">
                        <div className="flex justify-center gap-6">
                            <span className="security-badge text-green-600 flex items-center gap-1">
                                <Shield className="w-3.5 h-3.5" /> Secure
                            </span>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-6 text-sm text-gray-600">
                    New to CashLabs?{' '}
                    <Link href="/auth/signup" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}
