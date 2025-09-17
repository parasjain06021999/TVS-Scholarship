'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FileUpload } from '../../ui/FileUpload';

const DocumentsStep: React.FC = () => {
  const { setValue, watch, formState: { errors } } = useFormContext();
  const documents = watch('documents') || [];

  const requiredDocuments = [
    { type: 'PHOTOGRAPH', name: 'Passport Size Photograph', required: true },
    { type: 'AADHAR_CARD', name: 'Aadhar Card', required: true },
    { type: 'PAN_CARD', name: 'PAN Card', required: true },
    { type: 'MARK_SHEET_10TH', name: '10th Marksheet', required: true },
    { type: 'MARK_SHEET_12TH', name: '12th Marksheet', required: true },
    { type: 'DEGREE_CERTIFICATE', name: 'Degree Certificate', required: true },
    { type: 'INCOME_CERTIFICATE', name: 'Income Certificate', required: true },
    { type: 'BANK_PASSBOOK', name: 'Bank Passbook', required: true },
  ];

  const handleFileUpload = (files: any[]) => {
    const newDocuments = files.map(file => ({
      type: file.type,
      file: file,
      fileName: file.name,
      fileSize: file.size,
      isVerified: false,
    }));
    
    setValue('documents', [...documents, ...newDocuments]);
  };

  const removeDocument = (index: number) => {
    const newDocuments = documents.filter((_: any, i: number) => i !== index);
    setValue('documents', newDocuments);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
        <p className="mt-2 text-gray-600">Please upload all required documents</p>
      </div>

      <FileUpload
        acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
        maxSize={5 * 1024 * 1024} // 5MB
        onUpload={handleFileUpload}
        multiple={true}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requiredDocuments.map((doc, index) => {
            const uploadedDoc = documents.find((d: any) => d.type === doc.type);
            
            return (
              <div
                key={doc.type}
                className={`border rounded-lg p-4 ${
                  uploadedDoc ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    <p className="text-sm text-gray-500">
                      {doc.required ? 'Required' : 'Optional'}
                    </p>
                  </div>
                  
                  {uploadedDoc ? (
                    <div className="flex items-center text-green-600">
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Uploaded</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400">
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Pending</span>
                    </div>
                  )}
                </div>
                
                {uploadedDoc && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-gray-600">{uploadedDoc.fileName}</span>
                    <button
                      type="button"
                      onClick={() => removeDocument(documents.indexOf(uploadedDoc))}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {errors.documents && (
        <div className="text-red-600 text-sm mt-2">
          {(errors.documents as any)?.message}
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Document Requirements
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>All documents must be clear and legible</li>
                <li>File size should not exceed 5MB per document</li>
                <li>Supported formats: JPG, PNG, PDF</li>
                <li>Documents will be verified before approval</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsStep;
