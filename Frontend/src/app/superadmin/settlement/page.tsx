'use client';

import { Banknote, CreditCard, Clock, CheckCircle2, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettlementPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payer Settlements</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage payouts, bank configurations, and settlement cycles.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                        Initiate Batch Payout
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Banknote className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Settlement Hub Coming Soon</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                    Our financial processing core is being integrated. This view will provide full visibility into merchant payouts and gateway reconciliation.
                </p>
            </div>
        </div>
    );
}
