'use client';

import React, { useState } from 'react';
import { ChartBarIcon, DocumentArrowDownIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface ReportBuilderProps {
  onGenerateReport: (config: ReportConfig) => void;
}

interface ReportConfig {
  type: string;
  filters: {
    startDate?: string;
    endDate?: string;
    state?: string;
    scholarshipId?: string;
    applicationStatus?: string;
    gender?: string;
    category?: string;
  };
  format: 'CSV' | 'EXCEL' | 'PDF';
}

const ReportBuilder: React.FC<ReportBuilderProps> = ({ onGenerateReport }) => {
  const [config, setConfig] = useState<ReportConfig>({
    type: 'applications',
    filters: {},
    format: 'CSV',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { id: 'applications', name: 'Application Report', description: 'Comprehensive application analytics' },
    { id: 'scholarships', name: 'Scholarship Report', description: 'Scholarship performance metrics' },
    { id: 'financial', name: 'Financial Report', description: 'Payment and disbursement data' },
    { id: 'demographics', name: 'Demographic Report', description: 'Student demographic analysis' },
    { id: 'performance', name: 'Performance Report', description: 'System performance metrics' },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerateReport(config);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value || undefined,
      },
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <ChartBarIcon className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Report Builder</h2>
      </div>

      <div className="space-y-6">
        {/* Report Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Report Type
          </label>
          <div className="grid grid-cols-1 gap-3">
            {reportTypes.map((type) => (
              <label
                key={type.id}
                className={`relative flex cursor-pointer rounded-lg p-4 border-2 ${
                  config.type === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="reportType"
                  value={type.id}
                  checked={config.type === type.id}
                  onChange={(e) => setConfig(prev => ({ ...prev, type: e.target.value }))}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{type.name}</p>
                      <p className="text-gray-500">{type.description}</p>
                    </div>
                  </div>
                </div>
                {config.type === type.id && (
                  <div className="flex-shrink-0 text-blue-600">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={config.filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={config.filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <select
              value={config.filters.state || ''}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All States</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Kerala">Kerala</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="West Bengal">West Bengal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application Status
            </label>
            <select
              value={config.filters.applicationStatus || ''}
              onChange={(e) => handleFilterChange('applicationStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={config.filters.gender || ''}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={config.filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="GENERAL">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
            </select>
          </div>
        </div>

        {/* Export Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Export Format
          </label>
          <div className="flex space-x-4">
            {['CSV', 'EXCEL', 'PDF'].map((format) => (
              <label
                key={format}
                className={`flex items-center space-x-2 cursor-pointer ${
                  config.format === format ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value={format}
                  checked={config.format === format}
                  onChange={(e) => setConfig(prev => ({ ...prev, format: e.target.value as any }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">{format}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;
