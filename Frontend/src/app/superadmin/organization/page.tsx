'use client';

import {
    Users,
    UserCheck,
    UserX,
    Hourglass,
    Search,
    Filter,
    MoreVertical,
    Check,
    X,
    Loader2,
    ArrowUpRight,
    ArrowDownRight,
    ExternalLink
} from 'lucide-react';
import { useState } from 'react';
import { useAllMerchants, useApproveMerchant, useRejectMerchant } from '@/features/admin/hooks';
import { cn } from '@/lib/utils';

export default function OrganizationPage() {
    const { data: merchantsData, isLoading } = useAllMerchants();
    const approveMerchant = useApproveMerchant();
    const rejectMerchant = useRejectMerchant();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

    const merchants = merchantsData?.data || [];

    // Filter logic
    const filteredMerchants = merchants.filter(m => {
        const matchesSearch = (m.companyName || m.fullName).toLowerCase().includes(searchTerm.toLowerCase()) || m.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || m.merchantStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = [
        { label: 'Total Merchants', value: merchants.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active', value: merchants.filter(m => m.merchantStatus === 'APPROVED').length, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Pending', value: merchants.filter(m => m.merchantStatus === 'PENDING').length, icon: Hourglass, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Rejected', value: merchants.filter(m => m.merchantStatus === 'REJECTED').length, icon: UserX, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage merchant accounts and process applications.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all flex items-center shadow-lg shadow-slate-200">
                        Add New Merchant <ArrowUpRight className="ml-2 w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-xl", stat.bg)}>
                                <stat.icon className={cn("w-6 h-6", stat.color)} />
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Organization Detail View */}
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm max-w-4xl mx-auto">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 border-4 border-white shadow-sm">
                    <Users className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Profile</h3>
                <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto leading-relaxed">
                    View and manage your platform's high-level entity configurations, legal documentation, and operational branches. Merchant account approvals and tracking have been centralized in the <span className="text-blue-600 font-bold hover:underline cursor-pointer" onClick={() => (window.location.href = '/superadmin/dashboard')}>Main Dashboard Queue</span>.
                </p>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                        Edit Corporate Identity
                    </button>
                    <button className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                        View Network Statistics
                    </button>
                </div>
            </div>
        </div>
    );
}
