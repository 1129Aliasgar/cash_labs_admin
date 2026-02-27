'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, AlertCircle, Edit3 } from 'lucide-react';

interface ReviewSubmitStepProps {
    onNext: () => void;
    onBack: () => void;
    onJumpToStep: (step: number) => void;
    formData: any;
    isPending: boolean;
}

export default function ReviewSubmitStep({
    onNext,
    onBack,
    onJumpToStep,
    formData,
    isPending
}: ReviewSubmitStepProps) {

    const sections = [
        {
            title: 'Business Information',
            step: 1,
            items: [
                { label: 'Legal Name', value: formData.businessInfo.businessName },
                { label: 'Reg. Number', value: formData.businessInfo.registrationNumber },
                { label: 'Website', value: formData.businessInfo.website },
                { label: 'Industry', value: formData.businessInfo.industry },
            ]
        },
        {
            title: 'Primary Contact',
            step: 1,
            items: [
                { label: 'Full Name', value: formData.businessInfo.fullName },
                { label: 'Email', value: formData.businessInfo.email },
                { label: 'Phone', value: formData.businessInfo.phone },
            ]
        },
        {
            title: 'KYC Status',
            step: 2,
            items: [
                { label: 'Identity Proof', value: 'Attached (demo_id.pdf)' },
                { label: 'Address Proof', value: 'Attached (utility_bill.pdf)' },
                { label: 'Business License', value: 'Attached (business_license.pdf)' },
            ]
        },
        {
            title: 'Settlement Configuration',
            step: 3,
            items: [
                { label: 'Bank Name', value: formData.settlementDetails.bankName },
                { label: 'Account Holder', value: formData.settlementDetails.accountHolder },
                { label: 'Currency', value: formData.settlementDetails.currency },
                { label: 'Payout Frequency', value: formData.settlementDetails.payoutFrequency },
            ]
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Review & Submit</h1>
                <p className="mt-3 text-lg text-gray-500 leading-relaxed max-w-2xl">
                    Almost there! Please verify that all information provided is accurate. Once submitted, your application will enter the review queue.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {sections.map((section, idx) => (
                    <section key={idx} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
                            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">{section.title}</h2>
                            <button
                                onClick={() => onJumpToStep(section.step)}
                                className="flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors bg-brand-50 px-3 py-1.5 rounded-lg"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                Edit Section
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            {section.items.map((item, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{item.label}</span>
                                    <span className="text-sm font-bold text-gray-700 break-words">{item.value || <em className="text-gray-300 font-medium">Not provided</em>}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Confirmation Note */}
            <div className="bg-brand-50 border border-brand-100 rounded-3xl p-8 flex items-start gap-5">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-brand-100">
                    <ShieldCheck className="w-6 h-6 text-brand-600" />
                </div>
                <div className="text-sm text-brand-900 leading-relaxed">
                    <p className="font-black text-base mb-1">Legal Declaration</p>
                    <p className="font-medium opacity-70 mb-4">By clicking "Confirm & Submit", I certify that I am authorized to act on behalf of the business and that all information provided is true and correct to the best of my knowledge.</p>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-brand-200 text-brand-600 focus:ring-brand-600 cursor-pointer" defaultChecked />
                        <span className="font-bold text-brand-600 group-hover:underline">I accept the merchant services agreement</span>
                    </label>
                </div>
            </div>

            {/* Action Footer */}
            <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-10">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={isPending}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-all hover:text-gray-700 active:scale-95 disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={isPending}
                    className="flex items-center gap-2 px-12 py-4 rounded-2xl bg-brand-600 text-white font-black shadow-2xl shadow-brand-600/30 hover:bg-brand-700 hover:-translate-y-1 active:scale-95 transition-all text-base"
                >
                    {isPending ? (
                        <>
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <span>Confirm & Submit Application</span>
                            <CheckCircle2 className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
