'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useFormValidation, FormInput, FormSelect, FormTextarea } from '@/lib/validation';
import { useComponentState, useFormState, LoadingSpinner, ErrorDisplay, SuccessMessage } from '@/hooks/useComponentState';
import { useAPI, api } from '@/lib/api';
import { FileUpload } from '@/components/ui/FileUpload';
import { Modal, DataTable, ProgressBar } from '@/components/ui/Modal';
import { ProtectedRoute, SecureInput, MaskedData } from '@/components/auth/ProtectedRoute';
import { useResponsive, useResponsiveForm } from '@/hooks/useResponsive';
import { Button } from '@/components/ui/Button';
import { CheckCircleIcon, DocumentIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

// MANDATORY: Application Form Example with all patterns
interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  course: string;
  percentage: string;
  familyIncome: string;
  category: string;
  documents: File[];
}

const ApplicationFormExample: React.FC = () => {
  // MANDATORY: State management
  const { state: componentState, setLoading, setError, setSuccess } = useComponentState();
  const { state: formState, setSaving, setSaved, setHasChanges } = useFormState();
  
  // MANDATORY: Form validation
  const {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateForm,
    isValid
  } = useFormValidation({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    course: '',
    percentage: '',
    familyIncome: '',
    category: '',
    documents: []
  });

  // MANDATORY: Responsive design
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { formGrid, formSpacing, inputSize, buttonSize } = useResponsiveForm();

  // MANDATORY: API integration
  const { data: scholarships, loading: scholarshipsLoading, error: scholarshipsError } = useAPI('/scholarships');

  // MANDATORY: Performance optimization
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // MANDATORY: Memoized calculations
  const progressPercentage = useMemo(() => {
    return (currentStep / totalSteps) * 100;
  }, [currentStep, totalSteps]);

  const isFormComplete = useMemo(() => {
    return Object.values(values).every((value: any) =>   
      Array.isArray(value) ? value.length > 0 : value.toString().trim() !== ''
    );
  }, [values]);

  // MANDATORY: Auto-save functionality
  React.useEffect(() => {
    const autoSave = setInterval(() => {
      if (formState.hasChanges && !formState.saving) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSave);
  }, [formState.hasChanges, formState.saving]);

  // MANDATORY: Form handlers
  const handleFieldChange = useCallback((name: keyof ApplicationFormData, value: any) => {
    setValue(name, value);
    setHasChanges(true);
  }, [setValue, setHasChanges]);

  const handleFieldBlur = useCallback((name: keyof ApplicationFormData) => {
    setFieldTouched(name);
  }, [setFieldTouched]);

  // MANDATORY: Auto-save handler
  const handleAutoSave = useCallback(async () => {
    if (!isValid) return;

    setSaving(true);
    try {
      await api.request('/applications/autosave', {
        method: 'POST',
        body: JSON.stringify(values)
      });
      setSaved(true);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setSaving(false);
    }
  }, [isValid, values, setSaving, setSaved]);

  // MANDATORY: File upload handler
  const handleFileUpload = useCallback((files: any[]) => {
    handleFieldChange('documents', [...values.documents, ...files]);
  }, [values.documents, handleFieldChange]);

  // MANDATORY: Form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please correct the validation errors');
      return;
    }

    setLoading(true);
    try {
      await api.request('/applications', {
        method: 'POST',
        body: JSON.stringify(values)
      });
      setSuccess(true);
    } catch (error) {
      setError((error as any)?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  }, [validateForm, values, setLoading, setError, setSuccess]);

  // MANDATORY: Step navigation
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // MANDATORY: Loading state
  if (componentState.loading) {
    return <LoadingSpinner message="Loading application form..." />;
  }

  // MANDATORY: Error state
  if (componentState.error) {
    return <ErrorDisplay error={componentState.error} onRetry={() => window.location.reload()} />;
  }

  // MANDATORY: Success state
  if (componentState.success) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg text-center">
        <CheckCircleIcon className="mx-auto h-12 w-12 text-success-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Your application has been submitted successfully. You will receive a confirmation email shortly.
        </p>
        <Button onClick={() => window.location.reload()}>
          Submit Another Application
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* MANDATORY: Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        <ProgressBar
          value={progressPercentage}
          max={100}
          className="w-full"
        />
      </div>

      {/* MANDATORY: Auto-save indicator */}
      {formState.saving && (
        <div className="mb-4 text-sm text-gray-500">
          Saving...
        </div>
      )}
      {formState.saved && (
        <SuccessMessage
          message="Form saved automatically"
          onDismiss={() => setSaved(false)}
          autoHide={true}
        />
      )}

      <form onSubmit={handleSubmit} className={`space-y-8 ${formSpacing}`}>
        {/* MANDATORY: Step 1 - Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            
            <div className={`grid ${formGrid} gap-6`}>
              <SecureInput
                name="firstName"
                label="First Name"
                value={values.firstName}
                onChange={(value) => handleFieldChange('firstName', value)}
                onBlur={() => handleFieldBlur('firstName')}
                required
                className={inputSize}
              />
              
              <SecureInput
                name="lastName"
                label="Last Name"
                value={values.lastName}
                onChange={(value) => handleFieldChange('lastName', value)}
                onBlur={() => handleFieldBlur('lastName')}
                required
                className={inputSize}
              />
              
              <SecureInput
                name="email"
                label="Email Address"
                type="email"
                value={values.email}
                onChange={(value) => handleFieldChange('email', value)}
                onBlur={() => handleFieldBlur('email')}
                required
                className={inputSize}
              />
              
              <SecureInput
                name="mobile"
                label="Mobile Number"
                type="tel"
                value={values.mobile}
                onChange={(value) => handleFieldChange('mobile', value)}
                onBlur={() => handleFieldBlur('mobile')}
                required
                className={inputSize}
              />
            </div>
          </div>
        )}

        {/* MANDATORY: Step 2 - Address Information */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Address Information</h2>
            
            <FormTextarea
              name="address"
              label="Address"
              value={values.address}
              onChange={(value) => handleFieldChange('address', value)}
              onBlur={() => handleFieldBlur('address')}
              required
              rows={3}
            />
            
            <div className={`grid ${formGrid} gap-6`}>
              <FormInput
                name="city"
                label="City"
                value={values.city}
                onChange={(value) => handleFieldChange('city', value)}
                onBlur={() => handleFieldBlur('city')}
                required
              />
              
              <FormSelect
                name="state"
                label="State"
                value={values.state}
                onChange={(value) => handleFieldChange('state', value)}
                onBlur={() => handleFieldBlur('state')}
                required
                options={[
                  { value: 'Maharashtra', label: 'Maharashtra' },
                  { value: 'Karnataka', label: 'Karnataka' },
                  { value: 'Tamil Nadu', label: 'Tamil Nadu' },
                ]}
              />
              
              <FormInput
                name="pinCode"
                label="PIN Code"
                value={values.pinCode}
                onChange={(value) => handleFieldChange('pinCode', value)}
                onBlur={() => handleFieldBlur('pinCode')}
                required
              />
            </div>
          </div>
        )}

        {/* MANDATORY: Step 3 - Academic Information */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Academic Information</h2>
            
            <div className={`grid ${formGrid} gap-6`}>
              <FormSelect
                name="course"
                label="Course of Study"
                value={values.course}
                onChange={(value) => handleFieldChange('course', value)}
                onBlur={() => handleFieldBlur('course')}
                required
                options={[
                  { value: 'Engineering', label: 'Engineering' },
                  { value: 'Medicine', label: 'Medicine' },
                  { value: 'Commerce', label: 'Commerce' },
                ]}
              />
              
              <FormInput
                name="percentage"
                label="Academic Percentage"
                type="number"
                value={values.percentage}
                onChange={(value) => handleFieldChange('percentage', value)}
                onBlur={() => handleFieldBlur('percentage')}
                required
              />
              
              <FormInput
                name="familyIncome"
                label="Family Annual Income (₹)"
                type="number"
                value={values.familyIncome}
                onChange={(value) => handleFieldChange('familyIncome', value)}
                onBlur={() => handleFieldBlur('familyIncome')}
                required
              />
              
              <FormSelect
                name="category"
                label="Category"
                value={values.category}
                onChange={(value) => handleFieldChange('category', value)}
                onBlur={() => handleFieldBlur('category')}
                required
                options={[
                  { value: 'General', label: 'General' },
                  { value: 'OBC', label: 'OBC' },
                  { value: 'SC', label: 'SC' },
                  { value: 'ST', label: 'ST' },
                ]}
              />
            </div>
          </div>
        )}

        {/* MANDATORY: Step 4 - Document Upload */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
            
            <FileUpload
              acceptedTypes={['image/*', 'application/pdf']}
              maxSize={10 * 1024 * 1024} // 10MB
              maxFiles={5}
              onUpload={handleFileUpload}
              onError={(error) => setError(error)}
              multiple={true}
            />
            
            {/* MANDATORY: Document list */}
            {values.documents.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">Uploaded Documents</h3>
                {values.documents.map((file: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <DocumentIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newDocuments = values.documents.filter((_: any, i: number) => i !== index);
                        handleFieldChange('documents', newDocuments);
                      }}
                      className="text-error-600 hover:text-error-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MANDATORY: Navigation buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={!isValid}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!isValid || formState.saving}
              className={buttonSize}
            >
              {formState.saving ? 'Submitting...' : 'Submit Application'}
            </Button>
          )}
        </div>
      </form>

      {/* MANDATORY: Responsive design demo */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Responsive Design Demo</h3>
        <p className="text-sm text-gray-600">
          Current screen: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'} 
          ({typeof window !== 'undefined' ? window.innerWidth : 0}px)
        </p>
        <p className="text-sm text-gray-600">
          Form grid: {formGrid} | Input size: {inputSize} | Button size: {buttonSize}
        </p>
      </div>
    </div>
  );
};

// MANDATORY: Protected route wrapper
const ProtectedApplicationForm: React.FC = () => {
  return (
    <ProtectedRoute requiredRole="student">
      <ApplicationFormExample />
    </ProtectedRoute>
  );
};

export default ProtectedApplicationForm;
