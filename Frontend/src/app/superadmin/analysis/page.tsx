'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function AnalysisPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Merchant Analytics Overview</h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Real-time performance monitoring across all payment gateways.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-slate-200 bg-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm text-slate-700">
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        Last 30 Days
                    </button>
                    <button className="px-4 py-2 bg-[#138aec] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-[#138aec]/20 hover:bg-[#1176c9] transition-all">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Transaction Volume', value: '$4,285,120.00', change: '+12.5%', icon: 'payments', color: 'blue' },
                    { label: 'Average Order Value', value: '$84.50', change: '+4.2%', icon: 'shopping_cart', color: 'indigo' },
                    { label: 'Success Rate %', value: '94.8%', change: '+0.4%', icon: 'check_circle', color: 'emerald' },
                    { label: 'Refund Rate %', value: '1.2%', change: '-0.4%', icon: 'assignment_return', color: 'rose' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={cn(
                                "size-10 rounded-xl flex items-center justify-center shadow-sm border",
                                stat.color === 'blue' && "bg-blue-50 text-[#138aec] border-blue-100",
                                stat.color === 'indigo' && "bg-indigo-50 text-indigo-500 border-indigo-100",
                                stat.color === 'emerald' && "bg-emerald-50 text-emerald-500 border-emerald-100",
                                stat.color === 'rose' && "bg-rose-50 text-rose-500 border-rose-100"
                            )}>
                                <span className="material-symbols-outlined">{stat.icon}</span>
                            </div>
                            <span className={cn(
                                "text-[10px] font-black px-2 py-1 rounded-full border tracking-tight",
                                stat.change.startsWith('+')
                                    ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                                    : 'text-rose-600 bg-rose-50 border-rose-100'
                            )}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10">{stat.label}</p>
                        <p className="text-2xl font-black mt-1 text-slate-900 relative z-10">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                    <h3 className="font-bold text-slate-900">Volume vs Success Rate</h3>
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-[#138aec]"></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction Volume</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-emerald-500"></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Success Rate</span>
                        </div>
                    </div>
                </div>
                <div className="p-8 h-[400px] flex items-end gap-3 px-10 relative">
                    {[60, 75, 85, 90, 65, 95, 80].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3">
                            <div className="w-full bg-[#138aec]/5 rounded-t-xl relative h-64 border-x border-t border-transparent hover:border-[#138aec]/20 transition-colors">
                                <div
                                    className="absolute bottom-0 w-full bg-gradient-to-t from-[#138aec] to-[#138aec]/80 rounded-t-xl transition-all duration-700 ease-out"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/20 px-1 py-0.5 rounded text-[8px] font-bold text-white opacity-0 hover:opacity-100 transition-opacity">
                                        {h}%
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Oct {i * 5 + 1 < 10 ? '0' : ''}{i * 5 + 1}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales by Method */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Sales by Method</h3>
                    </div>
                    <div className="p-8 flex items-center justify-between">
                        <div className="relative size-56 flex items-center justify-center">
                            <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                                <circle className="stroke-slate-100" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                                <circle className="stroke-[#138aec]" cx="18" cy="18" fill="none" r="16" strokeDasharray="65, 100" strokeLinecap="round" strokeWidth="3"></circle>
                                <circle className="stroke-indigo-400" cx="18" cy="18" fill="none" r="16" strokeDasharray="20, 100" strokeDashoffset="-65" strokeLinecap="round" strokeWidth="3"></circle>
                                <circle className="stroke-sky-300" cx="18" cy="18" fill="none" r="16" strokeDasharray="15, 100" strokeDashoffset="-85" strokeLinecap="round" strokeWidth="3"></circle>
                            </svg>
                            <div className="absolute text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total</p>
                                <p className="text-3xl font-black text-slate-900">100%</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5 pr-4">
                            {[
                                { label: 'Credit Card', value: '65%', color: 'bg-[#138aec]' },
                                { label: 'Digital Wallet', value: '20%', color: 'bg-indigo-400' },
                                { label: 'Bank Transfer', value: '15%', color: 'bg-sky-300' },
                            ].map((method, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className={cn("size-3 rounded-full shadow-sm", method.color)}></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 leading-none mb-1">{method.label}</p>
                                        <p className="text-[11px] text-slate-400 font-bold">{method.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Performing Clients */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Top Performing Clients</h3>
                    </div>
                    <div className="p-8 space-y-7">
                        {[
                            { name: 'Starlight Retail', volume: '$1.2M', width: '85%' },
                            { name: 'Nexus Solutions', volume: '$840K', width: '65%' },
                            { name: 'Global Tech', volume: '$620K', width: '45%' },
                            { name: 'Eco-Ventures', volume: '$310K', width: '25%' },
                        ].map((client, i) => (
                            <div key={i} className="space-y-2.5">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-700 transition-colors">{client.name}</span>
                                    <span className="text-xs font-black text-slate-900">{client.volume}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 shadow-inner">
                                    <div
                                        className="bg-gradient-to-r from-[#138aec] to-[#138aec]/70 h-full rounded-full transition-all duration-1000 ease-in-out"
                                        style={{ width: client.width }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Geographic Distribution */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-5/20">
                    <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Transaction Distribution by Country</h3>
                    <button className="text-[10px] font-black text-[#138aec] hover:underline uppercase tracking-widest">View Details</button>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 bg-slate-50/50 rounded-2xl min-h-[300px] relative overflow-hidden flex items-center justify-center border border-slate-100 font-bold text-slate-400">
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                <span className="material-symbols-outlined text-[300px]">public</span>
                            </div>
                            <div className="relative z-10 flex flex-col items-center">
                                <span className="material-symbols-outlined text-4xl mb-3 text-slate-300">map</span>
                                <p className="text-xs tracking-widest uppercase">Interactive Geographic View</p>
                            </div>
                            {/* Decorative dots to simulate map locations */}
                            <div className="absolute top-10 left-1/4 size-6 bg-[#138aec]/30 rounded-full ring-8 ring-[#138aec]/5 animate-pulse"></div>
                            <div className="absolute top-1/2 left-1/2 size-10 bg-[#138aec]/50 rounded-full ring-12 ring-[#138aec]/5"></div>
                            <div className="absolute bottom-1/4 right-1/4 size-8 bg-[#138aec]/20 rounded-full ring-6 ring-[#138aec]/5"></div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Top Regions</h4>
                            {[
                                { flag: '🇺🇸', name: 'United States', pc: '42%' },
                                { flag: '🇬🇧', name: 'United Kingdom', pc: '18%' },
                                { flag: '🇩🇪', name: 'Germany', pc: '12%' },
                                { flag: '🇨🇦', name: 'Canada', pc: '8%' },
                            ].map((region, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 cursor-default">
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{region.flag}</span>
                                        <span className="text-sm font-bold text-slate-700">{region.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-[#138aec]">{region.pc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
