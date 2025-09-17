'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormInput, FormSelect } from '../../ui/FormInput';

const PersonalInfoStep: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="mt-2 text-gray-600">Please provide your basic personal details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          {...register('personalInfo.firstName')}
          name="personalInfo.firstName"
          label="First Name"
          required
          error={(errors.personalInfo as any)?.firstName?.message}
          touched={!!(errors.personalInfo as any)?.firstName}
        />

        <FormInput
          {...register('personalInfo.lastName')}
          name="personalInfo.lastName"
          label="Last Name"
          required
          error={(errors.personalInfo as any)?.lastName?.message}
          touched={!!(errors.personalInfo as any)?.lastName}
        />

        <FormInput
          {...register('personalInfo.email')}
          name="personalInfo.email"
          label="Email Address"
          type="email"
          required
          error={(errors.personalInfo as any)?.email?.message}
          touched={!!(errors.personalInfo as any)?.email}
        />

        <FormInput
          {...register('personalInfo.phone')}
          name="personalInfo.phone"
          label="Mobile Number"
          type="tel"
          required
          error={(errors.personalInfo as any)?.phone?.message}
          touched={!!(errors.personalInfo as any)?.phone}
        />

        <FormInput
          {...register('personalInfo.dateOfBirth')}
          name="personalInfo.dateOfBirth"
          label="Date of Birth"
          type="date"
          required
          error={(errors.personalInfo as any)?.dateOfBirth?.message}
          touched={!!(errors.personalInfo as any)?.dateOfBirth}
        />

        <FormSelect
          {...register('personalInfo.gender')}
          name="personalInfo.gender"
          label="Gender"
          required
          options={genderOptions}
          error={(errors.personalInfo as any)?.gender?.message}
          touched={!!(errors.personalInfo as any)?.gender}
        />

        <FormInput
          {...register('personalInfo.aadharNumber')}
          name="personalInfo.aadharNumber"
          label="Aadhar Number"
          type="text"
          required
          error={(errors.personalInfo as any)?.aadharNumber?.message}
          touched={!!(errors.personalInfo as any)?.aadharNumber}
        />

        <FormInput
          {...register('personalInfo.panNumber')}
          name="personalInfo.panNumber"
          label="PAN Number"
          type="text"
          required
          error={(errors.personalInfo as any)?.panNumber?.message}
          touched={!!(errors.personalInfo as any)?.panNumber}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Important Information
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Please ensure all information is accurate and matches your official documents</li>
                <li>Your Aadhar and PAN numbers will be verified during the application process</li>
                <li>Make sure your mobile number is active as it will be used for communication</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
