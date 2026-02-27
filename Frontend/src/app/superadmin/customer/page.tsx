'use client';

import { Users, Search, Filter, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CustomerPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Customers</h1>
                    <p className="text-slate-500 text-sm mt-1">Directory of all individuals and entities paying via CashLabs.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Global Search..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 border-4 border-white shadow-inner">
                    <Users className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Customer Relationship Management</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                    Centralize your end-user data here. View payment history, handle disputes, and manage refund requests at the platform level.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <div className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-600">
                        Total Records: 0
                    </div>
                    <div className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-600">
                        Active Support Tickets: 0
                    </div>
                </div>
            </div>
        </div>
    );
}
