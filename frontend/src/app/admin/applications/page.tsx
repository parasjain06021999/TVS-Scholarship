'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

interface Application {
  id: string;
  studentId: string;
  scholarshipId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  submittedAt: string;
  reviewedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  applicationData: {
    personalInfo: {
      firstName: string;
      lastName: string;
      gender: string;
      category: string;
      dateOfBirth: string;
      aadhaarNumber: string;
    };
    educationInfo: {
      currentCourse: string;
      currentYear: number;
      currentInstitution: string;
      cgpa: number;
      educationLevel: string;
      previousEducation: Array<{
        year: number;
        board: string;
        level: string;
        percentage: number;
      }>;
    };
    familyInfo: {
      familySize: number;
      fatherName: string;
      motherName: string;
      familyIncome: number;
      fatherIncome: number;
      motherIncome: number;
      fatherOccupation: string;
      motherOccupation: string;
    };
    bankDetails: {
      bankName: string;
      ifscCode: string;
      branchName: string;
      accountNumber: string;
      accountHolderName: string;
    };
  };
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
  };
  scholarship: {
    id: string;
    title: string;
    amount: number;
    maxAmount: number;
  };
  documents: Array<{
    id: string;
    type: string;
    fileName: string;
    status: string;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    status: string;
    paymentMethod: string;
    transactionId: string;
  }>;
  reviewerNotes?: string;
  adminNotes?: string;
  remarks?: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('NEFT');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'MISSING_DOCUMENTS' | 'INCOMPLETE_INFO' | 'OTHER'>('MISSING_DOCUMENTS');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/admin/login');
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== 'ADMIN' && userData.role !== 'REVIEWER' && userData.role !== 'SUPER_ADMIN') {
      router.push('/admin/login');
      return;
    }

    fetchApplications();
  }, [router]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      // Fetch real data from backend
      const response = await apiClient.request('/applications?page=1&limit=50');
      console.log('API Response:', response);
      
      // Handle different response structures
      let applicationsData = [];
      if (response.data && response.data.applications) {
        applicationsData = response.data.applications;
      } else if (response.applications) {
        applicationsData = response.applications;
      } else if (Array.isArray(response)) {
        applicationsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        applicationsData = response.data;
      }
      
      console.log('Applications data:', applicationsData);
      setApplications(applicationsData);
    } catch (err: any) {
      console.error('Failed to fetch applications:', err);
      setError(err.message || 'Failed to fetch applications');
      
      // Fallback to mock data if API fails
      const mockApplications: Application[] = [
        {
          id: '1',
          studentId: 'mock-student-1',
          scholarshipId: 'mock-scholarship-1',
          status: 'PENDING',
          submittedAt: '2024-01-15T10:30:00Z',
          applicationData: {
            personalInfo: {
              firstName: 'Rajesh',
              lastName: 'Kumar',
              gender: 'MALE',
              category: 'GENERAL',
              dateOfBirth: '2005-03-15T00:00:00.000Z',
              aadhaarNumber: '****-****-1234'
            },
            educationInfo: {
              currentCourse: 'B.Tech Computer Science',
              currentYear: 2,
              currentInstitution: 'IIT Delhi',
              cgpa: 8.2,
              educationLevel: 'undergraduate',
              previousEducation: [{
                year: 2023,
                board: 'CBSE',
                level: 'class_12',
                percentage: 89.5
              }]
            },
            familyInfo: {
              familySize: 4,
              fatherName: 'Suresh Kumar',
              motherName: 'Lakshmi Kumar',
              familyIncome: 180000,
              fatherIncome: 180000,
              motherIncome: 0,
              fatherOccupation: 'Auto Driver',
              motherOccupation: 'Homemaker'
            },
            bankDetails: {
              bankName: 'State Bank of India',
              ifscCode: 'SBIN0001234',
              branchName: 'Chennai Main Branch',
              accountNumber: '****-****-****-3456',
              accountHolderName: 'Rajesh Kumar'
            }
          },
          student: {
            id: 'mock-student-1',
            firstName: 'Rajesh',
            lastName: 'Kumar',
            email: 'rajesh@example.com',
            phone: '+91-9876543210'
          },
          scholarship: {
            id: 'mock-scholarship-1',
            title: 'TVS Merit Scholarship 2024',
            amount: 50000,
            maxAmount: 60000
          },
          documents: [],
          payments: []
        }
      ];
      setApplications(mockApplications);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (application: Application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const handleApprove = async (applicationId: string) => {
    try {
      await apiClient.request(`/applications/${applicationId}/approve`, {
        method: 'POST'
      });
      alert('Application approved successfully!');
      setShowModal(false);
      fetchApplications();
    } catch (error: any) {
      console.error('Failed to approve application:', error);
      alert('Failed to approve application: ' + (error.message || 'Unknown error'));
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await apiClient.request(`/applications/${applicationId}/reject`, {
        method: 'POST',
        body: JSON.stringify({
          rejectionReason: reviewNotes || 'Application rejected by admin'
        })
      });
      alert('Application rejected');
      setShowModal(false);
      setReviewNotes('');
      fetchApplications();
    } catch (error: any) {
      console.error('Failed to reject application:', error);
      alert('Failed to reject application: ' + (error.message || 'Unknown error'));
    }
  };

  const handleMoveToUnderReview = async (applicationId: string) => {
    try {
      await apiClient.request(`/applications/${applicationId}/review`, {
        method: 'POST',
        body: JSON.stringify({
          status: 'UNDER_REVIEW',
          reviewerNotes: reviewNotes || 'Application moved to under review'
        })
      });
      alert('Application moved to under review');
      setShowModal(false);
      setReviewNotes('');
      fetchApplications();
    } catch (error: any) {
      console.error('Failed to move application to under review:', error);
      alert('Failed to move application: ' + (error.message || 'Unknown error'));
    }
  };

  const handleSendFeedback = async () => {
    if (!selectedApplication || !feedbackMessage.trim()) {
      alert('Please enter feedback message');
      return;
    }

    try {
      // Send feedback to student
      const response = await fetch(`http://localhost:3001/applications/${selectedApplication.id}/feedback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: selectedApplication.id,
          type: feedbackType,
          message: feedbackMessage,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send feedback');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to send feedback');
      }
      
      alert('Feedback sent to student successfully!');
      setShowFeedbackModal(false);
      setFeedbackMessage('');
      setFeedbackType('MISSING_DOCUMENTS');
    } catch (error: any) {
      console.error('Failed to send feedback:', error);
      alert('Failed to send feedback: ' + (error.message || 'Unknown error'));
    }
  };

  const handlePayment = (application: Application) => {
    setSelectedApplication(application);
    const existingPayment = application.payments && application.payments.length > 0 ? application.payments[0] : null;
    setSelectedPayment(existingPayment);
    
    if (existingPayment) {
      setPaymentAmount(existingPayment.amount);
      setPaymentMethod(existingPayment.paymentMethod);
    } else {
      setPaymentAmount(application.scholarship.amount);
      setPaymentMethod('NEFT');
    }
    
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    if (!selectedApplication) return;
    
    try {
      if (selectedPayment) {
        // Update existing payment
        await apiClient.request(`/payments/${selectedPayment.id}/status`, {
          method: 'PUT',
          body: JSON.stringify({
            status: 'COMPLETED',
            notes: 'Payment completed by admin'
          })
        });
        alert('Payment status updated successfully!');
      } else {
        // Create new payment
        await apiClient.request(`/payments`, {
          method: 'POST',
          body: JSON.stringify({
            applicationId: selectedApplication.id,
            amount: paymentAmount,
            paymentMethod: paymentMethod,
            status: 'PENDING'
          })
        });
        alert('Payment initiated successfully!');
      }
      setShowPaymentModal(false);
      fetchApplications();
    } catch (error: any) {
      console.error('Failed to process payment:', error);
      alert('Failed to process payment: ' + (error.message || 'Unknown error'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Application Review</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Applications Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scholarship
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.student.firstName} {application.student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.student.email || application.student.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.scholarship.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{application.scholarship.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {application.payments && application.payments.length > 0 ? (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          application.payments[0].status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          application.payments[0].status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          application.payments[0].status === 'FAILED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {application.payments[0].status}
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          No Payment
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleReview(application)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Review
                      </button>
                      
                      {/* Only show approve/reject buttons for pending and under_review applications */}
                      {application.status === 'PENDING' || application.status === 'UNDER_REVIEW' ? (
                        <>
                          <button
                            onClick={() => handleApprove(application.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(application.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      ) : application.status === 'APPROVED' ? (
                        <div className="space-x-2">
                          {(!application.payments || application.payments.length === 0) ? (
                            <button
                              onClick={() => handlePayment(application)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Process Payment
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePayment(application)}
                              className="text-green-600 hover:text-green-900"
                            >
                              View Payment
                            </button>
                          )}
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Review Modal */}
          {showModal && selectedApplication && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Review Application - {selectedApplication.studentName}
                    </h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Student Name</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.student.firstName} {selectedApplication.student.lastName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Contact</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.student.email || selectedApplication.student.phone}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Application Status</label>
                        <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedApplication.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          selectedApplication.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          selectedApplication.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedApplication.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Scholarship</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.scholarship.title}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Academic Information</label>
                      <div className="mt-1 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Institution:</span> {selectedApplication.academicInfo?.collegeName || selectedApplication.applicationData?.educationInfo?.currentInstitution || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Course:</span> {selectedApplication.academicInfo?.courseOfStudy || selectedApplication.applicationData?.educationInfo?.currentCourse || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Year:</span> {selectedApplication.academicInfo?.currentYear || selectedApplication.applicationData?.educationInfo?.currentYear || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">CGPA:</span> {selectedApplication.academicInfo?.academicPercentage || selectedApplication.applicationData?.educationInfo?.cgpa || 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Financial Information</label>
                      <div className="mt-1 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Family Income:</span> ₹{(selectedApplication.familyInfo?.familyIncome || selectedApplication.applicationData?.familyInfo?.familyIncome)?.toLocaleString() || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Bank:</span> {selectedApplication.financialInfo?.bankName || selectedApplication.applicationData?.bankDetails?.bankName || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Father's Occupation:</span> {selectedApplication.familyInfo?.fatherOccupation || selectedApplication.applicationData?.familyInfo?.fatherOccupation || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Mother's Occupation:</span> {selectedApplication.familyInfo?.motherOccupation || selectedApplication.applicationData?.familyInfo?.motherOccupation || 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Documents</label>
                      <div className="mt-1 space-y-1">
                        {selectedApplication.documents && selectedApplication.documents.length > 0 ? (
                          selectedApplication.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">📄</span>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{doc.fileName || doc.originalName}</p>
                                  <p className="text-xs text-gray-500">Type: {doc.type}</p>
                                  <p className="text-xs text-gray-400">Size: {(doc.fileSize / 1024).toFixed(1)} KB</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  doc.isVerified ? 'bg-green-100 text-green-800' :
                                  doc.rejectionReason ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {doc.isVerified ? 'VERIFIED' : doc.rejectionReason ? 'REJECTED' : 'PENDING'}
                                </span>
                                <a 
                                  href={`${'https://tvs-scholarship.onrender.com'}${doc.filePath}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  View
                                </a>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 bg-gray-50 rounded border text-center">
                            <p className="text-sm text-gray-500">No documents uploaded</p>
                            <p className="text-xs text-gray-400 mt-1">Student has not uploaded any documents yet</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Show review notes for pending, under_review, and submitted applications */}
                    {(selectedApplication.status === 'PENDING' || selectedApplication.status === 'UNDER_REVIEW' || selectedApplication.status === 'SUBMITTED') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Review Notes</label>
                        <textarea
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Add your review notes here..."
                        />
                      </div>
                    )}

                    {/* Show existing notes for approved/rejected applications */}
                    {(selectedApplication.status === 'APPROVED' || selectedApplication.status === 'REJECTED') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Application Notes</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-md">
                          {selectedApplication.reviewerNotes && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-gray-600">Reviewer Notes:</span>
                              <p className="text-sm text-gray-900 mt-1">{selectedApplication.reviewerNotes}</p>
                            </div>
                          )}
                          {selectedApplication.adminNotes && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-gray-600">Admin Notes:</span>
                              <p className="text-sm text-gray-900 mt-1">{selectedApplication.adminNotes}</p>
                            </div>
                          )}
                          {selectedApplication.remarks && (
                            <div>
                              <span className="text-sm font-medium text-gray-600">Remarks:</span>
                              <p className="text-sm text-gray-900 mt-1">{selectedApplication.remarks}</p>
                            </div>
                          )}
                          {!selectedApplication.reviewerNotes && !selectedApplication.adminNotes && !selectedApplication.remarks && (
                            <p className="text-sm text-gray-500">No notes available</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                    
                    {/* Show action buttons for pending, under_review, and submitted applications */}
                    {(selectedApplication.status === 'PENDING' || selectedApplication.status === 'UNDER_REVIEW' || selectedApplication.status === 'SUBMITTED') && (
                      <>
                        <button
                          onClick={() => setShowFeedbackModal(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Send Feedback
                        </button>
                        {selectedApplication.status === 'SUBMITTED' && (
                          <button
                            onClick={() => handleMoveToUnderReview(selectedApplication.id)}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                          >
                            Move to Review
                          </button>
                        )}
                        <button
                          onClick={() => handleReject(selectedApplication.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(selectedApplication.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Approve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Modal */}
          {showPaymentModal && selectedApplication && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Process Payment - {selectedApplication.student.firstName} {selectedApplication.student.lastName}
                    </h3>
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Student Name</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.student.firstName} {selectedApplication.student.lastName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Scholarship</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedApplication.scholarship.title}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bank Details</label>
                        <div className="mt-1 text-sm text-gray-900">
                          <p><strong>Bank:</strong> {selectedApplication.applicationData.bankDetails.bankName}</p>
                          <p><strong>IFSC:</strong> {selectedApplication.applicationData.bankDetails.ifscCode}</p>
                          <p><strong>Account:</strong> {selectedApplication.applicationData.bankDetails.accountNumber}</p>
                          <p><strong>Holder:</strong> {selectedApplication.applicationData.bankDetails.accountHolderName}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Information</label>
                        <div className="mt-1 space-y-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-600">Amount (₹)</label>
                            <input
                              type="number"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(Number(e.target.value))}
                              disabled={selectedPayment}
                              className={`mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${selectedPayment ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600">Payment Method</label>
                            <select
                              value={paymentMethod}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              disabled={selectedPayment}
                              className={`mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${selectedPayment ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            >
                              <option value="NEFT">NEFT</option>
                              <option value="RTGS">RTGS</option>
                              <option value="IMPS">IMPS</option>
                              <option value="UPI">UPI</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Status */}
                    {selectedApplication.payments && selectedApplication.payments.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Previous Payments</label>
                        <div className="mt-1 space-y-2">
                          {selectedApplication.payments.map((payment, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded border">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Amount:</span> ₹{payment.amount.toLocaleString()}
                                </div>
                                <div>
                                  <span className="font-medium">Status:</span>
                                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                    payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    payment.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {payment.status}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium">Method:</span> {payment.paymentMethod}
                                </div>
                                <div>
                                  <span className="font-medium">Transaction ID:</span> {payment.transactionId}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={processPayment}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {selectedPayment ? 'Update Payment Status' : 'Initiate Payment'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Modal */}
          {showFeedbackModal && selectedApplication && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Send Feedback - {selectedApplication.student?.firstName} {selectedApplication.student?.lastName}
                    </h3>
                    <button
                      onClick={() => setShowFeedbackModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Feedback Type</label>
                      <select
                        value={feedbackType}
                        onChange={(e) => setFeedbackType(e.target.value as any)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="MISSING_DOCUMENTS">Missing Documents</option>
                        <option value="INCOMPLETE_INFO">Incomplete Information</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Feedback Message</label>
                      <textarea
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your feedback message for the student..."
                      />
                    </div>

                    <div className="bg-blue-50 p-3 rounded-md">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> This feedback will be sent to the student via email and will be visible in their application dashboard.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setShowFeedbackModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendFeedback}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Send Feedback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

