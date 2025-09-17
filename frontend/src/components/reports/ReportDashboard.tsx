'use client';

import React, { useState, useEffect } from 'react';
import { ChartBarIcon, DocumentArrowDownIcon, CalendarIcon, UsersIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import ReportBuilder from './ReportBuilder';

interface DashboardData {
  summary: {
    totalApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    pendingApplications: number;
    totalAmount: number;
    disbursedAmount: number;
    pendingAmount: number;
  };
  trends: {
    applicationsOverTime: Array<{ date: string; count: number }>;
    approvalsOverTime: Array<{ date: string; count: number }>;
    disbursementsOverTime: Array<{ date: string; amount: number }>;
  };
  demographics: {
    byState: Array<{ state: string; count: number; percentage: number }>;
    byGender: Array<{ gender: string; count: number; percentage: number }>;
    byCategory: Array<{ category: string; count: number; percentage: number }>;
  };
  performance: {
    averageProcessingTime: number;
    approvalRate: number;
    rejectionRate: number;
  };
}

const ReportDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReportBuilder, setShowReportBuilder] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports/dashboard');
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (config: any) => {
    try {
      const response = await fetch('/api/reports/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report.${config.format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ChartBarIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        </div>
        <button
          onClick={() => setShowReportBuilder(!showReportBuilder)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
          Generate Report
        </button>
      </div>

      {/* Report Builder */}
      {showReportBuilder && (
        <div className="mb-6">
          <ReportBuilder onGenerateReport={handleGenerateReport} />
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Applications</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData.summary.totalApplications.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData.summary.approvedApplications.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">⏳</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData.summary.pendingApplications.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{dashboardData.summary.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Over Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Applications Over Time</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 mx-auto mb-2" />
              <p>Chart would be rendered here</p>
            </div>
          </div>
        </div>

        {/* State Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Applications by State</h3>
          <div className="space-y-3">
            {dashboardData.demographics.byState.slice(0, 5).map((item, index) => (
              <div key={item.state} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.state}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {dashboardData.performance.approvalRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Approval Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">
              {dashboardData.performance.rejectionRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Rejection Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {dashboardData.performance.averageProcessingTime.toFixed(1)} days
            </p>
            <p className="text-sm text-gray-500">Avg. Processing Time</p>
          </div>
        </div>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Gender Distribution</h3>
          <div className="space-y-3">
            {dashboardData.demographics.byGender.map((item) => (
              <div key={item.gender} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{item.gender.toLowerCase()}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pink-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {dashboardData.demographics.byCategory.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;
