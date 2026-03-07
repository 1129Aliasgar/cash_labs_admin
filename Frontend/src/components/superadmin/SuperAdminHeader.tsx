'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface Breadcrumb {
    label: string;
    href?: string;
}

const BREADCRUMB_MAP: Record<string, string> = {
    'dashboard': 'Overview',
    'transactions': 'Transaction List',
    'organization': 'Organization Management',
    'client': 'Client Management',
    'analysis': 'Merchant Analytics',
    'customer': 'Customer Management',
    'settlement': 'Settlement Overview',
    'team': 'Team Management',
};

export function SuperAdminHeader() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    // Determine page title based on path
    const lastSegment = segments[segments.length - 1];
    const pageTitle = BREADCRUMB_MAP[lastSegment] || lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

    // Parent category
    const category = segments.length > 1 ? segments[1].charAt(0).toUpperCase() + segments[1].slice(1) : 'Admin';

    return (
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 z-10 flex-shrink-0 sticky top-0">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-400">{category}</span>
                <span className="material-symbols-outlined text-slate-300 text-[18px]">chevron_right</span>
                <span className="text-sm font-bold text-slate-900">{pageTitle}</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                    <input
                        className="w-64 bg-slate-100 border-none rounded-lg pl-10 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-[#138aec] focus:bg-white transition-all outline-none text-slate-900"
                        placeholder="Search..."
                        type="text"
                    />
                </div>

                <button className="size-10 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 relative">
                    <span className="material-symbols-outlined text-[24px]">notifications</span>
                    <span className="absolute top-2.5 right-2.5 size-2 bg-[#138aec] rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>
    );
}
