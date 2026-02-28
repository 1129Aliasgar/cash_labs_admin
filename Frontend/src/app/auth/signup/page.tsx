'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Eye, EyeOff, Lock, Mail, User, Building2,
    MessageSquare, ChevronDown, AlertCircle, ArrowRight, ShieldCheck
} from 'lucide-react';
import { useSignup } from '@/features/auth/hooks';
import { signupSchema, type SignupFormData } from '@/features/auth/schemas';
import { Logo } from '@/components/common/Logo';

// Password strength calculator (1–4)
function getPasswordStrength(password: string): number {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[@$!%*?&_#^()\-+]/.test(password)) score++;
    return score;
}

const strengthConfig = [
    { label: '', color: 'bg-gray-200' },
    { label: 'WEAK', color: 'bg-red-500' },
    { label: 'FAIR', color: 'bg-orange-400' },
    { label: 'GOOD', color: 'bg-yellow-400' },
    { label: 'STRONG', color: 'bg-brand-600' },
];

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState('');

    const { mutate: signup, isPending } = useSignup();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: { agreeToTerms: false },
    });

    const passwordValue = watch('password') || '';
    const strength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue]);
    const strengthInfo = strengthConfig[strength];

    const selectedRole = watch('role') || 'MERCHANT';

    const onSubmit = (data: SignupFormData) => {
        setServerError('');
        signup(data, {
            onSuccess: () => {
                // Redirection handled by hook
            },
            onError: (error: unknown) => {
                const axiosError = error as { response?: { data?: { message?: string } } };
                setServerError(
                    axiosError?.response?.data?.message || 'Account creation failed. Please try again.'
                );
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
            {/* Header & Logo */}
            <div className="text-center mb-10">
                <div className="flex justify-center mb-6">
                    <Logo />
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Partner Registration</h1>
                <p className="text-gray-500 font-medium">Join the CashLabs multi-gateway network</p>
            </div>

            {/* Card */}
            <div className="w-full max-w-2xl">
                <div className="auth-card">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold text-gray-900">Create Your {selectedRole === 'MERCHANT' ? 'Merchant' : 'Agent'} Account</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {selectedRole === 'MERCHANT'
                                ? 'Join the multi-gateway routing network today.'
                                : 'Help businesses scale with professional fintech tools.'}
                        </p>
                    </div>

                    {serverError && (
                        <div className="mb-5 flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{serverError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                            <div className="relative group">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-600 transition-colors pointer-events-none" />
                                <select
                                    {...register('role')}
                                    className="auth-input pl-10 appearance-none cursor-pointer pr-10"
                                >
                                    <option value="MERCHANT">Merchant (Default)</option>
                                    <option value="AGENT">Agent</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
                            </div>
                            {errors.role && (
                                <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>
                            )}
                        </div>

                        {/* Full Name + Telegram ID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        {...register('fullName')}
                                        type="text"
                                        placeholder="John Doe"
                                        autoComplete="name"
                                        className={`auth-input ${errors.fullName ? 'auth-input-error' : ''}`}
                                    />
                                </div>
                                {errors.fullName && (
                                    <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Telegram ID</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        {...register('telegramId')}
                                        type="text"
                                        placeholder="@username"
                                        className="auth-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email + Company Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name (Optional)</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        {...register('companyName')}
                                        type="text"
                                        placeholder="Legal Entity Name"
                                        className={`auth-input ${errors.companyName ? 'auth-input-error' : ''}`}
                                    />
                                </div>
                                {errors.companyName && (
                                    <p className="mt-1 text-xs text-red-500">{errors.companyName.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Password + strength indicator */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Create Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
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

                            {/* Strength bars */}
                            {passwordValue && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${strength >= level ? strengthInfo.color : 'bg-gray-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    {strengthInfo.label && (
                                        <p className={`text-xs font-semibold tracking-wider ${strength === 4 ? 'text-brand-600' :
                                            strength === 3 ? 'text-yellow-600' :
                                                strength === 2 ? 'text-orange-500' : 'text-red-500'
                                            }`}>
                                            {strengthInfo.label} PASSWORD
                                        </p>
                                    )}
                                </div>
                            )}
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Terms */}
                        <div>
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    {...register('agreeToTerms')}
                                    type="checkbox"
                                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-600 
                           focus:ring-brand-600 cursor-pointer"
                                />
                                <span className="text-sm text-gray-600">
                                    I agree to the{' '}
                                    <Link href="/terms" className="text-brand-600 font-medium hover:underline">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" className="text-brand-600 font-medium hover:underline">
                                        Privacy Policy
                                    </Link>
                                    .
                                </span>
                            </label>
                            {errors.agreeToTerms && (
                                <p className="mt-1 text-xs text-red-500">{errors.agreeToTerms.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={isPending} className="btn-primary">
                            {isPending ? 'Creating account...' : 'Create Account'}
                            {!isPending && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>
                </div>

                <div className="flex gap-6 mt-6 justify-center">
                    <span className="security-badge text-green-600 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> PCI DSS Level 1
                    </span>
                    <span className="security-badge text-blue-600 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Bank-Grade
                    </span>
                </div>

                <p className="text-center mt-6 text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
