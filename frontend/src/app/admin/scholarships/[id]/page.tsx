'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Scholarship {
  id: string;
  title: string;
  description?: string;
  category?: string;
  amount?: number;
  applicationStartDate?: string;
  applicationEndDate?: string;
  eligibilityCriteria?: string;
  documentsRequired?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ScholarshipViewPage() {
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toggling, setToggling] = useState(false);
  const router = useRouter();
  const params = useParams();
  const scholarshipId = params.id as string;

  useEffect(() => {
    if (scholarshipId) {
      fetchScholarship();
    }
  }, [scholarshipId]);

  const fetchScholarship = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:3001/scholarships/${scholarshipId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch scholarship details');
      }

      const result = await response.json();
      console.log('Scholarship API response:', result);
      
      // Handle the response format - it might be wrapped in a data property
      const data = result.success ? result.data : result;
      console.log('Scholarship data:', data);
      setScholarship(data);
    } catch (err: any) {
      console.error('Error fetching scholarship:', err);
      setError(err.message || 'Failed to fetch scholarship details');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    if (!scholarship) return;
    
    try {
      setToggling(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:3001/scholarships/${scholarshipId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update scholarship status');
      }

      // Refresh scholarship data
      await fetchScholarship();
    } catch (err: any) {
      console.error('Error toggling status:', err);
      setError(err.message || 'Failed to update scholarship status');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-lg text-gray-600 mt-4">Loading scholarship details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Scholarship Not Found</h2>
          <p className="text-gray-600 mb-4">The requested scholarship could not be found.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="text-indigo-600 hover:text-indigo-900 mb-4 flex items-center"
            >
              ← Back to Scholarships
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{scholarship.title}</h1>
                <p className="text-gray-600 mt-1">Scholarship Details</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  scholarship.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {scholarship.isActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={toggleStatus}
                  disabled={toggling}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    scholarship.isActive
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {toggling ? 'Updating...' : scholarship.isActive ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </div>

          {/* Scholarship Details */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">
                    {scholarship.category ? scholarship.category.replace('_', ' ').toLowerCase() : 'Not specified'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Scholarship Amount</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-semibold">
                    ₹{scholarship.amount ? scholarship.amount.toLocaleString() : 'Not specified'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Application Start Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {scholarship.applicationStartDate ? new Date(scholarship.applicationStartDate).toLocaleDateString() : 'Not specified'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Application End Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {scholarship.applicationEndDate ? new Date(scholarship.applicationEndDate).toLocaleDateString() : 'Not specified'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {scholarship.createdAt ? new Date(scholarship.createdAt).toLocaleDateString() : 'Not specified'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {scholarship.updatedAt ? new Date(scholarship.updatedAt).toLocaleDateString() : 'Not specified'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-6">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{scholarship.description || 'No description provided'}</p>
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-6">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Eligibility Criteria</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{scholarship.eligibilityCriteria || 'No eligibility criteria provided'}</p>
            </div>
          </div>

          {/* Required Documents */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-6">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Required Documents</h2>
            </div>
            <div className="px-6 py-4">
              {scholarship.documentsRequired && scholarship.documentsRequired.length > 0 ? (
                <ul className="text-sm text-gray-900 space-y-1">
                  {scholarship.documentsRequired.map((doc, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {doc}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No required documents specified</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Back to List
            </button>
            <button
              onClick={() => router.push(`/admin/scholarships/${scholarshipId}/edit`)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              ✏️ Edit Scholarship
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
