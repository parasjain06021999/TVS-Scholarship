'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormInput, FormTextarea, FormSelect } from '../../ui/FormInput';

const AddressInfoStep: React.FC = () => {
  const { register, formState: { errors }, watch, setValue } = useFormContext();
  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  const currentAddress = watch('addressInfo.currentAddress');
  const currentCity = watch('addressInfo.currentCity');
  const currentState = watch('addressInfo.currentState');
  const currentPinCode = watch('addressInfo.currentPinCode');

  const handleSameAsCurrentChange = (checked: boolean) => {
    setSameAsCurrent(checked);
    if (checked) {
      setValue('addressInfo.permanentAddress', currentAddress);
      setValue('addressInfo.permanentCity', currentCity);
      setValue('addressInfo.permanentState', currentState);
      setValue('addressInfo.permanentPinCode', currentPinCode);
    }
  };

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
    'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Address Information</h2>
        <p className="mt-2 text-gray-600">Please provide your current and permanent address</p>
      </div>

      {/* Current Address */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Address</h3>
        
        <div className="space-y-4">
          <FormTextarea
            {...register('addressInfo.currentAddress')}
            name="addressInfo.currentAddress"
            label="Current Address"
            required
            rows={3}
            error={(errors.addressInfo as any)?.currentAddress?.message}
            touched={!!(errors.addressInfo as any)?.currentAddress}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              {...register('addressInfo.currentCity')}
              name="addressInfo.currentCity"
              label="City"
              required
              error={(errors.addressInfo as any)?.currentCity?.message}
              touched={!!(errors.addressInfo as any)?.currentCity}
            />

            <FormSelect
              {...register('addressInfo.currentState')}
              name="addressInfo.currentState"
              label="State"
              required
              options={states.map(state => ({ value: state, label: state }))}
              error={(errors.addressInfo as any)?.currentState?.message}
              touched={!!(errors.addressInfo as any)?.currentState}
            />

            <FormInput
              {...register('addressInfo.currentPinCode')}
              name="addressInfo.currentPinCode"
              label="Pin Code"
              required
              error={(errors.addressInfo as any)?.currentPinCode?.message}
              touched={!!(errors.addressInfo as any)?.currentPinCode}
            />
          </div>
        </div>
      </div>

      {/* Same as Current Address Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="sameAsCurrent"
          checked={sameAsCurrent}
          onChange={(e) => handleSameAsCurrentChange(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="sameAsCurrent" className="ml-2 block text-sm text-gray-900">
          Permanent address is same as current address
        </label>
      </div>

      {/* Permanent Address */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Permanent Address</h3>
        
        <div className="space-y-4">
          <FormTextarea
            {...register('addressInfo.permanentAddress')}
            name="addressInfo.permanentAddress"
            label="Permanent Address"
            required
            rows={3}
            disabled={sameAsCurrent}
            error={(errors.addressInfo as any)?.permanentAddress?.message}
            touched={!!(errors.addressInfo as any)?.permanentAddress}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              {...register('addressInfo.permanentCity')}
              name="addressInfo.permanentCity"
              label="City"
              required
              disabled={sameAsCurrent}
              error={(errors.addressInfo as any)?.permanentCity?.message}
              touched={!!(errors.addressInfo as any)?.permanentCity}
            />

            <FormSelect
              {...register('addressInfo.permanentState')}
              name="addressInfo.permanentState"
              label="State"
              required
              disabled={sameAsCurrent}
              options={states.map(state => ({ value: state, label: state }))}
              error={(errors.addressInfo as any)?.permanentState?.message}
              touched={!!(errors.addressInfo as any)?.permanentState}
            />

            <FormInput
              {...register('addressInfo.permanentPinCode')}
              name="addressInfo.permanentPinCode"
              label="Pin Code"
              required
              disabled={sameAsCurrent}
              error={(errors.addressInfo as any)?.permanentPinCode?.message}
              touched={!!(errors.addressInfo as any)?.permanentPinCode}
            />
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Address Verification
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Please ensure your addresses are complete and accurate. Incomplete addresses may result in application rejection.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressInfoStep;
