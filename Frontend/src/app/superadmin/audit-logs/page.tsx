'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '@/features/admin/api/adminApi';
import {
    History,
    Shield,
    User,
    Activity,
    Search,
    Filter,
    RefreshCcw,
    AlertCircle,
    Monitor,
    Globe
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface AuditLog {
    _id: string;
    userId?: string;
    action: string;
    ip: string;
    userAgent: string;
    createdAt: string;
    metadata?: any;
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);

    const fetchLogs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await adminApi.getAuditLogs(page);
            if (response.success) {
                setLogs(response.data);
                setPagination(response.pagination);
            }
        } catch (err) {
            setError('Failed to load audit logs. Please ensure you have administrative permissions.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const getActionBadge = (action: string) => {
        const variants: Record<string, { bg: string, text: string, dot: string }> = {
            'LOGIN_SUCCESS': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
            'LOGIN_FAILED': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
            'SIGNUP': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
            'EMAIL_VERIFIED': { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500' },
            'TOKEN_REUSE_DETECTED': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
            'ACCOUNT_LOCKED': { bg: 'bg-slate-900 text-white', text: 'text-white', dot: 'bg-white' },
            'MERCHANT_APPROVED': { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
        };

        const variant = variants[action] || { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' };

        return (
            <span className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase",
                variant.bg,
                variant.text
            )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", variant.dot)} />
                {action.replace(/_/g, ' ')}
            </span>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-slate-900 text-white rounded-xl">
                            <History className="w-6 h-6" />
                        </div>
                        System Audit Logs
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Real-time surveillance of all security-critical system events.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchLogs()}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <RefreshCcw className={cn("w-5 h-5", isLoading && "animate-spin")} />
                    </button>
                    <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center shadow-lg shadow-slate-200">
                        Export Logs <Globe className="ml-2 w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by User ID or Action..."
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin mb-4" />
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Decrypting Logs...</p>
                    </div>
                ) : error ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                        <div className="p-4 bg-red-50 text-red-600 rounded-full mb-4">
                            <AlertCircle className="w-10 h-10" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Access Denied</h3>
                        <p className="text-slate-500 max-w-xs mt-2">{error}</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-50">
                        <Activity className="w-16 h-16 text-slate-200 mb-4" />
                        <p className="text-slate-500 font-bold">No system activity recorded yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Event</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Actor</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Network Data</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Platform</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-900 leading-tight">
                                                {new Date(log.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-[10px] font-medium text-slate-400 tabular-nums">
                                                {new Date(log.createdAt).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getActionBadge(log.action)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-[13px] font-bold text-slate-800 tabular-nums">
                                                        {log.userId?.slice(-8) || 'SYSTEM'}
                                                    </div>
                                                    <div className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                                                        {log.userId ? 'Individual' : 'Automated'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-xs font-bold text-slate-600 tabular-nums">{log.ip}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 max-w-[200px] truncate">
                                                <Monitor className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                                <span className="text-[10px] font-medium text-slate-500 truncate" title={log.userAgent}>
                                                    {log.userAgent}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer / Pagination */}
                <div className="mt-auto p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">
                        {pagination?.total || 0} Total Events Captured
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1 || isLoading}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-white disabled:opacity-30 transition-all"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page === pagination?.pages || isLoading}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-white disabled:opacity-30 transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50">
                <Shield className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">End-to-End Encrypted Audit Trail</span>
            </div>
        </div>
    );
}
