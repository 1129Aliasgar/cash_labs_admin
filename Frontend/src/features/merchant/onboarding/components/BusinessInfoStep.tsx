'use client';

import React from 'react';
import { Building2, Globe, FileText, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface BusinessInfoStepProps {
    onNext: (data: any) => void;
    initialData?: any;
}

export default function BusinessInfoStep({ onNext, initialData }: BusinessInfoStepProps) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialData || {
            businessName: '',
            registrationNumber: '',
            website: '',
            industry: '',
            fullName: '',
            email: '',
            phone: ''
        }
    });

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Business Information</h1>
                <p className="mt-3 text-lg text-gray-500 leading-relaxed max-w-2xl">
                    Please provide your legal business details and primary contact information to start the onboarding process.
                </p>
            </div>

            <form onSubmit={handleSubmit(onNext)} className="space-y-8">
                {/* Legal Business Details Section */}
                <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-6">
                        <div className="p-2.5 bg-brand-50 rounded-xl">
                            <Building2 className="w-5 h-5 text-brand-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Legal Business Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2.5">
                            <label className="text-sm font-bold text-gray-700 ml-1">Legal Business Name</label>
                            <input
                                {...register('businessName', { required: 'Business name is required' })}
                                className="auth-input bg-gray-50/50 border-gray-100 focus:bg-white transition-all h-12"
                                placeholder="e.g. Acme Corp Inc."
                                type="text"
                            />
                            {errors.businessName && <span className="text-xs text-red-500 ml-1">{errors.businessName.message as string}</span>}
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <label className="text-sm font-bold text-gray-700 ml-1">Registration Number</label>
                            <input
                                {...register('registrationNumber', { required: 'Registration number is required' })}
                                className="auth-input bg-gray-50/50 border-gray-100 focus:bg-white transition-all h-12"
                                placeholder="Tax ID or Business License #"
                                type="text"
                            />
                            {errors.registrationNumber && <span className="text-xs text-red-500 ml-1">{errors.registrationNumber.message as string}</span>}
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <label className="text-sm font-bold text-gray-700 ml-1">Website URL</label>
                            <div className="relative flex items-center group/input">
                                <Globe className="absolute left-4 w-4 h-4 text-gray-400 group-focus-within/input:text-brand-600 transition-colors" />
                                <input
                                    {...register('website')}
                                    className="auth-input pl-11 bg-gray-50/50 border-gray-100 focus:bg-white transition-all h-12"
                                    placeholder="www.example.com"
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <label className="text-sm font-bold text-gray-700 ml-1">Industry Type</label>
                            <select
                                {...register('industry', { required: 'Please select an industry' })}
                                className="auth-input bg-gray-50/50 border-gray-100 focus:bg-white transition-all h-12 appearance-none cursor-pointer"
                            >
                                <option value="">Select Industry</option>
                                <option value="ecommerce">E-commerce</option>
                                <option value="saas">SaaS / Software</option>
                                <option value="fintech">Fintech</option>
                                <option value="retail">Retail</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.industry && <span className="text-xs text-red-500 ml-1">{errors.industry.message as string}</span>}
                        </div>
                    </div>
                </section>

                {/* Primary Contact Section */}
                <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-6">
                        <div className="p-2.5 bg-brand-50 rounded-xl">
                            <FileText className="w-5 h-5 text-brand-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Primary Contact</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2.5 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                            <input
                                {...register('fullName', { required: 'Contact name is required' })}
                                className="auth-input bg-gray-50/50 border-gray-100 focus:bg-white transition-all h-12"
                                placeholder="John Doe"
                                type="text"
                            />
                            {errors.fullName && <span className="text-xs text-red-500 ml-1">{errors.fullName.message as string}</span>}
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                            <input
                                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                                className="auth-input bg-gray-50/50 border-gray-100 focus:bg-white transition-all h-12"
                                placeholder="john@acmecorp.com"
                                type="email"
                            />
                            {errors.email && <span className="text-xs text-red-500 ml-1">{errors.email.message as string}</span>}
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                            <input
                                {...register('phone', { required: 'Phone number is required' })}
                                className="auth-input bg-gray-50/50 border-gray-100 focus:bg-white transition-all h-12"
                                placeholder="+1 (555) 000-0000"
                                type="tel"
                            />
                            {errors.phone && <span className="text-xs text-red-500 ml-1">{errors.phone.message as string}</span>}
                        </div>
                    </div>
                </section>

                {/* Action Footer */}
                <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-10">
                    <button
                        type="button"
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
