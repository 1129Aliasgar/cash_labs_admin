'use client';

import { ArrowRightLeft, Search, Filter, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TransactionsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Transactions</h1>
                    <p className="text-slate-500 text-sm mt-1">Real-time monitoring of all platform payments and transfers.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center">
                        <Download className="mr-2 w-4 h-4" /> Export
                    </button>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                        Search Database
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <ArrowRightLeft className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Module Under Construction</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                    The detailed transaction view is being finalized. Soon you will be able to filter, analyze, and export system-wide payment data from this view.
                </p>
            </div>
        </div>
    );
}
