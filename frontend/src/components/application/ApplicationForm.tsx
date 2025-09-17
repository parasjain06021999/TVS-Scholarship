'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  DocumentArrowUpIcon,
  UserIcon,
  AcademicCapIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

// Form validation schema
const applicationSchema = z.object({
  // Personal Information
  personalInfo: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER'], { required_error: 'Please select gender' }),
    aadharNumber: z.string().regex(/^\d{12}$/, 'Aadhar number must be 12 digits'),
    panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number'),
  }),

  // Address Information
  addressInfo: z.object({
    currentAddress: z.string().min(10, 'Please enter complete address'),
    currentCity: z.string().min(2, 'City is required'),
    currentState: z.string().min(2, 'State is required'),
    currentPinCode: z.string().regex(/^\d{6}$/, 'Pin code must be 6 digits'),
    permanentAddress: z.string().min(10, 'Please enter complete address'),
    permanentCity: z.string().min(2, 'City is required'),
    permanentState: z.string().min(2, 'State is required'),
    permanentPinCode: z.string().regex(/^\d{6}$/, 'Pin code must be 6 digits'),
  }),

  // Academic Information
  academicInfo: z.object({
    courseOfStudy: z.string().min(2, 'Course of study is required'),
    currentYear: z.string().min(1, 'Current year is required'),
    universityName: z.string().min(2, 'University name is required'),
    collegeName: z.string().min(2, 'College name is required'),
    academicPercentage: z.number().min(0).max(100, 'Percentage must be between 0 and 100'),
    achievements: z.string().optional(),
    extraCurriculars: z.string().optional(),
  }),

  // Family Information
  familyInfo: z.object({
    fatherName: z.string().min(2, 'Father\'s name is required'),
    fatherOccupation: z.string().min(2, 'Father\'s occupation is required'),
    motherName: z.string().min(2, 'Mother\'s name is required'),
    motherOccupation: z.string().min(2, 'Mother\'s occupation is required'),
    familyIncome: z.number().min(0, 'Family income must be positive'),
    familySize: z.number().min(1, 'Family size must be at least 1'),
    emergencyContact: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  }),

  // Financial Information
  financialInfo: z.object({
    familyIncome: z.number().min(0, 'Family income must be positive'),
    expenses: z.number().min(0, 'Expenses must be positive'),
    savings: z.number().min(0, 'Savings must be positive'),
    otherScholarships: z.number().min(0, 'Other scholarships must be positive'),
    bankName: z.string().min(2, 'Bank name is required'),
    accountNumber: z.string().min(9, 'Account number must be at least 9 digits'),
    ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code'),
    accountHolderName: z.string().min(2, 'Account holder name is required'),
  }),

  // Additional Information
  additionalInfo: z.object({
    essay: z.string().min(100, 'Essay must be at least 100 characters'),
    futureGoals: z.string().min(50, 'Future goals must be at least 50 characters'),
    whyScholarship: z.string().min(50, 'Please explain why you need this scholarship'),
    category: z.enum(['GENERAL', 'OBC', 'SC', 'ST', 'EWS'], { required_error: 'Please select category' }),
    minority: z.boolean().default(false),
    physicallyChallenged: z.boolean().default(false),
  }),

  // Documents
  documents: z.array(z.object({
    type: z.string(),
    file: z.any(),
    fileName: z.string(),
    fileSize: z.number(),
    isVerified: z.boolean().default(false),
  })).min(1, 'At least one document is required'),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

// Form steps configuration
const formSteps = [
  {
    id: 'personal',
    title: 'Personal Information',
    icon: UserIcon,
    description: 'Basic personal details',
  },
  {
    id: 'address',
    title: 'Address Information',
    icon: DocumentArrowUpIcon,
    description: 'Current and permanent address',
  },
  {
    id: 'academic',
    title: 'Academic Information',
    icon: AcademicCapIcon,
    description: 'Educational background',
  },
  {
    id: 'family',
    title: 'Family Information',
    icon: UserIcon,
    description: 'Family details and income',
  },
  {
    id: 'financial',
    title: 'Financial Information',
    icon: BanknotesIcon,
    description: 'Bank details and financial status',
  },
  {
    id: 'additional',
    title: 'Additional Information',
    icon: ClipboardDocumentListIcon,
    description: 'Essay and additional details',
  },
  {
    id: 'documents',
    title: 'Documents',
    icon: DocumentArrowUpIcon,
    description: 'Upload required documents',
  },
  {
    id: 'review',
    title: 'Review & Submit',
    icon: CheckCircleIcon,
    description: 'Review and submit application',
  },
];

// Step components
import PersonalInfoStep from './steps/PersonalInfoStep';
import AddressInfoStep from './steps/AddressInfoStep';
import AcademicInfoStep from './steps/AcademicInfoStep';
import FamilyInfoStep from './steps/FamilyInfoStep';
import FinancialInfoStep from './steps/FinancialInfoStep';
import AdditionalInfoStep from './steps/AdditionalInfoStep';
import DocumentsStep from './steps/DocumentsStep';
import ReviewStep from './steps/ReviewStep';

