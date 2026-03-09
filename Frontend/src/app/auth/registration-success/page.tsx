'use client';

import React from 'react';
import Link from 'next/link';

export default function RegistrationSuccessPage() {
    return (
        <div className="bg-[#f6f7f8] min-h-screen flex flex-col font-sans">
            {/* Top Navigation Bar */}
            <header className="w-full bg-white border-b border-slate-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="/cashlabs-logo.png"
                            alt="CashLabs Logo"
                            className="h-8 w-auto object-contain"
                        />
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
                        <nav className="hidden md:flex items-center gap-8">
                            <span className="text-slate-400 cursor-default">Account Setup</span>
                        </nav>
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                            <span className="material-symbols-outlined text-slate-500">person</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="w-full max-w-[520px] relative z-10">
                    {/* Centered Success Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 flex flex-col items-center p-10 text-center shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)]">
                        {/* Success Icon */}
                        <div className="mb-8 relative">
                            <div className="absolute inset-0 bg-[#22c55e]/10 rounded-full scale-150 blur-xl"></div>
                            <div className="relative h-20 w-20 bg-[#22c55e] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#22c55e]/20">
                                <span className="material-symbols-outlined !text-5xl font-bold">check</span>
                            </div>
                        </div>

                        {/* Text Content */}
                        <h1 className="text-slate-900 text-3xl font-bold mb-4 tracking-tight">Account Created Successfully!</h1>
                        <p className="text-slate-600 text-base leading-relaxed mb-10 max-w-[400px]">
                            Your account is now ready. You can proceed to complete your merchant onboarding or explore your dashboard.
                        </p>

                        {/* Action Buttons */}
                        <div className="w-full flex flex-col gap-3 mb-10">
                            <Link
                                href="/merchant/onboarding"
                                className="w-full bg-[#138aec] hover:bg-[#1176c9] text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#138aec]/20"
                            >
                                <span>Complete Onboarding</span>
                                <span className="material-symbols-outlined !text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="w-full pt-8 border-t border-slate-100">
                            <div className="flex flex-wrap items-center justify-center gap-6">
                                <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                    <span className="material-symbols-outlined !text-lg text-[#138aec]">verified_user</span>
                                    SECURE
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                    <span className="material-symbols-outlined !text-lg text-[#22c55e]">lock</span>
                                    PCI DSS
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                    <span className="material-symbols-outlined !text-lg text-orange-400">encrypted</span>
                                    ENCRYPTED
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Small Print */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-xs">
                            Need help setting up your account?
                            <span className="text-[#138aec] font-medium ml-1">Support Available</span>
                        </p>
                    </div>
                </div>

                {/* Background Decoration Elements */}
                <div className="fixed top-0 left-0 -z-0 w-full h-full pointer-events-none opacity-40">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#138aec]/5 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#22c55e]/5 rounded-full blur-[120px]"></div>
                </div>
            </main>
        </div>
    );
}
