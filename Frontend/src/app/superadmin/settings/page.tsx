'use client';

import React from 'react';
import {
    User,
    Shield,
    Bell,
    Globe,
    Lock,
    Mail,
    ChevronRight,
    Camera,
    Database,
    Cloud,
    Key
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/features/auth/hooks';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const SETTINGS_GROUPS = [
    {
        title: 'Account Settings',
        items: [
            { id: 'profile', label: 'Profile Information', icon: User, description: 'Update your name, email and professional bio.' },
            { id: 'security', label: 'Security & Password', icon: Shield, description: 'Manage your authentication methods and credentials.' },
            { id: 'notifications', label: 'Email Notifications', icon: Bell, description: 'Configure how and when you receive system alerts.' },
        ]
    },
    {
        title: 'System Preferences',
        items: [
            { id: 'appearance', label: 'Layout & Appearance', icon: Globe, description: 'Customize your dashboard interface and theme settings.' },
            { id: 'api-access', label: 'API Keys & Access', icon: Key, description: 'Manage developer tokens and integration permissions.' },
            { id: 'data', label: 'Data Management', icon: Database, description: 'Export your records and manage system storage.' },
        ]
    }
];

export default function SettingsPage() {
    const { data: user } = useAuth();

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Settings</h1>
                <p className="text-slate-500 font-medium">Manage your personal preferences and system-wide configurations.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Profile Quick Glance */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm flex flex-col items-center text-center">
                        <div className="relative group cursor-pointer mb-6">
                            <div className="size-28 rounded-full overflow-hidden border-4 border-slate-50 bg-slate-100 flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                                {user?.fullName ? (
                                    <span className="text-4xl font-black text-[#138aec]">{user.fullName.charAt(0)}</span>
                                ) : (
                                    <User className="size-12 text-slate-300" />
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 size-8 bg-[#138aec] text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                <Camera className="size-4" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">{user?.fullName || 'Administrator'}</h2>
                        <p className="text-sm font-medium text-slate-500 mb-6">{user?.email}</p>

                        <div className="w-full pt-6 border-t border-slate-100 flex flex-col gap-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-400 uppercase tracking-widest">Role</span>
                                <span className="px-2 py-1 bg-blue-50 text-[#138aec] font-black rounded-lg uppercase tracking-tighter">Super Admin</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-400 uppercase tracking-widest">Status</span>
                                <span className="flex items-center gap-1.5 font-bold text-emerald-600">
                                    <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                                <Cloud className="size-5" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Cloud Infrastructure</h3>
                            <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">Your instance is currently running on CashLabs Cloud v2.4.8.</p>
                            <button className="text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform group-hover:text-[#138aec]">
                                View System Status <ChevronRight className="size-3" />
                            </button>
                        </div>
                        <div className="absolute -right-10 -bottom-10 size-40 bg-[#138aec]/20 rounded-full blur-3xl" />
                    </div>
                </div>

                {/* Right Column: Settings Groups */}
                <div className="lg:col-span-2 space-y-10">
                    {SETTINGS_GROUPS.map((group) => (
                        <div key={group.title} className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{group.title}</h3>
                            <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                                <div className="divide-y divide-slate-100">
                                    {group.items.map((item) => (
                                        <button
                                            key={item.id}
                                            className="w-full flex items-center gap-5 p-6 hover:bg-slate-50/80 transition-all text-left group"
                                        >
                                            <div className="size-12 bg-slate-50 group-hover:bg-white rounded-2xl flex items-center justify-center border border-slate-100 transition-colors shadow-sm">
                                                <item.icon className="size-5 text-slate-600 group-hover:text-[#138aec] transition-colors" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-[15px] font-bold text-slate-900">{item.label}</div>
                                                <div className="text-sm font-medium text-slate-500 mt-0.5">{item.description}</div>
                                            </div>
                                            <ChevronRight className="size-5 text-slate-300 group-hover:text-slate-400 transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="pt-6">
                        <button className="w-full py-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-2xl border border-rose-100 transition-all flex items-center justify-center gap-2 group">
                            <Lock className="size-4" />
                            Sign Out of All Sessions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
