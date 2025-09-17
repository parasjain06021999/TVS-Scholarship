'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormInput, FormTextarea } from '../../ui/FormInput';

const FamilyInfoStep: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Family Information</h2>
        <p className="mt-2 text-gray-600">Please provide your family details and income information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          {...register('familyInfo.fatherName')}
          name="familyInfo.fatherName"
          label="Father's Name"
          required
          error={(errors.familyInfo as any)?.fatherName?.message}
          touched={!!(errors.familyInfo as any)?.fatherName}
        />

        <FormInput
          {...register('familyInfo.fatherOccupation')}
          name="familyInfo.fatherOccupation"
          label="Father's Occupation"
          required
          error={(errors.familyInfo as any)?.fatherOccupation?.message}
          touched={!!(errors.familyInfo as any)?.fatherOccupation}
        />

        <FormInput
          {...register('familyInfo.motherName')}
          name="familyInfo.motherName"
          label="Mother's Name"
          required
          error={(errors.familyInfo as any)?.motherName?.message}
          touched={!!(errors.familyInfo as any)?.motherName}
        />

        <FormInput
          {...register('familyInfo.motherOccupation')}
          name="familyInfo.motherOccupation"
          label="Mother's Occupation"
          required
          error={(errors.familyInfo as any)?.motherOccupation?.message}
          touched={!!(errors.familyInfo as any)?.motherOccupation}
        />

        <FormInput
          {...register('familyInfo.familyIncome', { valueAsNumber: true })}
          name="familyInfo.familyIncome"
          label="Annual Family Income (₹)"
          type="number"
          min="0"
          required
          error={(errors.familyInfo as any)?.familyIncome?.message}
          touched={!!(errors.familyInfo as any)?.familyIncome}
        />

        <FormInput
          {...register('familyInfo.familySize', { valueAsNumber: true })}
          name="familyInfo.familySize"
          label="Family Size"
          type="number"
          min="1"
          required
          error={(errors.familyInfo as any)?.familySize?.message}
          touched={!!(errors.familyInfo as any)?.familySize}
        />

        <FormInput
          {...register('familyInfo.emergencyContact')}
          name="familyInfo.emergencyContact"
          label="Emergency Contact Number"
          type="tel"
          required
          error={(errors.familyInfo as any)?.emergencyContact?.message}
          touched={!!(errors.familyInfo as any)?.emergencyContact}
        />
      </div>
    </div>
  );
};

export default FamilyInfoStep;