interface ApplicationFormProps {
  scholarshipId: string;
  onSuccess: (applicationId: string) => void;
  onError: (error: string) => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  scholarshipId,
  onSuccess,
  onError,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const methods = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    mode: 'onChange',
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'MALE',
        aadharNumber: '',
        panNumber: '',
      },
      addressInfo: {
        currentAddress: '',
        currentCity: '',
        currentState: '',
        currentPinCode: '',
        permanentAddress: '',
        permanentCity: '',
        permanentState: '',
        permanentPinCode: '',
      },
      academicInfo: {
        courseOfStudy: '',
        currentYear: '',
        universityName: '',
        collegeName: '',
        academicPercentage: 0,
        achievements: '',
        extraCurriculars: '',
      },
      familyInfo: {
        fatherName: '',
        fatherOccupation: '',
        motherName: '',
        motherOccupation: '',
        familyIncome: 0,
        familySize: 1,
        emergencyContact: '',
      },
      financialInfo: {
        familyIncome: 0,
        expenses: 0,
        savings: 0,
        otherScholarships: 0,
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
      },
      additionalInfo: {
        essay: '',
        futureGoals: '',
        whyScholarship: '',
        category: 'GENERAL',
        minority: false,
        physicallyChallenged: false,
      },
      documents: [],
    },
  });

  const { watch, trigger, getValues, setValue } = methods;
  const watchedValues = watch();

  // Auto-save functionality
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === 'change') {
        setHasChanges(true);
        debouncedSave();
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const debouncedSave = useCallback(
    debounce(async () => {
      if (hasChanges) {
        await saveDraft();
      }
    }, 2000),
    [hasChanges]
  );

  const saveDraft = async () => {
    try {
      setIsSaving(true);
      const formData = getValues();
      
      // Save to localStorage as backup
      localStorage.setItem(`application_draft_${scholarshipId}`, JSON.stringify(formData));
      
      // Save to backend
      const response = await fetch('/api/applications/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          scholarshipId,
          applicationData: formData,
        }),
      });

      if (response.ok) {
        setLastSaved(new Date());
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadDraft = async () => {
    try {
      // Load from localStorage first
      const savedDraft = localStorage.getItem(`application_draft_${scholarshipId}`);
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        Object.keys(draftData).forEach(key => {
          setValue(key as any, draftData[key]);
        });
      }

      // Load from backend
      const response = await fetch(`/api/applications/draft/${scholarshipId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const { data } = await response.json();
        Object.keys(data).forEach(key => {
          setValue(key as any, data[key]);
        });
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  useEffect(() => {
    loadDraft();
  }, [scholarshipId]);

  const nextStep = async () => {
    const stepFields = getStepFields(currentStep);
    const isValid = await trigger(stepFields);
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, formSteps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          scholarshipId,
          ...data,
        }),
      });

      if (response.ok) {
        const { data: result } = await response.json();
        onSuccess(result.id);
        
        // Clear draft
        localStorage.removeItem(`application_draft_${scholarshipId}`);
      } else {
        const error = await response.json();
        onError(error.message || 'Failed to submit application');
      }
    } catch (error) {
      onError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepFields = (stepIndex: number): (keyof ApplicationFormData)[] => {
    const stepFieldMap: Record<number, (keyof ApplicationFormData)[]> = {
      0: ['personalInfo'],
      1: ['addressInfo'],
      2: ['academicInfo'],
      3: ['familyInfo'],
      4: ['financialInfo'],
      5: ['additionalInfo'],
      6: ['documents'],
      7: [], // Review step - no validation needed
    };
    return stepFieldMap[stepIndex] || [];
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep />;
      case 1:
        return <AddressInfoStep />;
      case 2:
        return <AcademicInfoStep />;
      case 3:
        return <FamilyInfoStep />;
      case 4:
        return <FinancialInfoStep />;
      case 5:
        return <AdditionalInfoStep />;
      case 6:
        return <DocumentsStep />;
      case 7:
        return <ReviewStep />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Scholarship Application</h1>
          <p className="mt-2 text-lg text-gray-600">
            Complete all steps to submit your application
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {formSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isAccessible = index <= currentStep;

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center cursor-pointer ${
                    isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                  onClick={() => isAccessible && goToStep(index)}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isActive
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircleIcon className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Progress line */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / formSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Form Actions */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {isSaving && (
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2" />
                      Saving draft...
                    </div>
                  )}
                  {lastSaved && !isSaving && (
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Draft saved at {lastSaved.toLocaleTimeString()}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <ChevronLeftIcon className="w-4 h-4 mr-1" />
                      Previous
                    </button>
                  )}

                  {currentStep < formSteps.length - 1 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Next
                      <ChevronRightIcon className="w-4 h-4 ml-1" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          Submit Application
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default ApplicationForm;
