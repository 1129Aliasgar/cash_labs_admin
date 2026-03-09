'use client';

import React from 'react';
import { useAuth } from '@/features/auth/hooks';

export default function SuperAdminDashboard() {
    const { data: user } = useAuth();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Welcome back, {user?.fullName?.split(' ')[0] || 'Admin'}
                    </h2>
                    <p className="text-slate-500 mt-0.5 text-sm">Monitor your global transaction performance and health.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 shadow-sm transition-all text-slate-700">
                        <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                        Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#138aec] text-white rounded-lg text-sm font-bold shadow-lg shadow-[#138aec]/20 hover:bg-[#1176c9] transition-all">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Export Reports
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">corporate_fare</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Organization:</span>
                    <select className="bg-transparent border-none p-0 text-sm font-bold text-slate-900 focus:ring-0 cursor-pointer outline-none">
                        <option>Global Corp</option>
                        <option>Tech Solutions Ltd</option>
                        <option>Euro Ventures</option>
                    </select>
                </div>
                <span className="material-symbols-outlined text-slate-300">arrow_forward</span>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">business_center</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Client:</span>
                    <select className="bg-transparent border-none p-0 text-sm font-bold text-slate-900 focus:ring-0 cursor-pointer outline-none">
                        <option>All Divisions</option>
                        <option>Retail Division</option>
                        <option>Online Wholesale</option>
                        <option>Logistics Branch</option>
                    </select>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <button className="text-xs font-bold text-slate-400 hover:text-[#138aec] transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">restart_alt</span> Reset Filters
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Volume</span>
                        <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">+12.4%</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-slate-900">$4,284,500.00</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">vs. $3,812,000.00 last month</p>
                </div>
                <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Success Rate</span>
                        <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">+0.8%</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-slate-900">98.2%</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Industry average: 94.5%</p>
                </div>
                <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Net Revenue</span>
                        <span className="text-[#138aec] bg-[#138aec]/10 px-2 py-0.5 rounded text-[10px] font-bold">Stable</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-slate-900">$142,912.40</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">After processor fees & splits</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-white border border-slate-200 shadow-sm rounded-xl p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Activity Over Time</h3>
                            <p className="text-sm text-slate-500">Transaction count and volume per day</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-xs font-bold bg-slate-100 rounded-lg text-slate-900">Volume</button>
                            <button className="px-3 py-1 text-xs font-bold text-slate-400 hover:bg-slate-50 transition-colors rounded-lg">Count</button>
                        </div>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        <div className="w-full bg-[#138aec]/10 rounded-t-lg relative group h-1/2">
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">$120k</div>
                        </div>
                        <div className="w-full bg-[#138aec]/20 rounded-t-lg relative group h-[75%]"></div>
                        <div className="w-full bg-[#138aec]/10 rounded-t-lg relative group h-[66%]"></div>
                        <div className="w-full bg-[#138aec]/30 rounded-t-lg relative group h-[80%]"></div>
                        <div className="w-full bg-[#138aec]/20 rounded-t-lg relative group h-1/2"></div>
                        <div className="w-full bg-[#138aec]/40 rounded-t-lg relative group h-[83%]"></div>
                        <div className="w-full bg-[#138aec]/60 rounded-t-lg relative group h-full"></div>
                        <div className="w-full bg-[#138aec]/40 rounded-t-lg relative group h-[75%]"></div>
                        <div className="w-full bg-[#138aec]/30 rounded-t-lg relative group h-1/2"></div>
                        <div className="w-full bg-[#138aec]/50 rounded-t-lg relative group h-[66%]"></div>
                        <div className="w-full bg-[#138aec]/20 rounded-t-lg relative group h-[33%]"></div>
                        <div className="w-full bg-[#138aec]/40 rounded-t-lg relative group h-[75%]"></div>
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                        <span>May 01</span>
                        <span>May 07</span>
                        <span>May 14</span>
                        <span>May 21</span>
                        <span>Today</span>
                    </div>
                </div>

                <div className="xl:col-span-1 bg-white border border-slate-200 shadow-sm rounded-xl flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                        <a className="text-xs font-bold text-[#138aec] hover:underline" href="#">View All</a>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="divide-y divide-slate-100">
                            {[
                                { title: 'Payment Approved', meta: 'James Wilson (#TX-880192) - Retail Div', time: '3 mins ago', amount: '$124.50', icon: 'add_task', color: 'emerald' },
                                { title: 'Processing ACH', meta: 'Sophia Martinez (#TX-880191)', time: '12 mins ago', amount: '$1,200.00', icon: 'sync', color: 'amber' },
                                { title: 'Transaction Declined', meta: "Sarah O'Connor (#TX-880189) - Card Declined", time: '42 mins ago', amount: '$210.00', icon: 'block', color: 'rose' },
                                { title: 'New Customer', meta: 'Elena Rossi joined Retail Div', time: '1 hour ago', amount: '—', icon: 'person_add', color: 'blue' },
                            ].map((activity, i) => (
                                <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4 space-y-0">
                                    <div className={cn(
                                        "size-8 rounded-full flex items-center justify-center",
                                        activity.color === 'emerald' && "bg-emerald-100 text-emerald-600",
                                        activity.color === 'amber' && "bg-amber-100 text-amber-600",
                                        activity.color === 'rose' && "bg-rose-100 text-rose-600",
                                        activity.color === 'blue' && "bg-blue-100 text-[#138aec]"
                                    )}>
                                        <span className="material-symbols-outlined text-[18px]">{activity.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                                        <p className="text-xs text-slate-500 truncate">{activity.meta}</p>
                                        <p className="text-[10px] text-slate-400 font-medium mt-1">{activity.time}</p>
                                    </div>
                                    <div className="text-sm font-bold text-slate-900">{activity.amount}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 border-t border-slate-100 bg-slate-50/30">
                        <button className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">Download Log</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function cn(...inputs: (string | boolean | undefined)[]) {
    return inputs.filter(Boolean).join(' ');
}
