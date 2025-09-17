'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  DocumentTextIcon,
  UserIcon,
  AcademicCapIcon,
  BanknotesIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface Application {
  id: string;
  student: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    city: string;
    state: string;
  };
  scholarship: {
    title: string;
    amount: number;
    category: string;
  };
  status: string;
  submittedAt: string;
  academicInfo: any;
  familyInfo: any;
  financialInfo: any;
  additionalInfo: any;
  documents: any[];
  reviewerNotes?: string;
  adminNotes?: string;
  score?: number;
}

interface ApplicationReviewProps {
  applicationId: string;
  onClose: () => void;
  onStatusChange: (applicationId: string, status: string) => void;
}

const ApplicationReview: React.FC<ApplicationReviewProps> = ({
  applicationId,
  onClose,
  onStatusChange,
}) => {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [score, setScore] = useState(0);
  const [action, setAction] = useState<'approve' | 'reject' | 'hold'>('approve');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/applications/${applicationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setApplication(data.data);
        setReviewerNotes(data.data.reviewerNotes || '');
        setAdminNotes(data.data.adminNotes || '');
        setScore(data.data.score || 0);
      }
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/applications/${applicationId}/review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          status: action === 'approve' ? 'APPROVED' : action === 'reject' ? 'REJECTED' : 'ON_HOLD',
          reviewerNotes,
          adminNotes,
          score,
        }),
      });

      if (response.ok) {
        onStatusChange(applicationId, action === 'approve' ? 'APPROVED' : action === 'reject' ? 'REJECTED' : 'ON_HOLD');
        onClose();
      }
    } catch (error) {
      console.error('Error updating application:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Application not found</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Application Review</h2>
              <p className="text-gray-600">
                {application.student.firstName} {application.student.lastName} - {application.scholarship.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-8">
            {/* Student Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserIcon className="w-5 h-5 mr-2" />
                Student Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">
                    {application.student.firstName} {application.student.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{application.student.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{application.student.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-gray-900">{formatDate(application.student.dateOfBirth)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-gray-900">{application.student.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">
                    {application.student.address}, {application.student.city}, {application.student.state}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AcademicCapIcon className="w-5 h-5 mr-2" />
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Course</label>
                  <p className="text-gray-900">{application.academicInfo?.courseOfStudy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Current Year</label>
                  <p className="text-gray-900">{application.academicInfo?.currentYear}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">University</label>
                  <p className="text-gray-900">{application.academicInfo?.universityName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Percentage</label>
                  <p className="text-gray-900">{application.academicInfo?.academicPercentage}%</p>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BanknotesIcon className="w-5 h-5 mr-2" />
                Financial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Family Income</label>
                  <p className="text-gray-900">{formatCurrency(application.familyInfo?.familyIncome || 0)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Family Size</label>
                  <p className="text-gray-900">{application.familyInfo?.familySize}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Bank Name</label>
                  <p className="text-gray-900">{application.financialInfo?.bankName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Account Number</label>
                  <p className="text-gray-900">{application.financialInfo?.accountNumber}</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {application.documents?.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.originalName}</p>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doc.isVerified ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      ) : (
                        <ClockIcon className="w-5 h-5 text-yellow-500" />
                      )}
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Decision</h3>
              
              <div className="space-y-6">
                {/* Score */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Score (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Action */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decision
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="approve"
                        checked={action === 'approve'}
                        onChange={(e) => setAction(e.target.value as any)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Approve</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="reject"
                        checked={action === 'reject'}
                        onChange={(e) => setAction(e.target.value as any)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Reject</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="hold"
                        checked={action === 'hold'}
                        onChange={(e) => setAction(e.target.value as any)}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Hold</span>
                    </label>
                  </div>
                </div>

                {/* Reviewer Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reviewer Notes
                  </label>
                  <textarea
                    value={reviewerNotes}
                    onChange={(e) => setReviewerNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your review notes..."
                  />
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter admin notes..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-6 py-2 text-white rounded-md ${
              action === 'approve'
                ? 'bg-green-600 hover:bg-green-700'
                : action === 'reject'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-yellow-600 hover:bg-yellow-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {submitting ? 'Processing...' : `${action.charAt(0).toUpperCase() + action.slice(1)} Application`}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ApplicationReview;
