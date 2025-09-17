'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface ScholarshipFormData {
  title: string;
  description: string;
  category: string;
  amount: number;
  applicationStartDate: string;
  applicationEndDate: string;
  eligibilityCriteria: string;
  documentsRequired: string[];
  academicYear: string;
  isActive: boolean;
}

export default function EditScholarshipPage() {
  const [formData, setFormData] = useState<ScholarshipFormData>({
    title: '',
    description: '',
    category: 'MERIT_BASED',
    amount: 0,
    applicationStartDate: '',
    applicationEndDate: '',
    eligibilityCriteria: '',
    documentsRequired: [],
    academicYear: new Date().getFullYear().toString(),
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
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
      setFetching(true);
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
      const data = result.success ? result.data : result;
      
      // Populate form with existing data
      setFormData({
        title: data.title || '',
        description: data.description || '',
        category: data.category || 'MERIT_BASED',
        amount: data.amount || 0,
        applicationStartDate: data.applicationStartDate ? new Date(data.applicationStartDate).toISOString().split('T')[0] : '',
        applicationEndDate: data.applicationEndDate ? new Date(data.applicationEndDate).toISOString().split('T')[0] : '',
        eligibilityCriteria: data.eligibilityCriteria || '',
        documentsRequired: data.documentsRequired || [],
        academicYear: data.academicYear || new Date().getFullYear().toString(),
        isActive: data.isActive !== undefined ? data.isActive : true,
      });
    } catch (err: any) {
      console.error('Error fetching scholarship:', err);
      setError(err.message || 'Failed to fetch scholarship details');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleDocumentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const documents = e.target.value.split('\n').filter(doc => doc.trim() !== '');
    setFormData(prev => ({
      ...prev,
      documentsRequired: documents
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (!user) {
        throw new Error('No user data found');
      }

      const userData = JSON.parse(user);
      
      if (userData.role !== 'ADMIN' && userData.role !== 'SUPER_ADMIN') {
        throw new Error('Admin or Super Admin access required');
      }

      const response = await fetch(`http://localhost:3001/scholarships/${scholarshipId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to update scholarship`);
      }

      const result = await response.json();
      
      // Redirect to scholarship details
      router.push(`/admin/scholarships/${scholarshipId}`);
    } catch (err: any) {
      console.error('Error updating scholarship:', err);
      setError(err.message || 'Failed to update scholarship');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-lg text-gray-600 mt-4">Loading scholarship details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="text-indigo-600 hover:text-indigo-900 mb-4 flex items-center"
            >
              ← Back to Scholarship Details
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Scholarship</h1>
            <p className="text-gray-600 mt-2">Update the scholarship details</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Scholarship Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., TVS Merit Scholarship 2024"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe the scholarship program, its purpose, and benefits..."
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="MERIT_BASED">Merit Based</option>
                  <option value="NEED_BASED">Need Based</option>
                  <option value="MINORITY">Minority</option>
                  <option value="SPORTS">Sports</option>
                  <option value="ARTS">Arts</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Scholarship Amount (₹) *
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="50000"
                />
              </div>

              {/* Application Start Date */}
              <div>
                <label htmlFor="applicationStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Application Start Date *
                </label>
                <input
                  type="date"
                  id="applicationStartDate"
                  name="applicationStartDate"
                  value={formData.applicationStartDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Application End Date */}
              <div>
                <label htmlFor="applicationEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Application End Date *
                </label>
                <input
                  type="date"
                  id="applicationEndDate"
                  name="applicationEndDate"
                  value={formData.applicationEndDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Academic Year */}
              <div>
                <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year *
                </label>
                <input
                  type="text"
                  id="academicYear"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="2024-25"
                />
              </div>

              {/* Eligibility Criteria */}
              <div className="md:col-span-2">
                <label htmlFor="eligibilityCriteria" className="block text-sm font-medium text-gray-700 mb-2">
                  Eligibility Criteria *
                </label>
                <textarea
                  id="eligibilityCriteria"
                  name="eligibilityCriteria"
                  value={formData.eligibilityCriteria}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="List the eligibility requirements (e.g., minimum percentage, income criteria, etc.)"
                />
              </div>

              {/* Required Documents */}
              <div className="md:col-span-2">
                <label htmlFor="documentsRequired" className="block text-sm font-medium text-gray-700 mb-2">
                  Required Documents *
                </label>
                <textarea
                  id="documentsRequired"
                  name="documentsRequired"
                  value={formData.documentsRequired.join('\n')}
                  onChange={handleDocumentsChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="List the required documents (one per line):&#10;Income certificate&#10;Mark sheets&#10;Identity proof"
                />
                <p className="text-sm text-gray-500 mt-1">Enter each document on a new line</p>
              </div>

              {/* Active Status */}
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Make this scholarship active (students can apply)
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Scholarship'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}



