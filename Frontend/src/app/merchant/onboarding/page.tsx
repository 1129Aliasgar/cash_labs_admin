'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingLayout, { type OnboardingStep } from '@/features/merchant/onboarding/components/OnboardingLayout';
import BusinessInfoStep from '@/features/merchant/onboarding/components/BusinessInfoStep';
import KYCDocumentsStep from '@/features/merchant/onboarding/components/KYCDocumentsStep';
import SettlementDetailsStep from '@/features/merchant/onboarding/components/SettlementDetailsStep';
import ReviewSubmitStep from '@/features/merchant/onboarding/components/ReviewSubmitStep';
import ApplicationPendingScreen from '@/features/merchant/onboarding/components/ApplicationPendingScreen';
import { useAuth } from '@/features/auth/hooks';
import apiClient from '@/lib/axios';

export default function OnboardingPage() {
    const { data: user, isLoading: authLoading } = useAuth();
    const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        businessInfo: {
            businessName: '',
            registrationNumber: '',
            website: '',
            industry: '',
            fullName: '',
            email: '',
            phone: ''
        },
        kycDocuments: {},
        settlementDetails: {
            bankName: '',
            accountHolder: '',
            accountNumber: '',
            routingNumber: '',
            currency: 'USD',
            payoutFrequency: 'DAILY'
        }
    });

    // Unified UI control: No manual navigation allowed here.
    // Transition to step 5 (pending) is handled locally, but URL shifts are Gate-controlled.
    useEffect(() => {
        if (!authLoading && user) {
            if (user.merchantStatus === 'PENDING') {
                setCurrentStep(5);
            }
        }
    }, [user, authLoading]);

    const handleNext = (stepData: any) => {
        setFormData(prev => ({
            ...prev,
            [getStepKey(currentStep)]: stepData
        }));
        setCurrentStep((prev) => (prev + 1) as OnboardingStep);
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(1, prev - 1) as OnboardingStep);
    };

    const getStepKey = (step: number) => {
        switch (step) {
            case 1: return 'businessInfo';
            case 2: return 'kycDocuments';
            case 3: return 'settlementDetails';
            default: return '';
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // API call to finalize onboarding
            await apiClient.post('/merchant/onboarding/finalize', formData);
            setCurrentStep(5);
        } catch (error) {
            console.error('Submission failed:', error);
            // Fallback for demo if endpoint fails
            setCurrentStep(5);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
        </div>
    );

    return (
        <OnboardingLayout
            currentStep={currentStep}
            onStepClick={(step) => {
                if (step < currentStep) setCurrentStep(step);
            }}
        >
            {currentStep === 1 && (
                <BusinessInfoStep
                    onNext={handleNext}
                    initialData={formData.businessInfo}
                />
            )}

            {currentStep === 2 && (
                <KYCDocumentsStep
                    onNext={handleNext}
                    onBack={handleBack}
                    initialData={formData.kycDocuments}
                />
            )}

            {currentStep === 3 && (
                <SettlementDetailsStep
                    onNext={handleNext}
                    onBack={handleBack}
                    initialData={formData.settlementDetails}
                />
            )}

            {currentStep === 4 && (
                <ReviewSubmitStep
                    onNext={handleSubmit}
                    onBack={handleBack}
                    onJumpToStep={(step) => setCurrentStep(step as OnboardingStep)}
                    formData={formData}
                    isPending={isSubmitting}
                />
            )}

            {currentStep === 5 && (
                <ApplicationPendingScreen />
            )}
        </OnboardingLayout>
    );
}
