'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const ReviewStep: React.FC = () => {
  const { watch } = useFormContext();
  const formData = watch();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
        <p className="mt-2 text-gray-600">Please review all information before submitting your application</p>
      </div>

      <div className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900">{formData.personalInfo?.firstName} {formData.personalInfo?.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{formData.personalInfo?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-gray-900">{formData.personalInfo?.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date of Birth</label>
              <p className="text-gray-900">{formatDate(formData.personalInfo?.dateOfBirth)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Gender</label>
              <p className="text-gray-900">{formData.personalInfo?.gender}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Aadhar Number</label>
              <p className="text-gray-900">{formData.personalInfo?.aadharNumber}</p>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Course of Study</label>
              <p className="text-gray-900">{formData.academicInfo?.courseOfStudy}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Current Year</label>
              <p className="text-gray-900">{formData.academicInfo?.currentYear}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">University</label>
              <p className="text-gray-900">{formData.academicInfo?.universityName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">College</label>
              <p className="text-gray-900">{formData.academicInfo?.collegeName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Academic Percentage</label>
              <p className="text-gray-900">{formData.academicInfo?.academicPercentage}%</p>
            </div>
          </div>
        </div>

        {/* Family Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Father's Name</label>
              <p className="text-gray-900">{formData.familyInfo?.fatherName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Father's Occupation</label>
              <p className="text-gray-900">{formData.familyInfo?.fatherOccupation}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Mother's Name</label>
              <p className="text-gray-900">{formData.familyInfo?.motherName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Mother's Occupation</label>
              <p className="text-gray-900">{formData.familyInfo?.motherOccupation}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Family Income</label>
              <p className="text-gray-900">{formatCurrency(formData.familyInfo?.familyIncome || 0)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Family Size</label>
              <p className="text-gray-900">{formData.familyInfo?.familySize}</p>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Bank Name</label>
              <p className="text-gray-900">{formData.financialInfo?.bankName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Account Number</label>
              <p className="text-gray-900">{formData.financialInfo?.accountNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">IFSC Code</label>
              <p className="text-gray-900">{formData.financialInfo?.ifscCode}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Account Holder Name</label>
              <p className="text-gray-900">{formData.financialInfo?.accountHolderName}</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Category</label>
              <p className="text-gray-900">{formData.additionalInfo?.category}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Personal Essay</label>
              <p className="text-gray-900 whitespace-pre-wrap">{formData.additionalInfo?.essay}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Future Goals</label>
              <p className="text-gray-900 whitespace-pre-wrap">{formData.additionalInfo?.futureGoals}</p>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
          <div className="space-y-2">
            {formData.documents?.map((doc: any, index: number) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-900">{doc.fileName}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Declaration */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="declaration"
            required
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="declaration" className="ml-3 text-sm text-gray-700">
            I declare that all the information provided in this application is true and accurate to the best of my knowledge. 
            I understand that any false information may result in the rejection of my application or cancellation of the scholarship. 
            I agree to the terms and conditions of the scholarship program.
          </label>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
