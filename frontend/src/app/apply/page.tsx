'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface Scholarship {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  applicationEndDate: string;
  eligibilityCriteria: string;
}

export default function ApplyPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - replace with actual API call
      const mockScholarships: Scholarship[] = [
        {
          id: '1',
          title: 'TVS Merit Scholarship 2024',
          description: 'For students with outstanding academic performance and leadership qualities',
          amount: 50000,
          category: 'Merit-based',
          applicationEndDate: '2024-12-31',
          eligibilityCriteria: 'Minimum 80% marks in previous year, active participation in extracurricular activities'
        },
        {
          id: '2',
          title: 'TVS Need-based Scholarship 2024',
          description: 'For students from economically weaker sections with good academic record',
          amount: 25000,
          category: 'Need-based',
          applicationEndDate: '2024-12-31',
          eligibilityCriteria: 'Family income below 3 LPA, minimum 70% marks'
        },
        {
          id: '3',
          title: 'TVS Sports Excellence Scholarship',
          description: 'For students excelling in sports at state or national level',
          amount: 30000,
          category: 'Sports',
          applicationEndDate: '2024-12-31',
          eligibilityCriteria: 'State/National level sports achievement, minimum 60% marks'
        }
      ];
      
      setScholarships(mockScholarships);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch scholarships');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (scholarship: Scholarship) => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/apply');
      return;
    }
    
    // Redirect to application form
    router.push(`/application-form?scholarship=${scholarship.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg text-gray-600 mt-4">Loading scholarships...</p>
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
                onClick={() => router.back()}
                className="text-indigo-600 hover:text-indigo-900 mr-4 flex items-center"
              >
                ← Back
              </button>
              <Link href="/">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
              </Link>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Apply for Scholarship</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Scholarships</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our range of scholarships designed to support your educational journey
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Scholarships Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map((scholarship) => (
              <div key={scholarship.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{scholarship.title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {scholarship.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{scholarship.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <span>Scholarship Amount</span>
                      <span className="font-semibold text-green-600">₹{scholarship.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Application Deadline</span>
                      <span>{new Date(scholarship.applicationEndDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Eligibility Criteria:</h4>
                    <p className="text-sm text-gray-600">{scholarship.eligibilityCriteria}</p>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleApply(scholarship)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Apply Now
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedScholarship(scholarship)}
                      className="px-4"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scholarship Details Modal */}
          {selectedScholarship && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedScholarship.title}</h3>
                    <button
                      onClick={() => setSelectedScholarship(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600">{selectedScholarship.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Amount</h4>
                        <p className="text-2xl font-bold text-green-600">₹{selectedScholarship.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Category</h4>
                        <p className="text-lg text-gray-600">{selectedScholarship.category}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Eligibility Criteria</h4>
                      <p className="text-gray-600">{selectedScholarship.eligibilityCriteria}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Application Deadline</h4>
                      <p className="text-gray-600">{new Date(selectedScholarship.applicationEndDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedScholarship(null)}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedScholarship(null);
                        handleApply(selectedScholarship);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Apply Now
                    </Button>
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