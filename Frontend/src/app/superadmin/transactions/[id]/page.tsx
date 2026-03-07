'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTransactionDetails, useRefundTransaction } from '@/features/admin/hooks';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function AdminTransactionDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const { data: transactionResponse, isLoading, error } = useTransactionDetails(id);
    const refundMutation = useRefundTransaction();

    const transaction = transactionResponse?.data;

    const handleRefund = async () => {
        if (window.confirm('Are you sure you want to refund this transaction?')) {
            try {
                await refundMutation.mutateAsync(id);
                alert('Refund processed successfully');
            } catch (err) {
                alert('Failed to process refund');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="size-10 border-4 border-[#138aec]/20 border-t-[#138aec] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !transaction) {
        return (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
                <span className="material-symbols-outlined text-slate-300 text-6xl mb-4">error</span>
                <h3 className="text-xl font-bold text-slate-900">Transaction Not Found</h3>
                <p className="text-slate-500 mt-2">The transaction you are looking for does not exist or has been moved.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Transaction Details</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold uppercase border border-slate-200">ID: {transaction.id}</span>
                    </div>
                    <p className="text-slate-500 mt-0.5 text-sm">Detailed report for transaction processed on {transaction.date} at {transaction.time}.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 shadow-sm transition-all text-slate-700">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Download Receipt
                    </button>
                    <button
                        onClick={handleRefund}
                        disabled={transaction.status === 'Refunded' || transaction.status === 'Declined' || refundMutation.isPending}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-all",
                            transaction.status === 'Refunded' || transaction.status === 'Declined'
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                                : "bg-rose-500 text-white shadow-rose-500/20 hover:bg-rose-600 active:scale-95"
                        )}
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {refundMutation.isPending ? 'sync' : 'keyboard_return'}
                        </span>
                        {refundMutation.isPending ? 'Processing...' : 'Refund'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Summary Card */}
                    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-900">Transaction Summary</h3>
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border",
                                transaction.status === 'Approved' && "bg-emerald-100 text-emerald-600 border-emerald-200",
                                transaction.status === 'Processing' && "bg-amber-100 text-amber-600 border-amber-200",
                                transaction.status === 'Declined' && "bg-rose-100 text-rose-600 border-rose-200",
                                transaction.status === 'Refunded' && "bg-slate-100 text-slate-600 border-slate-200"
                            )}>
                                {transaction.status}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                                <p className="text-3xl font-black text-slate-900">{transaction.amount} <span className="text-sm font-medium text-slate-400">USD</span></p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Transaction Type</p>
                                <p className="text-sm font-semibold text-slate-700">Sale / Capture</p>
                                <p className="text-[11px] text-slate-400">Point of Sale</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Authorized Date</p>
                                <p className="text-sm font-semibold text-slate-700">{transaction.date}</p>
                                <p className="text-[11px] text-slate-400">{transaction.time} UTC</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
                        <h3 className="font-bold text-slate-900 mb-6">Payment Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                                    <span className="material-symbols-outlined text-slate-400 text-[28px]">{transaction.icon}</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payment Method</p>
                                    <p className="text-sm font-semibold text-slate-900">{transaction.method}</p>
                                    <p className="text-[11px] text-slate-400">Expiry 12/26 • CVV Verified</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                                    <span className="material-symbols-outlined text-slate-400 text-[28px]">person</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Customer Details</p>
                                    <p className="text-sm font-semibold text-slate-900">{transaction.customerName || 'N/A'}</p>
                                    <p className="text-[11px] text-slate-400">{transaction.customerEmail || 'No email provided'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Routing Card */}
                    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
                        <h3 className="font-bold text-slate-900 mb-6">Routing & Gateway</h3>
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className="flex-1 p-5 bg-slate-50 rounded-2xl border border-slate-100 relative group overflow-hidden">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Processor Details</p>
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-black text-[#138aec] text-sm shadow-sm ring-4 ring-slate-100">P</div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{transaction.processor || 'Standard Gateway'}</p>
                                        <p className="text-[11px] text-slate-500 font-medium">Acquirer ID: ACQ-77812</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex items-center justify-center bg-white size-10 rounded-full border border-slate-100 shadow-sm -mx-2 z-10">
                                <span className="material-symbols-outlined text-[#138aec] font-bold">trending_flat</span>
                            </div>
                            <div className="flex-1 p-5 bg-[#138aec]/5 rounded-2xl border border-[#138aec]/10 relative overflow-hidden">
                                <p className="text-[10px] font-bold text-[#138aec]/60 uppercase tracking-widest mb-3">Routing Rule Triggered</p>
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-white border border-[#138aec]/20 flex items-center justify-center shadow-sm">
                                        <span className="material-symbols-outlined text-[#138aec] text-[20px]">route</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#138aec]">High-Priority Direct Path</p>
                                        <p className="text-[11px] text-[#138aec]/70 font-medium">Rule #412: Low Latency</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline Column */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-slate-200 shadow-sm rounded-xl h-full flex flex-col">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="font-bold text-slate-900">Transaction Timeline</h3>
                        </div>
                        <div className="p-6 flex-1 space-y-8">
                            {/* Timeline Items */}
                            <TimelineItem
                                status="success"
                                title="Transaction Captured"
                                time={`${transaction.date} • ${transaction.time}`}
                                description="Funds have been successfully captured and are ready for settlement."
                            />
                            <TimelineItem
                                status="success"
                                title="3D Secure Verified"
                                time={`${transaction.date} • ${transaction.time}`}
                            />
                            <TimelineItem
                                status="success"
                                title="Authorized"
                                time={`${transaction.date} • ${transaction.time}`}
                                description="Gateway response: AUTHORIZED_SUCCESS"
                            />
                            <TimelineItem
                                status="pending"
                                title="Transaction Created"
                                time={`${transaction.date} • ${transaction.time}`}
                            />
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center rounded-b-xl">
                            <button className="text-xs font-bold text-[#138aec] hover:underline uppercase tracking-widest">View Raw Log Data</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimelineItem({ status, title, time, description }: { status: 'success' | 'pending' | 'error', title: string, time: string, description?: string }) {
    return (
        <div className="relative pl-8 group">
            {/* Thread */}
            <div className="absolute left-[11px] top-[24px] bottom-[-24px] w-0.5 bg-slate-100 group-last:hidden"></div>

            {/* Icon */}
            <div className={cn(
                "absolute left-0 top-1 size-6 rounded-full flex items-center justify-center text-white z-10 shadow-sm",
                status === 'success' && "bg-emerald-500",
                status === 'pending' && "bg-slate-200 text-slate-500",
                status === 'error' && "bg-rose-500"
            )}>
                <span className="material-symbols-outlined text-[14px] font-bold">
                    {status === 'success' ? 'check' : status === 'pending' ? 'play_arrow' : 'close'}
                </span>
            </div>

            <div className="flex flex-col">
                <p className="text-sm font-bold text-slate-900 leading-none">{title}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{time}</p>
                {description && (
                    <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic font-medium leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
