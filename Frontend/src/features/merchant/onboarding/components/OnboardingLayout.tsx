'use client';

import React from 'react';
import {
    Building2,
    MessageSquare,
    UserCircle,
    ShieldCheck,
    CheckCircle2,
    HelpCircle,
    Bell,
    Wallet
} from 'lucide-react';
import { cn } from '../../../../lib/utils';

export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

interface MerchantOnboardingLayoutProps {
    children: React.ReactNode;
    currentStep: OnboardingStep;
    onStepClick?: (step: OnboardingStep) => void;
}

const steps = [
    { id: 1, title: 'Business Info', icon: Building2 },
    { id: 2, title: 'KYC Documents', icon: MessageSquare },
    { id: 3, title: 'Settlement Details', icon: Wallet },
    { id: 4, title: 'Review & Submit', icon: ShieldCheck },
];

export default function MerchantOnboardingLayout({
    children,
    currentStep,
    onStepClick
}: MerchantOnboardingLayoutProps) {
    // Application Pending step is outside the main stepper nav but tracked
    const progress = Math.min((currentStep / 4) * 100, 100);

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-gray-50 text-gray-900 antialiased overflow-x-hidden">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 lg:px-10 h-[65px]">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
                        <span className="font-bold text-lg">P</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold leading-tight tracking-tight text-gray-900">PSP Gateway</h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Merchant Portal</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end mr-2 text-right">
                        <span className="text-sm font-semibold text-gray-900">Standard Merchant Account</span>
                        <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            Draft saved at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all">
                        <Bell className="w-5 h-5" />
                    </button>
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center shadow-sm">
                        <UserCircle className="w-6 h-6 text-gray-400" />
                    </div>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden">
                {/* Sidebar Stepper (Hidden on mobile) */}
                <aside className="w-80 border-r border-gray-200 bg-white hidden lg:flex flex-col p-8 sticky top-[65px] h-[calc(100vh-65px)]">
                    <div className="mb-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Onboarding Progress</h3>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-900">Step {Math.min(currentStep, 4)} of 4</span>
                            <span className="text-sm font-black text-brand-600">{progress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div
                                className="h-full bg-brand-600 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <nav className="flex flex-col gap-3">
                        {steps.map((step) => {
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;
                            const Icon = step.icon;

                            return (
                                <button
                                    key={step.id}
                                    onClick={() => onStepClick?.(step.id as OnboardingStep)}
                                    disabled={!isCompleted && !isActive}
                                    className={cn(
                                        "flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all group text-left",
                                        isActive
                                            ? "border-brand-600 bg-brand-50/50 text-brand-600 shadow-sm"
                                            : isCompleted
                                                ? "border-transparent text-green-600 bg-green-50/30"
                                                : "border-transparent text-gray-400 hover:bg-gray-50"
                                    )}
                                >
                                    <div className={cn(
                                        "p-2.5 rounded-xl transition-all",
                                        isActive ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20" :
                                            isCompleted ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400"
                                    )}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">{step.title}</span>
                                        <span className="text-[10px] uppercase font-bold tracking-tight opacity-60">
                                            {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Pending'}
                                        </span>
                                    </div>
                                    {isCompleted && (
                                        <CheckCircle2 className="w-4 h-4 ml-auto text-green-600" />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="mt-auto p-5 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-sm font-bold text-gray-900">Need assistance?</p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">Our implementation specialists are here to help you get live.</p>
                        <button className="mt-4 w-full text-xs font-bold text-brand-600 flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                            Contact Support
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 bg-gray-50 p-6 lg:p-12 overflow-y-auto min-h-full">
                    <div className="mx-auto max-w-4xl pb-20">
                        {children}
                    </div>
                </div>
            </main>

            {/* Floating Help Button (Mobile) */}
            <button className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all lg:hidden">
                <HelpCircle className="w-6 h-6" />
            </button>

            {/* Background Decoration */}
            <div className="fixed top-0 left-0 -z-10 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
            </div>
        </div>
    );
}
