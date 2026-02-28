'use client';

import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function SignupSuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">P</span>
                    </div>
                    <span className="font-bold text-gray-900 tracking-tight text-sm uppercase font-black">PSP Gateway</span>
                </div>
            </header>

            <main className="flex flex-1 items-center justify-center px-4 py-8">
                <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-700">
                    <div className="auth-card p-10 text-center relative overflow-hidden">
                        {/* Background flare */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-60" />

                        {/* Success Icon */}
                        <div className="mb-8 relative flex justify-center">
                            <div className="absolute inset-0 bg-green-100 rounded-full scale-125 blur-xl opacity-40 animate-pulse" />
                            <div className="relative h-20 w-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-500/20">
                                <CheckCircle2 className="w-10 h-10 stroke-[2.5px]" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Account Active!</h1>
                        <p className="text-gray-500 mb-10 leading-relaxed font-medium">
                            Your identity has been verified. Welcome to the PSPManager network. Your account is now ready for use.
                        </p>

                        {/* Features grid */}
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left">
                                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg w-fit mb-3">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <h3 className="text-xs font-black text-gray-900 uppercase mb-1">Secure</h3>
                                <p className="text-[11px] text-gray-500 font-medium leading-normal">Full encryption enabled.</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left">
                                <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg w-fit mb-3">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <h3 className="text-xs font-black text-gray-900 uppercase mb-1">Fast</h3>
                                <p className="text-[11px] text-gray-500 font-medium leading-normal">Real-time settlement active.</p>
                            </div>
                        </div>

                        <Link
                            href="/auth/login"
                            className="btn-primary w-full group"
                        >
                            Sign In to your Dashboard
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                            <span>✦</span> Verified Secure Account <span>✦</span>
                        </p>
                    </div>
                </div>
            </main>

            <footer className="py-6 text-center text-xs text-gray-400 font-medium">
                &copy; {new Date().getFullYear()} CashLabs PSPManager. All rights reserved.
            </footer>
        </div>
    );
}
