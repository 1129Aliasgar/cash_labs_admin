'use client';

import React from 'react';
import { Upload, FileCheck, AlertCircle, ArrowRight, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface KYCDocumentsStepProps {
    onNext: (data: any) => void;
    onBack: () => void;
    initialData?: any;
}

export default function KYCDocumentsStep({ onNext, onBack, initialData }: KYCDocumentsStepProps) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialData || {
            idProof: '',
            addressProof: '',
            businessLicense: ''
        }
    });

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">KYC Documents</h1>
                <p className="mt-3 text-lg text-gray-500 leading-relaxed max-w-2xl">
                    We need to verify your identity and business legitimacy. Please upload clear copies of the following documents.
                </p>
            </div>

            <form onSubmit={handleSubmit(onNext)} className="space-y-8">
                {/* Document Upload Sections */}
                <div className="grid grid-cols-1 gap-6">
                    {[
                        { id: 'idProof', label: 'Government Issued ID', desc: 'Passport, Driver License, or National ID Card' },
                        { id: 'addressProof', label: 'Proof of Address', desc: 'Utility Bill, Bank Statement (within last 3 months)' },
                        { id: 'businessLicense', label: 'Business Registration/License', desc: 'Official document showing your legal business registration' }
                    ].map((doc) => (
                        <section key={doc.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-brand-50 rounded-2xl">
                                        <FileCheck className="w-6 h-6 text-brand-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{doc.label}</h3>
                                        <p className="text-sm text-gray-500 mt-1 max-w-sm">{doc.desc}</p>
                                    </div>
                                </div>

                                <div className="flex-shrink-0">
                                    <div className="relative group/upload">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl group-hover/upload:border-brand-600 group-hover/upload:bg-brand-50/30 transition-all">
                                            <Upload className="w-4 h-4 text-gray-400 group-hover/upload:text-brand-600" />
                                            <span className="text-sm font-bold text-gray-500 group-hover/upload:text-brand-600">Select File</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Status Placeholder (Simulated) */}
                            <div className="mt-6 flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-xl border border-green-100 text-xs font-bold">
                                    <FileCheck className="w-3.5 h-3.5" />
                                    demo_document.pdf
                                    <button type="button" className="ml-1 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800 leading-relaxed">
                        <p className="font-bold">Important Data Security Note</p>
                        <p className="opacity-80">Documents are encrypted both in transit and at rest using bank-grade AES-256 encryption. Only authorized compliance officers will review your data.</p>
                    </div>
                </div>

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
