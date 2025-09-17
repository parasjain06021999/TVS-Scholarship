'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormInput, FormTextarea, FormSelect } from '../../ui/FormInput';

const AdditionalInfoStep: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  const categoryOptions = [
    { value: 'GENERAL', label: 'General' },
    { value: 'OBC', label: 'OBC' },
    { value: 'SC', label: 'SC' },
    { value: 'ST', label: 'ST' },
    { value: 'EWS', label: 'EWS' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
        <p className="mt-2 text-gray-600">Please provide additional details and essay responses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          {...register('additionalInfo.category')}
          name="additionalInfo.category"
          label="Category"
          required
          options={categoryOptions}
          error={(errors.additionalInfo as any)?.category?.message}
          touched={!!(errors.additionalInfo as any)?.category}
        />

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              {...register('additionalInfo.minority')}
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Minority Community
            </label>
          </div>

          <div className="flex items-center">
            <input
              {...register('additionalInfo.physicallyChallenged')}
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Physically Challenged
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <FormTextarea
          {...register('additionalInfo.essay')}
          name="additionalInfo.essay"
          label="Personal Essay"
          rows={6}
          required
          placeholder="Write about yourself, your goals, and why you deserve this scholarship (minimum 100 words)"
          error={(errors.additionalInfo as any)?.essay?.message}
          touched={!!(errors.additionalInfo as any)?.essay}
        />

        <FormTextarea
          {...register('additionalInfo.futureGoals')}
          name="additionalInfo.futureGoals"
          label="Future Goals"
          rows={4}
          required
          placeholder="Describe your future career goals and how this scholarship will help you achieve them (minimum 50 words)"
          error={(errors.additionalInfo as any)?.futureGoals?.message}
          touched={!!(errors.additionalInfo as any)?.futureGoals}
        />

        <FormTextarea
          {...register('additionalInfo.whyScholarship')}
          name="additionalInfo.whyScholarship"
          label="Why do you need this scholarship?"
          rows={4}
          required
          placeholder="Explain your financial need and how this scholarship will impact your education (minimum 50 words)"
          error={(errors.additionalInfo as any)?.whyScholarship?.message}
          touched={!!(errors.additionalInfo as any)?.whyScholarship}
        />
      </div>
    </div>
  );
};

export default AdditionalInfoStep;
