'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormInput } from '../../ui/FormInput';

const FinancialInfoStep: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Financial Information</h2>
        <p className="mt-2 text-gray-600">Please provide your financial details and bank information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          {...register('financialInfo.familyIncome', { valueAsNumber: true })}
          name="financialInfo.familyIncome"
          label="Annual Family Income (₹)"
          type="number"
          min="0"
          required
          error={(errors.financialInfo as any)?.familyIncome?.message}
          touched={!!(errors.financialInfo as any)?.familyIncome}
        />

        <FormInput
          {...register('financialInfo.expenses', { valueAsNumber: true })}
          name="financialInfo.expenses"
          label="Annual Family Expenses (₹)"
          type="number"
          min="0"
          required
          error={(errors.financialInfo as any)?.expenses?.message}
          touched={!!(errors.financialInfo as any)?.expenses}
        />

        <FormInput
          {...register('financialInfo.savings', { valueAsNumber: true })}
          name="financialInfo.savings"
          label="Annual Family Savings (₹)"
          type="number"
          min="0"
          required
          error={(errors.financialInfo as any)?.savings?.message}
          touched={!!(errors.financialInfo as any)?.savings}
        />

        <FormInput
          {...register('financialInfo.otherScholarships', { valueAsNumber: true })}
          name="financialInfo.otherScholarships"
          label="Other Scholarships Received (₹)"
          type="number"
          min="0"
          required
          error={(errors.financialInfo as any)?.otherScholarships?.message}
          touched={!!(errors.financialInfo as any)?.otherScholarships}
        />

        <FormInput
          {...register('financialInfo.bankName')}
          name="financialInfo.bankName"
          label="Bank Name"
          required
          error={(errors.financialInfo as any)?.bankName?.message}
          touched={!!(errors.financialInfo as any)?.bankName}
        />

        <FormInput
          {...register('financialInfo.accountNumber')}
          name="financialInfo.accountNumber"
          label="Account Number"
          required
          error={(errors.financialInfo as any)?.accountNumber?.message}
          touched={!!(errors.financialInfo as any)?.accountNumber}
        />

        <FormInput
          {...register('financialInfo.ifscCode')}
          name="financialInfo.ifscCode"
          label="IFSC Code"
          required
          error={(errors.financialInfo as any)?.ifscCode?.message}
          touched={!!(errors.financialInfo as any)?.ifscCode}
        />

        <FormInput
          {...register('financialInfo.accountHolderName')}
          name="financialInfo.accountHolderName"
          label="Account Holder Name"
          required
          error={(errors.financialInfo as any)?.accountHolderName?.message}
          touched={!!(errors.financialInfo as any)?.accountHolderName}
        />
      </div>
    </div>
  );
};

export default FinancialInfoStep;
