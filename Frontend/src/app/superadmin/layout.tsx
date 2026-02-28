'use client';

import { useAuth, useLogout } from '@/features/auth/hooks';
import {
    LayoutDashboard,
    Users,
    ArrowRightLeft,
    Banknote,
    UserPlus,
    FileSearch,
    Settings,
    LogOut,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const NAV_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/superadmin/dashboard' },
    { label: 'Transactions', icon: ArrowRightLeft, href: '/superadmin/transactions' },
    { label: 'Organization', icon: Users, href: '/superadmin/organization' },
    { label: 'Client', icon: ShieldCheck, href: '/superadmin/client' },
    { label: 'Analysis', icon: FileSearch, href: '/superadmin/analysis' },
    { label: 'Customer', icon: Users, href: '/superadmin/customer' },
    { label: 'Settlement', icon: Banknote, href: '/superadmin/settlement' },
    { label: 'Audit Logs', icon: FileSearch, href: '/superadmin/audit-logs' },
    { label: 'Team', icon: UserPlus, href: '/superadmin/team' },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading } = useAuth();
    const logout = useLogout();
    const pathname = usePathname();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50">
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <Link href="/dashboard" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                            <span className="text-white font-bold text-lg">CL</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">CashLabs</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-blue-50 text-blue-700 font-semibold"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <div className="flex items-center">
                                    <item.icon className={cn(
                                        "w-5 h-5 mr-3 transition-colors",
                                        isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                                    )} />
                                    <span className="text-[15px]">{item.label}</span>
                                </div>
                                {isActive && <ChevronRight className="w-4 h-4 text-blue-600" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="bg-slate-900 rounded-2xl p-4 text-white">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center ring-2 ring-white/10">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 overflow-hidden font-medium">
                                <div className="text-sm truncate">Admin Portal</div>
                                <div className="text-[10px] text-blue-400 uppercase tracking-wider">{user?.role?.replace('_', ' ')}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => logout.mutate()}
                            className="flex items-center w-full justify-center space-x-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-semibold"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-8">
                    <div className="flex items-center">
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">System Overview</h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <div className="relative">
                                <Users className="w-6 h-6" />
                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                            </div>
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
                        <div className="flex items-center space-x-3 cursor-pointer group">
                            <div className="text-right sr-only sm:not-sr-only">
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{user?.fullName}</div>
                                <div className="text-[11px] text-slate-500 uppercase tracking-tighter">Verified Agent</div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border-2 border-transparent group-hover:border-blue-100 transition-all overflow-hidden text-slate-700 font-bold">
                                {user?.fullName?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
