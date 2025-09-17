'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params as any)?.id;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      router.push('/admin/login');
      return;
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://tvs-scholarship-a1fi.vercel.app/applications?id=${encodeURIComponent(String(id))}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const response = await res.json();
        console.log('API Response:', response); // Debug log
        
        // Handle different response formats
        let app;
        if (response.applications && Array.isArray(response.applications)) {
          // Response has applications array
          app = response.applications.find((a: any) => a.id === id);
        } else if (Array.isArray(response)) {
          // Response is direct array
          app = response.find((a: any) => a.id === id);
        } else {
          // Response is direct object
          app = response;
        }
        
        if (!app || !app.id) {
          console.log('App not found, trying direct endpoint...');
          // Fallback to direct by-id endpoint
          const res2 = await fetch(`https://tvs-scholarship-a1fi.vercel.app/applications/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          if (res2.ok) {
            const directApp = await res2.json();
            setData(directApp);
            return;
          }
          throw new Error('Application not found');
        }
        setData(app);
      } else {
        // Fallback direct by-id endpoint
        const res2 = await fetch(`https://tvs-scholarship-a1fi.vercel.app/applications/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res2.ok) {
          const app = await res2.json();
          setData(app);
        } else {
          throw new Error('Application not found');
        }
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg text-gray-600 mt-4">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <button onClick={() => router.back()} className="mb-4 text-blue-600 hover:text-blue-800">← Back</button>
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Details</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Student</h2>
                <p className="text-gray-700">{data?.student?.firstName} {data?.student?.lastName}</p>
                <p className="text-gray-600 text-sm">{data?.student?.email}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Scholarship</h2>
                <p className="text-gray-700">{data?.scholarship?.title}</p>
                <p className="text-gray-600 text-sm">Status: {data?.status}</p>
              </div>
            </div>

            {/* Application Data */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Application Information</h2>
              
              {/* Personal Information */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Personal Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Name:</span>
                      <p className="text-gray-900">{data?.applicationData?.personalInfo?.firstName} {data?.applicationData?.personalInfo?.lastName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Gender:</span>
                      <p className="text-gray-900">{data?.applicationData?.personalInfo?.gender}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Category:</span>
                      <p className="text-gray-900">{data?.applicationData?.personalInfo?.category}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Date of Birth:</span>
                      <p className="text-gray-900">{new Date(data?.applicationData?.personalInfo?.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Aadhaar Number:</span>
                      <p className="text-gray-900">{data?.applicationData?.personalInfo?.aadhaarNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Information */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Education Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Current Course:</span>
                      <p className="text-gray-900">{data?.applicationData?.educationInfo?.currentCourse}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Current Year:</span>
                      <p className="text-gray-900">{data?.applicationData?.educationInfo?.currentYear}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Institution:</span>
                      <p className="text-gray-900">{data?.applicationData?.educationInfo?.currentInstitution}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">CGPA:</span>
                      <p className="text-gray-900">{data?.applicationData?.educationInfo?.cgpa}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Education Level:</span>
                      <p className="text-gray-900">{data?.applicationData?.educationInfo?.educationLevel}</p>
                    </div>
                  </div>
                  
                  {/* Previous Education */}
                  {data?.applicationData?.educationInfo?.previousEducation && (
                    <div className="mt-4">
                      <span className="text-sm font-medium text-gray-600">Previous Education:</span>
                      <div className="mt-2">
                        {data.applicationData.educationInfo.previousEducation.map((edu: any, index: number) => (
                          <div key={index} className="bg-white p-3 rounded border mb-2">
                            <p><span className="font-medium">Year:</span> {edu.year}</p>
                            <p><span className="font-medium">Board:</span> {edu.board}</p>
                            <p><span className="font-medium">Level:</span> {edu.level}</p>
                            <p><span className="font-medium">Percentage:</span> {edu.percentage}%</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Family Information */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Family Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Family Size:</span>
                      <p className="text-gray-900">{data?.applicationData?.familyInfo?.familySize}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Family Income:</span>
                      <p className="text-gray-900">₹{data?.applicationData?.familyInfo?.familyIncome?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Father's Name:</span>
                      <p className="text-gray-900">{data?.applicationData?.familyInfo?.fatherName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Father's Occupation:</span>
                      <p className="text-gray-900">{data?.applicationData?.familyInfo?.fatherOccupation}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Father's Income:</span>
                      <p className="text-gray-900">₹{data?.applicationData?.familyInfo?.fatherIncome?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Mother's Name:</span>
                      <p className="text-gray-900">{data?.applicationData?.familyInfo?.motherName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Mother's Occupation:</span>
                      <p className="text-gray-900">{data?.applicationData?.familyInfo?.motherOccupation}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Mother's Income:</span>
                      <p className="text-gray-900">₹{data?.applicationData?.familyInfo?.motherIncome?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Bank Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Bank Name:</span>
                      <p className="text-gray-900">{data?.applicationData?.bankDetails?.bankName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">IFSC Code:</span>
                      <p className="text-gray-900">{data?.applicationData?.bankDetails?.ifscCode}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Branch Name:</span>
                      <p className="text-gray-900">{data?.applicationData?.bankDetails?.branchName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Account Number:</span>
                      <p className="text-gray-900">{data?.applicationData?.bankDetails?.accountNumber}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Account Holder Name:</span>
                      <p className="text-gray-900">{data?.applicationData?.bankDetails?.accountHolderName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Status & Timeline */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Application Timeline</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        data?.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        data?.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        data?.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {data?.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Submitted At:</span>
                      <p className="text-gray-900">{new Date(data?.submittedAt).toLocaleString()}</p>
                    </div>
                    {data?.reviewedAt && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Reviewed At:</span>
                        <p className="text-gray-900">{new Date(data.reviewedAt).toLocaleString()}</p>
                      </div>
                    )}
                    {data?.approvedAt && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Approved At:</span>
                        <p className="text-gray-900">{new Date(data.approvedAt).toLocaleString()}</p>
                      </div>
                    )}
                    {data?.rejectedAt && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Rejected At:</span>
                        <p className="text-gray-900">{new Date(data.rejectedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              {data?.payments && data.payments.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Payment Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {data.payments.map((payment: any, index: number) => (
                      <div key={index} className="bg-white p-3 rounded border mb-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-600">Amount:</span>
                            <p className="text-gray-900">₹{payment.amount?.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Status:</span>
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
                            <span className="text-sm font-medium text-gray-600">Payment Method:</span>
                            <p className="text-gray-900">{payment.paymentMethod}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Transaction ID:</span>
                            <p className="text-gray-900">{payment.transactionId}</p>
                          </div>
                          {payment.paymentDate && (
                            <div>
                              <span className="text-sm font-medium text-gray-600">Payment Date:</span>
                              <p className="text-gray-900">{new Date(payment.paymentDate).toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {data?.documents && data.documents.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Documents</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {data.documents.map((doc: any, index: number) => (
                      <div key={index} className="bg-white p-3 rounded border mb-2">
                        <p><span className="font-medium">Type:</span> {doc.type}</p>
                        <p><span className="font-medium">Status:</span> {doc.status}</p>
                        {doc.fileName && <p><span className="font-medium">File:</span> {doc.fileName}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {(data?.reviewerNotes || data?.adminNotes || data?.remarks) && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Notes & Remarks</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    {data.reviewerNotes && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Reviewer Notes:</span>
                        <p className="text-gray-900 mt-1">{data.reviewerNotes}</p>
                      </div>
                    )}
                    {data.adminNotes && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Admin Notes:</span>
                        <p className="text-gray-900 mt-1">{data.adminNotes}</p>
                      </div>
                    )}
                    {data.remarks && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Remarks:</span>
                        <p className="text-gray-900 mt-1">{data.remarks}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


