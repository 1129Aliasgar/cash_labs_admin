'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAllMerchants, useCreateClient } from '@/features/admin/hooks';
import { useForm } from 'react-hook-form';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type CreateClientFields = {
    name: string;
    organizationId: string;
    email: string;
    website?: string;
    currency: string;
    integrationMethod: 'API' | 'HOSTED_CHECKOUT' | 'PLUGIN';
};

export default function CreateClientPage() {
    const router = useRouter();
    const { data: merchantsResponse } = useAllMerchants();
    const { mutate: createClient, isPending } = useCreateClient();

    const organizations = merchantsResponse?.data || [];

    const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateClientFields>({
        defaultValues: {
            currency: 'USD',
            integrationMethod: 'API'
        }
    });

    const onSubmit = (data: CreateClientFields) => {
        // Map form fields to expected payload
        const payload = {
            name: data.name,
            clientId: data.name.toLowerCase().replace(/\s+/g, '-'),
            clientSecret: 'auto-generated'
        };

        createClient(payload as any, {
            onSuccess: () => {
                router.push('/superadmin/client');
            }
        });
    };

    const selectedIntegration = watch('integrationMethod');

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-[#138aec] transition-colors uppercase tracking-widest"
                >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Back to Clients
                </button>
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">Create New Client</h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Configure a new client account for multi-gateway processing.</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl p-8 md:p-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Client Name */}
                        <div className="col-span-2 md:col-span-1 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="name">Client Name</label>
                            <input
                                {...register('name', { required: 'Client name is required' })}
                                className={cn(
                                    "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#138aec] focus:border-[#138aec] transition-all outline-none",
                                    errors.name && "border-rose-500 ring-1 ring-rose-500"
                                )}
                                id="name"
                                placeholder="e.g. Starlight Retail"
                                type="text"
                            />
                            {errors.name && <p className="text-[10px] font-bold text-rose-500 ml-1 uppercase">{errors.name.message}</p>}
                        </div>

                        {/* Parent Organization */}
                        <div className="col-span-2 md:col-span-1 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="organizationId">Parent Organization</label>
                            <div className="relative">
                                <select
                                    {...register('organizationId', { required: 'Organization is required' })}
                                    className={cn(
                                        "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#138aec] focus:border-[#138aec] transition-all outline-none appearance-none cursor-pointer",
                                        errors.organizationId && "border-rose-500 ring-1 ring-rose-500"
                                    )}
                                    id="organizationId"
                                >
                                    <option value="">Select Organization</option>
                                    {organizations.map(org => (
                                        <option key={org.id} value={org.id}>{org.fullName} ({org.email})</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">expand_more</span>
                            </div>
                            {errors.organizationId && <p className="text-[10px] font-bold text-rose-500 ml-1 uppercase">{errors.organizationId.message}</p>}
                        </div>

                        {/* Contact Email */}
                        <div className="col-span-2 md:col-span-1 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="email">Contact Email</label>
                            <input
                                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                                className={cn(
                                    "w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#138aec] focus:border-[#138aec] transition-all outline-none",
                                    errors.email && "border-rose-500 ring-1 ring-rose-500"
                                )}
                                id="email"
                                placeholder="contact@client.com"
                                type="email"
                            />
                            {errors.email && <p className="text-[10px] font-bold text-rose-500 ml-1 uppercase">{errors.email.message}</p>}
                        </div>

                        {/* Website URL */}
                        <div className="col-span-2 md:col-span-1 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="website">Website URL</label>
                            <input
                                {...register('website')}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#138aec] focus:border-[#138aec] transition-all outline-none"
                                id="website"
                                placeholder="https://www.client.com"
                                type="url"
                            />
                        </div>

                        {/* Base Currency */}
                        <div className="col-span-2 md:col-span-1 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="currency">Base Currency</label>
                            <div className="relative">
                                <select
                                    {...register('currency')}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#138aec] focus:border-[#138aec] transition-all outline-none appearance-none cursor-pointer"
                                    id="currency"
                                >
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - British Pound</option>
                                    <option value="JPY">JPY - Japanese Yen</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">expand_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Integration Method */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Integration Method</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { id: 'API', label: 'API', desc: 'Direct server-to-server', icon: 'api' },
                                { id: 'HOSTED_CHECKOUT', label: 'Hosted Checkout', desc: 'Secure PSP-hosted page', icon: 'shopping_bag' },
                                { id: 'PLUGIN', label: 'Plugin', desc: 'CMS (e.g. WooCommerce)', icon: 'extension' },
                            ].map((method) => (
                                <label key={method.id} className="relative cursor-pointer group">
                                    <input
                                        {...register('integrationMethod')}
                                        className="peer sr-only"
                                        type="radio"
                                        value={method.id}
                                    />
                                    <div className="flex flex-col items-center gap-4 p-6 border-2 border-slate-100 rounded-3xl group-hover:border-[#138aec]/20 group-hover:bg-slate-50 peer-checked:border-[#138aec] peer-checked:bg-[#138aec]/5 peer-checked:ring-4 peer-checked:ring-[#138aec]/10 transition-all duration-300">
                                        <div className={cn(
                                            "size-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                                            selectedIntegration === method.id ? "bg-[#138aec] text-white shadow-xl shadow-[#138aec]/40" : "bg-slate-100 text-slate-400 group-hover:bg-white"
                                        )}>
                                            <span className="material-symbols-outlined text-[32px]">{method.icon}</span>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{method.label}</p>
                                            <p className="text-[11px] font-medium text-slate-400 mt-1">{method.desc}</p>
                                        </div>
                                    </div>
                                    <div className="absolute top-3 right-3 opacity-0 peer-checked:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-[#138aec] text-[20px] font-black">check_circle</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center gap-4 justify-end">
                        <button
                            onClick={() => router.back()}
                            className="w-full md:w-auto px-8 py-3.5 rounded-2xl text-sm font-black text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all uppercase tracking-widest"
                            type="button"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isPending}
                            className="w-full md:w-auto px-10 py-3.5 bg-[#138aec] text-white rounded-2xl text-sm font-black shadow-2xl shadow-[#138aec]/30 hover:bg-[#1176c9] hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                        >
                            {isPending ? 'Propagating...' : 'Create Client Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
