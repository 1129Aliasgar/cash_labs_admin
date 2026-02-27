'use client';

import React from 'react';
import { Wallet, Landmark, Building, ArrowRight, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface SettlementDetailsStepProps {
    onNext: (data: any) => void;
    onBack: () => void;
    initialData?: any;
}

export default function SettlementDetailsStep({ onNext, onBack, initialData }: SettlementDetailsStepProps) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialData || {
            bankName: '',
            accountHolder: '',
            accountNumber: '',
            routingNumber: '',
            currency: 'USD',
            payoutFrequency: 'DAILY'
        }
    });

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Settlement Details</h1>
                <p className="mt-3 text-lg text-gray-500 leading-relaxed max-w-2xl">
                    Configure where you would like to receive your processed funds. We support global bank settlements.
                </p>
            </div>

            <form onSubmit={handleSubmit(onNext)} className="space-y-8">
                {/* Bank Details Section */}
                <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-6">
                        <div className="p-2.5 bg-brand-50 rounded-xl">
                            <Landmark className="w-5 h-5 text-brand-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Bank Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2.5 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Account Holder Name</label>
                            <div className="relative flex items-center group/input">
                                <Building className="absolute left-4 w-4 h-4 text-gray-400 group-focus-within/input:text-brand-600 transition-colors" />
                                <input
                                    {...register('accountHolder', { required: 'Account holder name is required' })}
                                    className="auth-input pl-11 bg-gray-50/50 border-gray-100 focus:bg-white transition-all h-12"
                                    placeholder="Official Legal Entity Name"
                                    type="text"
                                />
                            </div>
                            {errors.accountHolder && <span className="text-xs text-red-500 ml-1">{errors.accountHolder.message as string}</span>}
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <label className="text-sm font-bold text-gray-700 ml-1">Bank Name</label>
                            <input
                                {...register('bankName', { required: 'Bank name is required' })}
                                className="auth-input bg-gray-50/50 border-gray-100 focus:bg-white transition-all h-12"
                                placeholder="e.g. JPMorgan Chase"
                                type="text"
                            />
                            {errors.bankName && <span className="text-xs text-red-500 ml-1">{errors.bankName.message as string}</span>}
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <label className="text-sm font-bold text-gray-700 ml-1">Settlement Currency</label>
                            <select
                                {...register('currency', { required: true })}
                                className="auth-input bg-gray-50/50 border-gray-100 focus:bg-white transition-all h-12 appearance-none cursor-pointer"
                            >
                                <option value="USD">USD - US Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="GBP">GBP - British Pound</option>
                                <option value="USDT">USDT - Tether (TRC20/ERC20)</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <label className="text-sm font-bold text-gray-700 ml-1">Account Number / IBAN</label>
                            <input
                                {...register('accountNumber', { required: 'Account number is required' })}
                                className="auth-input bg-gray-50/50 border-gray-100 focus:bg-white transition-all h-12 font-mono"
                                placeholder="000000000000"
                                type="text"
                            />
                            {errors.accountNumber && <span className="text-xs text-red-500 ml-1">{errors.accountNumber.message as string}</span>}
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <label className="text-sm font-bold text-gray-700 ml-1">Routing Number / SWIFT</label>
                            <input
                                {...register('routingNumber', { required: 'Routing/SWIFT is required' })}
                                className="auth-input bg-gray-50/50 border-gray-100 focus:bg-white transition-all h-12 font-mono"
                                placeholder="AAAABBCCXXX"
                                type="text"
                            />
                            {errors.routingNumber && <span className="text-xs text-red-500 ml-1">{errors.routingNumber.message as string}</span>}
                        </div>
                    </div>
                </section>

                {/* Payout Strategy Section */}
                <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-6">
                        <div className="p-2.5 bg-brand-50 rounded-xl">
                            <Wallet className="w-5 h-5 text-brand-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Payout Preferences</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { id: 'DAILY', label: 'Daily', desc: 'T+2 Rolling Basis' },
                            { id: 'WEEKLY', label: 'Weekly', desc: 'Every Monday' },
                            { id: 'MONTHLY', label: 'Monthly', desc: '1st of Month' }
                        ].map((freq) => (
                            <label key={freq.id} className="cursor-pointer group/freq">
                                <input
                                    type="radio"
                                    value={freq.id}
                                    {...register('payoutFrequency')}
                                    className="peer hidden"
                                />
                                <div className="h-full p-6 rounded-2xl border-2 border-gray-100 bg-gray-50/30 peer-checked:border-brand-600 peer-checked:bg-brand-50/30 transition-all hover:border-gray-200">
                                    <span className="block text-sm font-black text-gray-900 mb-1">{freq.label}</span>
                                    <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider">{freq.desc}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Action Footer */}
                <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-10">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-all hover:text-gray-700 active:scale-95"
                    >
                        Back
                    </button>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            className="px-8 py-3.5 rounded-2xl text-gray-400 font-bold hover:text-gray-600 transition-all active:scale-95"
                        >
                            Save for later
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-10 py-3.5 rounded-2xl bg-brand-600 text-white font-bold shadow-xl shadow-brand-600/20 hover:bg-brand-700 hover:-translate-y-0.5 active:scale-95 transition-all"
                        >
                            <span>Save & Continue</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
