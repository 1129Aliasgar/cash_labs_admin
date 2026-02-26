'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, ClipboardList, Shield, Lock } from 'lucide-react';

export default function RegistrationSuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">P</span>
                    </div>
                    <span className="font-bold text-gray-900">PSP Gateway</span>
                </div>
                <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                    <Link href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link>
                    <Link href="/transactions" className="hover:text-gray-900 transition-colors">Transactions</Link>
                    <Link href="/settings" className="hover:text-gray-900 transition-colors">Settings</Link>
                    <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </button>
                </nav>
            </header>

            <main className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-md auth-card text-center">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-9 h-9 text-white" strokeWidth={2.5} />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Account Created Successfully!</h1>
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                        Your account is now ready. You can proceed to complete your merchant
                        onboarding or explore your dashboard.
                    </p>

                    {/* CTA buttons */}
                    <div className="space-y-3">
                        <Link href="/dashboard" className="btn-primary">
                            Go to Dashboard <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/onboarding" className="btn-secondary">
                            Complete Onboarding
                        </Link>
                    </div>

                    {/* Security badges */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-6">
                        <span className="security-badge text-blue-600">
                            <Shield className="w-3.5 h-3.5" /> Secure
                        </span>
                        <span className="security-badge text-green-600">
                            <ClipboardList className="w-3.5 h-3.5" /> PCI DSS
                        </span>
                        <span className="security-badge text-orange-500">
                            <Lock className="w-3.5 h-3.5" /> Encrypted
                        </span>
                    </div>
                </div>

                <p className="absolute bottom-6 text-sm text-gray-500 text-center">
                    Need help setting up your account?{' '}
                    <Link href="/support" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">
                        Contact Support
                    </Link>
                </p>
            </main>
        </div>
    );
}
