'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl, API_CONFIG } from '@/config/api';

interface Application {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  applicationData: {
    personalInfo: any;
    academicInfo: any;
    familyInfo: any;
    addressInfo: any;
    bankDetails: any;
    additionalInfo: any;
  };
  scholarship: {
    id: string;
    title: string;
    description: string;
    amount: number;
    deadline: string;
  };
  documents: any[];
  feedback: any[];
}

export default function ApplicationDetailsPage() {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.APPLICATIONS}/${applicationId}`), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch application details');
        }

        const data = await response.json();
        setApplication(data.data || data);
      } catch (err) {
        console.error('Error fetching application:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-green-800 bg-green-100';
      case 'UNDER_REVIEW': return 'text-yellow-800 bg-yellow-100';
      case 'PENDING': return 'text-blue-800 bg-blue-100';
      case 'REJECTED': return 'text-red-800 bg-red-100';
      case 'DISBURSED': return 'text-purple-800 bg-purple-100';
      default: return 'text-gray-800 bg-gray-100';
    }
  };

  const getProgressFromStatus = (status: string) => {
    switch (status) {
      case 'PENDING': return 25;
      case 'UNDER_REVIEW': return 60;
      case 'APPROVED': return 90;
      case 'DISBURSED': return 100;
      case 'REJECTED': return 0;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Not Found</h3>
          <p className="text-gray-600 mb-6">{error || 'The application you are looking for does not exist.'}</p>
          <Link 
            href="/dashboard"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">TVS Scholarship Portal</h1>
                  <p className="text-sm text-gray-500">Application Details</p>
                </div>
              </Link>
            </div>
            <Link 
              href="/dashboard"
              className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 py-2.5 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Application Header */}
          <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl mb-8 border border-gray-100">
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{application.scholarship?.title || 'Scholarship Application'}</h2>
                  <p className="text-gray-600 mt-1">Application ID: {application.id}</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                  {application.status.replace('_', ' ')}
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span className="font-medium">Application Progress</span>
                  <span className="font-semibold">{getProgressFromStatus(application.status)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressFromStatus(application.status)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{application.scholarship?.amount?.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-gray-500">Scholarship Amount</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {new Date(application.createdAt).toLocaleDateString('en-IN')}
                  </div>
                  <div className="text-sm text-gray-500">Applied Date</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {new Date(application.updatedAt).toLocaleDateString('en-IN')}
                  </div>
                  <div className="text-sm text-gray-500">Last Updated</div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-900">
                      {application.applicationData?.personalInfo?.firstName || 'N/A'} {application.applicationData?.personalInfo?.lastName || ''}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{application.applicationData?.personalInfo?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{application.applicationData?.personalInfo?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900">{application.applicationData?.personalInfo?.dateOfBirth || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender</label>
                    <p className="text-gray-900">{application.applicationData?.personalInfo?.gender || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Academic Information</h3>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Course</label>
                    <p className="text-gray-900">{application.academicInfo?.courseOfStudy || application.applicationData?.academicInfo?.courseOfStudy || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Year</label>
                    <p className="text-gray-900">{application.academicInfo?.currentYear || application.applicationData?.academicInfo?.currentYear || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">College/University</label>
                    <p className="text-gray-900">{application.academicInfo?.collegeName || application.applicationData?.academicInfo?.collegeName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Academic Percentage</label>
                    <p className="text-gray-900">{application.academicInfo?.academicPercentage || application.applicationData?.academicInfo?.academicPercentage || 'N/A'}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Family Information */}
            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Family Information</h3>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Family Size</label>
                    <p className="text-gray-900">{application.familyInfo?.familySize || application.applicationData?.familyInfo?.familySize || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Family Income</label>
                    <p className="text-gray-900">₹{application.familyInfo?.familyIncome?.toLocaleString() || application.applicationData?.familyInfo?.familyIncome?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Father's Name</label>
                    <p className="text-gray-900">{application.familyInfo?.fatherName || application.applicationData?.familyInfo?.fatherName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mother's Name</label>
                    <p className="text-gray-900">{application.familyInfo?.motherName || application.applicationData?.familyInfo?.motherName || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Bank Details</h3>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Bank Name</label>
                    <p className="text-gray-900">{application.applicationData?.bankDetails?.bankName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Number</label>
                    <p className="text-gray-900">{application.applicationData?.bankDetails?.accountNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">IFSC Code</label>
                    <p className="text-gray-900">{application.applicationData?.bankDetails?.ifscCode || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Branch Name</label>
                    <p className="text-gray-900">{application.applicationData?.bankDetails?.branchName || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          {application.documents && application.documents.length > 0 && (
            <div className="mt-8 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Uploaded Documents</h3>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {application.documents.map((doc, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{doc.fileName || `Document ${index + 1}`}</p>
                          <p className="text-xs text-gray-500">{doc.type || 'Document'}</p>
                        </div>
                        <a 
                          href={`${API_CONFIG.BASE_URL}${doc.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Feedback Section */}
          {application.feedback && application.feedback.length > 0 && (
            <div className="mt-8 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Feedback & Messages</h3>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  {application.feedback.map((feedback, index) => (
                    <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {feedback.type?.replace('_', ' ') || 'General Feedback'}
                            </span>
                            <span className="text-xs text-gray-500">
                              by {feedback.sender?.email || 'Admin'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(feedback.createdAt).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                          <p className="text-gray-700">{feedback.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
