'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTransactions } from '@/features/admin/hooks';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function TransactionsPage() {
    const router = useRouter();
    const { data: transactionsResponse, isLoading } = useTransactions();
    const transactions = transactionsResponse?.data || [];

    const handleRowClick = (id: string) => {
        router.push(`/superadmin/transactions/${id}`);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="size-10 border-4 border-[#138aec]/20 border-t-[#138aec] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Merchant Transactions</h2>
                    <p className="text-slate-500 mt-0.5 text-sm">Managing routing and transaction status across your infrastructure.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 shadow-sm transition-all text-slate-700">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#138aec] text-white rounded-lg text-sm font-bold shadow-lg shadow-[#138aec]/20 hover:bg-[#1176c9] transition-all">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        New Transaction
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">corporate_fare</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Organization:</span>
                    <select className="bg-transparent border-none p-0 text-sm font-bold text-slate-900 focus:ring-0 cursor-pointer outline-none">
                        <option>Global Corp</option>
                        <option>Tech Solutions Ltd</option>
                        <option>Euro Ventures</option>
                    </select>
                </div>
                <span className="material-symbols-outlined text-slate-300">arrow_forward</span>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">business_center</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Client:</span>
                    <select className="bg-transparent border-none p-0 text-sm font-bold text-slate-900 focus:ring-0 cursor-pointer outline-none">
                        <option>Retail Division</option>
                        <option>Online Wholesale</option>
                        <option>Logistics Branch</option>
                    </select>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <button className="text-xs font-bold text-slate-400 hover:text-[#138aec] transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">restart_alt</span> Reset View
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden flex flex-col">
                <div className="p-6 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
                        <div className="flex gap-1">
                            <span className="px-2 py-1 bg-[#138aec]/10 text-[#138aec] text-[10px] font-bold rounded-full uppercase tracking-tight">Real-time Data</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date / Time</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Method</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions.map((tx) => (
                                <tr
                                    key={tx.id}
                                    onClick={() => handleRowClick(tx.id)}
                                    className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-900">{tx.date}</div>
                                        <div className="text-[11px] text-slate-400">{tx.time}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-right text-slate-900">{tx.amount}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400 text-[18px]">{tx.icon}</span>
                                            <span className="text-sm font-medium text-slate-600">{tx.method}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={cn(
                                            "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight",
                                            tx.status === 'Approved' && "bg-emerald-100 text-emerald-600",
                                            tx.status === 'Processing' && "bg-amber-100 text-amber-600",
                                            tx.status === 'Declined' && "bg-rose-100 text-rose-600",
                                            tx.status === 'Refunded' && "bg-slate-100 text-slate-600"
                                        )}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{tx.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); }}
                                                className="p-1.5 text-slate-400 hover:text-[#138aec] hover:bg-slate-100 rounded transition-colors"
                                                title="Refresh Status"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">sync</span>
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleRowClick(tx.id); }}
                                                className="p-1.5 text-slate-400 hover:text-[#138aec] hover:bg-slate-100 rounded transition-colors"
                                                title="View Detail"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500">Showing {transactions.length} transactions</p>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-lg border border-slate-200 hover:bg-white transition-colors disabled:opacity-50" disabled>
                            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        </button>
                        <button className="p-2 rounded-lg border border-slate-200 hover:bg-white transition-colors">
                            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
