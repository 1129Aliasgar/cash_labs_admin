'use client';

import {
    Users,
    Hourglass,
    TrendingUp,
    UserCheck,
    MoreVertical,
    ChevronDown,
    ExternalLink,
    ArrowUpRight,
    ArrowDownRight,
    Check,
    X,
    Loader2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { usePendingMerchants, useApproveMerchant, useRejectMerchant } from '@/features/admin/hooks';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const STATS = [
    { label: 'Total Merchants', value: '1,284', change: '+12.5%', isPositive: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Approvals', value: '24', change: '-4', isPositive: false, icon: Hourglass, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Volume', value: '$4.2M', change: '+18.2%', isPositive: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Agents', value: '86', change: '+2', isPositive: true, icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

export default function SuperAdminDashboard() {
    const { data: pendingData, isLoading: isLoadingPending } = usePendingMerchants();
    const approveMerchant = useApproveMerchant();
    const rejectMerchant = useRejectMerchant();

    const merchants = pendingData?.data || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Main Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Monitor your system performance and manage merchant registrations.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors flex items-center">
                        Last 30 Days <ChevronDown className="ml-2 w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all flex items-center shadow-lg shadow-slate-200">
                        Export Report <ExternalLink className="ml-2 w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-xl", stat.bg)}>
                                <stat.icon className={cn("w-6 h-6", stat.color)} />
                            </div>
                            <div className={cn(
                                "flex items-center text-xs font-bold px-2 py-1 rounded-lg",
                                stat.isPositive ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"
                            )}>
                                {stat.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tables Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Pending Merchant Applications</h3>
                        <p className="text-slate-500 text-xs mt-0.5">Verification queue</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors">
                        View All Merchants
                    </button>
                </div>

                <div className="overflow-x-auto">
                    {isLoadingPending ? (
                        <div className="p-12 flex flex-col items-center justify-center text-slate-400 space-y-4">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            <p className="text-sm font-medium tracking-tight">Fetching pending applications...</p>
                        </div>
                    ) : merchants.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <Check className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-sm font-medium">All applications have been processed.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Merchant Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Reg Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {merchants.map((merchant) => (
                                    <tr key={merchant.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center mr-3 text-blue-600 font-bold text-xs border border-blue-100">
                                                    {merchant.companyName?.charAt(0) || merchant.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900 leading-tight">{merchant.companyName || merchant.fullName}</div>
                                                    <div className="text-[11px] text-slate-400">{merchant.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-tighter bg-amber-50 text-amber-700 border border-amber-100">
                                                <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-amber-500 animate-pulse"></span>
                                                {merchant.merchantStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                            {new Date(merchant.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm(`Approve ${merchant.companyName || merchant.fullName}?`)) {
                                                            approveMerchant.mutate(merchant.id);
                                                        }
                                                    }}
                                                    disabled={approveMerchant.isPending}
                                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl border border-emerald-100 transition-all shadow-sm"
                                                    title="Approve"
                                                >
                                                    {approveMerchant.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm(`Reject ${merchant.companyName || merchant.fullName}?`)) {
                                                            rejectMerchant.mutate(merchant.id);
                                                        }
                                                    }}
                                                    disabled={rejectMerchant.isPending}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl border border-red-100 transition-all shadow-sm"
                                                    title="Reject"
                                                >
                                                    {rejectMerchant.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
