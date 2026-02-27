'use client';

import {
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    DollarSign,
    Repeat,
    Wallet,
    Calendar,
    Filter,
    Search,
    MoreHorizontal
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const STATS = [
    { label: 'Today\'s Volume', value: '$12,450.00', change: '+8.2%', isPositive: true, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Settlements', value: '$45,210.50', change: '+12.5%', isPositive: true, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Links', value: '18', change: '-2', isPositive: false, icon: CreditCard, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Success Rate', value: '98.4%', change: '+1.2%', isPositive: true, icon: Repeat, color: 'text-amber-600', bg: 'bg-amber-50' },
];

const TRANSACTIONS = [
    { id: 'TX-8921', customer: 'Sarah Jenkins', amount: '$120.00', method: 'Visa ••42', status: 'SUCCESS', date: '10:45 AM' },
    { id: 'TX-8920', customer: 'Mark Thompson', amount: '$45.50', method: 'MC ••91', status: 'PENDING', date: '09:30 AM' },
    { id: 'TX-8919', customer: 'Global Logix', amount: '$2,400.00', method: 'Wire', status: 'SUCCESS', date: 'Yesterday' },
    { id: 'TX-8918', customer: 'Emily Davis', amount: '$85.00', method: 'Amex ••22', status: 'FAILED', date: 'Yesterday' },
    { id: 'TX-8917', customer: 'Robert Chen', amount: '$310.00', method: 'Visa ••15', status: 'SUCCESS', date: '2 days ago' },
];

export default function MerchantDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Merchant Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Merchant Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your payments, settlements, and customer insights.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center shadow-lg shadow-blue-200">
                        Create Payment Link <ArrowUpRight className="ml-2 w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-center mb-4">
                            <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                                <stat.icon className={cn("w-5 h-5", stat.color)} />
                            </div>
                            <span className={cn(
                                "text-[11px] font-bold px-2 py-1 rounded-lg",
                                stat.isPositive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                            )}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Transactions */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Activity</h2>
                        <div className="flex items-center space-x-2">
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                <Search className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-slate-50">
                                {TRANSACTIONS.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                        <td className="px-6 py-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-200">
                                                <DollarSign className="w-5 h-5 text-slate-500" />
                                            </div>
                                        </td>
                                        <td className="px-2 py-4">
                                            <div className="text-sm font-bold text-slate-900 leading-tight">{tx.customer}</div>
                                            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">{tx.id} • {tx.method}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="text-sm font-bold text-slate-900">{tx.amount}</div>
                                            <div className="text-[10px] text-slate-400 font-medium">{tx.date}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-widest",
                                                tx.status === 'SUCCESS' ? "bg-emerald-50 text-emerald-700" :
                                                    tx.status === 'PENDING' ? "bg-amber-50 text-amber-700" :
                                                        "bg-red-50 text-red-700"
                                            )}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-slate-50 mt-auto">
                        <button className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors bg-slate-50/50 rounded-xl">
                            View Analytics Report
                        </button>
                    </div>
                </div>

                {/* Sidebar Panel */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative shadow-xl shadow-slate-200">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Wallet className="w-24 h-24" />
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Available for Withdrawal</p>
                        <h2 className="text-3xl font-bold tracking-tighter mb-4">$3,500.00</h2>
                        <button className="w-full py-3 bg-white text-slate-900 rounded-2xl text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg">
                            Withdraw Funds
                        </button>
                        <p className="text-[10px] text-slate-500 mt-4 text-center">Next settlement expected in <span className="text-white font-bold">2 days</span></p>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                            Settlement Calendar
                        </h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Oct</span>
                                        <span className="text-xs font-bold text-slate-900">{25 + i}</span>
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-bold text-slate-800 tracking-tight">Weekly Payout</div>
                                        <div className="text-[10px] font-medium text-slate-400">Estimated: $2,100</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
