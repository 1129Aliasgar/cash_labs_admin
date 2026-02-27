'use client';

import { Users, UserPlus, Search, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ClientsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">API Clients & Apps</h1>
                    <p className="text-slate-500 text-sm mt-1">Register and manage developer applications and API credentials.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                        Generate API Key
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <ShieldCheck className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Client Management Placeholder</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                    Manage your OIDC/OAuth2 clients and API credentials from this central hub. This module is currently scheduled for the next development phase.
                </p>
            </div>
        </div>
    );
}
