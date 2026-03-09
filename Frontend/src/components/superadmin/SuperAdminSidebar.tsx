'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, useLogout } from '@/features/auth/hooks';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LogOut, User as UserIcon, Settings, Shield } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const NAV_ITEMS = [
    { label: 'Dashboard', icon: 'dashboard', href: '/superadmin/dashboard' },
    { label: 'Transactions', icon: 'receipt_long', href: '/superadmin/transactions' },
    { label: 'Organizations', icon: 'corporate_fare', href: '/superadmin/organization' },
    { label: 'Clients', icon: 'business_center', href: '/superadmin/client' },
    { label: 'Analytics', icon: 'analytics', href: '/superadmin/analysis' },
    { label: 'Customers', icon: 'person', href: '/superadmin/customer' },
    { label: 'Settlement', icon: 'account_balance_wallet', href: '/superadmin/settlement' },
    { label: 'Teams', icon: 'group', href: '/superadmin/team' },
    { label: 'Audit Logs', icon: 'history', href: '/superadmin/audit-logs' },
];

const BOTTOM_ITEMS = [
    { label: 'Settings', icon: 'settings', href: '/superadmin/settings' },
    { label: 'Support', icon: 'help', href: '/superadmin/support' },
];

export function SuperAdminSidebar() {
    const { data: user } = useAuth();
    const { mutate: logout } = useLogout();
    const pathname = usePathname();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                router.push('/auth/login');
            }
        });
    };

    return (
        <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50">
            <div className="pt-2 flex items-center justify-center border-b border-slate-50">
                <img
                    src="/cashlabs-logo.png"
                    alt="CashLabs Logo"
                    className="h-[3.3rem] w-full object-cover"
                />
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/superadmin/dashboard' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-medium group",
                                isActive
                                    ? "bg-[#138aec] text-white shadow-md shadow-[#138aec]/20"
                                    : "text-slate-600 hover:bg-slate-100"
                            )}
                        >
                            <span className={cn(
                                "material-symbols-outlined text-[22px]",
                                isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                            )}>{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-200 space-y-1 relative" ref={dropdownRef}>
                {/* Logout Dropdown */}
                {isDropdownOpen && (
                    <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-2 animate-in slide-in-from-bottom-2 fade-in duration-200 z-50">
                        <div className="px-3 py-2 border-b border-slate-50 mb-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account</p>
                        </div>
                        <button
                            onClick={() => {
                                setIsDropdownOpen(false);
                                router.push('/superadmin/settings');
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <Settings className="size-4 text-slate-400" />
                            Settings
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                            <LogOut className="size-4 text-rose-500" />
                            Sign Out
                        </button>
                    </div>
                )}

                {BOTTOM_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-medium group",
                                isActive
                                    ? "bg-[#138aec]/10 text-[#138aec] border border-[#138aec]/20"
                                    : "text-slate-600 hover:bg-slate-100 border border-transparent"
                            )}
                        >
                            <span className={cn(
                                "material-symbols-outlined text-[20px]",
                                isActive ? "text-[#138aec]" : "text-slate-400 group-hover:text-slate-600"
                            )}>{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}

                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={cn(
                        "mt-4 w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 border",
                        isDropdownOpen
                            ? "bg-slate-50 border-slate-200 shadow-sm"
                            : "bg-slate-50/50 border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                    )}
                >
                    <div className="size-10 rounded-full overflow-hidden border border-slate-200 bg-white flex items-center justify-center flex-shrink-0">
                        {user?.fullName ? (
                            <span className="text-sm font-bold text-[#138aec]">{user.fullName.charAt(0)}</span>
                        ) : (
                            <span className="material-symbols-outlined text-slate-400">person</span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-semibold truncate text-slate-900">
                            {user?.fullName || 'Admin User'}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">
                            {user?.role?.replace('_', ' ') || 'Super Admin'}
                        </p>
                    </div>
                    <span className={cn(
                        "material-symbols-outlined text-slate-400 transition-transform duration-200",
                        isDropdownOpen && "rotate-180"
                    )}>unfold_more</span>
                </button>
            </div>
        </aside>
    );
}
