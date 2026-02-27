'use client';

import { FileSearch, BarChart3, PieChart, Activity, Download, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnalysisPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Analysis & Logs</h1>
                    <p className="text-slate-500 text-sm mt-1">Audit trails, performance metrics, and business intelligence.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center">
                        <Calendar className="mr-2 w-4 h-4" /> Date Range
                    </button>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center">
                        <Download className="mr-2 w-4 h-4" /> Download Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
                    <BarChart3 className="w-12 h-12 text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-800">Growth Metrics</h3>
                    <p className="text-slate-400 text-sm mt-2 max-w-xs">Visualizing merchant registration and volume trends over time.</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
                    <Activity className="w-12 h-12 text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-800">System Health</h3>
                    <p className="text-slate-400 text-sm mt-2 max-w-xs">Real-time status trackers for API endpoints and database latency.</p>
                </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold">Comprehensive Audit Logs</h3>
                    <p className="text-slate-400 mt-2 max-w-lg mx-auto">Searching hundreds of thousands of events for security investigations.</p>
                    <button className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-colors">
                        Access Audit Engine
                    </button>
                </div>
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
}
