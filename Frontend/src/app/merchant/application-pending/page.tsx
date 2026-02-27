'use client';

import { useAuth, useLogout } from '@/features/auth/hooks';
import { Clock, ShieldAlert, Send, LogOut, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function MerchantPendingPage() {
    // AuthGate handles all entry/exit navigation.
    const { data: user } = useAuth();
    const logout = useLogout();

    const isRejected = user?.merchantStatus === 'REJECTED';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
                <div className="p-8 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isRejected ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                            {isRejected ? (
                                <ShieldAlert className="w-10 h-10" />
                            ) : (
                                <Clock className="w-10 h-10" />
                            )}
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        {isRejected ? 'Application Declined' : 'Application Under Review'}
                    </h1>

                    <div className="flex justify-center mb-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isRejected ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                            <span className={`w-2 h-2 rounded-full mr-2 ${isRejected ? 'bg-red-500' : 'bg-blue-500 animate-pulse'}`}></span>
                            {isRejected ? 'Rejected' : 'Pending Approval'}
                        </span>
                    </div>

                    <p className="text-slate-600 mb-8 leading-relaxed">
                        {isRejected
                            ? "We regret to inform you that your merchant application has not been approved at this time. Please contact our compliance team for further details."
                            : "Thank you for joining PSPManager! Our security team is currently reviewing your merchant application. This process typically takes 24-48 business hours."}
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="mailto:support@cashlabs.admin"
                            className="flex items-center justify-center w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all duration-200 group"
                        >
                            <MessageSquare className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            Contact Support
                        </Link>

                        <button
                            onClick={() => logout.mutate()}
                            disabled={logout.isPending}
                            className="flex items-center justify-center w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-200 transition-all duration-200 group"
                        >
                            <LogOut className={`w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform ${logout.isPending ? 'animate-pulse' : ''}`} />
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium tracking-wide uppercase">
                        <span>Reference ID: {user?.id?.slice(-8).toUpperCase() || 'N/A'}</span>
                        <span>Fintech Secure</span>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-sm text-slate-400">
                &copy; {new Date().getFullYear()} CashLabs PSPManager. All rights reserved.
            </p>
        </div>
    );
}
