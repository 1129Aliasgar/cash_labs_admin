'use client';

import React from 'react';
import { useAllMerchants } from '@/features/admin/hooks';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function OrganizationPage() {
    const { data: merchantsResponse, isLoading, error } = useAllMerchants();
    const organizations = merchantsResponse?.data || [];

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
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Organizations</h2>
                    <p className="text-slate-500 mt-0.5 text-sm">Manage hierarchy and financial parameters for your legal entities.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#138aec] text-white rounded-lg text-sm font-bold shadow-lg shadow-[#138aec]/20 hover:bg-[#1176c9] transition-all">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Create New Organization
                </button>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Org Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Email</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Created Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Associated Clients</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {organizations.map((org) => (
                                <tr key={org.id}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                                                {org.fullName?.substring(0, 2) || 'OR'}
                                            </div>
                                            <div className="text-sm font-semibold text-slate-900">{org.fullName}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{org.email}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <a className="text-sm font-semibold text-[#138aec] hover:underline decoration-2 underline-offset-4" href="#">
                                            {/* Logic for associated clients could be added here */}
                                            {org.role === 'MERCHANT' ? '12' : '0'}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={cn(
                                            "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight",
                                            org.isVerified
                                                ? "bg-emerald-100 text-emerald-600"
                                                : "bg-amber-100 text-amber-600"
                                        )}>
                                            {org.isVerified ? 'Verified' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-slate-400 hover:text-[#138aec] hover:bg-slate-100 rounded transition-colors" title="Edit">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-slate-100 rounded transition-colors" title="Settings">
                                                <span className="material-symbols-outlined text-[18px]">settings</span>
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 rounded transition-colors" title="Delete">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {organizations.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No organizations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500">Showing {organizations.length} organizations</p>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-lg border border-slate-200 hover:bg-white transition-colors disabled:opacity-50" disabled>
                            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        </button>
                        <button className="p-2 rounded-lg border border-slate-200 hover:bg-white transition-colors disabled:opacity-50" disabled>
                            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
