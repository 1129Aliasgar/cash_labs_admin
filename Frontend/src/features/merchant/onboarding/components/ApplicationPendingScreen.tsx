import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks';
import Link from 'next/link';
import { Clock, ShieldAlert, ArrowRight, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

export default function ApplicationPendingScreen() {
    const router = useRouter();
    const { data: user } = useAuth();

    // Auto-redirect if status changes while on this screen
    React.useEffect(() => {
        if (user?.merchantStatus === 'APPROVED') {
            router.replace('/superadmin/dashboard');
        }
    }, [user, router]);

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-1000 max-w-2xl mx-auto py-12">
            {/* Status Card */}
            <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-amber-400" />

                {/* Animated Icon */}
                <div className="mb-10 relative flex justify-center">
                    <div className="absolute inset-0 bg-amber-100 rounded-full scale-150 blur-2xl opacity-50 animate-pulse"></div>
                    <div className="relative h-24 w-24 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
                        <Clock className="w-12 h-12 stroke-[2.5px]" />
                    </div>
                </div>

                <h1 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Application Under Review</h1>
                <p className="text-lg text-gray-500 leading-relaxed mb-10">
                    Our compliance team is currently verifying your business profile. This process typically takes <span className="text-gray-900 font-bold">24-48 business hours</span>.
                </p>

                {/* Timeline/Steps */}
                <div className="space-y-6 mb-12 text-left bg-gray-50 p-8 rounded-3xl border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900">Registration & Onboarding</p>
                            <p className="text-xs text-gray-500">Successfully completed</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 relative">
                        <div className="absolute left-4 top-[-24px] w-0.5 h-6 bg-green-500" />
                        <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white animate-pulse">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900 font-bold">Compliance Verification</p>
                            <p className="text-xs text-amber-600 font-bold">In Progress</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 relative opacity-40">
                        <div className="absolute left-4 top-[-24px] w-0.5 h-6 bg-gray-200" />
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-white">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900">Account Activation</p>
                            <p className="text-xs text-gray-500">Pending verification</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <Link
                        href="/superadmin/dashboard"
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-black py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl group"
                    >
                        <span>Explore Read-Only Dashboard</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <button className="text-sm font-bold text-gray-400 hover:text-brand-600 flex items-center justify-center gap-2 transition-all">
                        Learn more about our review process <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Trust Message */}
            <div className="text-center group cursor-default">
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm transition-all group-hover:border-brand-200">
                    <ShieldAlert className="w-4 h-4 text-brand-600" />
                    <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700">Protected by CashLabs Security Protocol 4.2</span>
                </div>
            </div>
        </div>
    );
}
