'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

interface Scholarship {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  applicationEndDate: string;
  eligibilityCriteria: string;
  isActive?: boolean;
}

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState<{[key: string]: {days: number, hours: number, minutes: number, seconds: number}}>({});
  const router = useRouter();

  // Timer calculation function
  const calculateTimeLeft = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const difference = end - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  // Check if application is expired
  const isExpired = (endDate: string) => {
    return new Date(endDate).getTime() < new Date().getTime();
  };

  // Filter active scholarships (only filter by isActive status, not by date)
  const getActiveScholarships = (scholarships: Scholarship[]) => {
    return scholarships.filter(scholarship => 
      scholarship.isActive === true
    );
  };

  const renderEligibility = (criteria: any) => {
    try {
      // If criteria is a simple string, return it as is
      if (typeof criteria === 'string' && !criteria.startsWith('{')) {
        return <p className="text-sm text-gray-600">{criteria}</p>;
      }

      const parsed = typeof criteria === 'string' ? JSON.parse(criteria) : criteria;
      if (!parsed || typeof parsed !== 'object') {
        return <p className="text-sm text-gray-600">{String(criteria)}</p>;
      }

      const rows: Array<{ label: string; value: string }> = [];

      const currency = (n: number) => `₹${(n || 0).toLocaleString()}`;
      const percent = (n: number) => `${n}%`;
      const list = (arr: any[]) => (arr || []).map(v => String(v).replace(/_/g, ' ')).join(', ');

      if (parsed.minPercentage != null) rows.push({ label: 'Minimum Percentage', value: percent(Number(parsed.minPercentage)) });
      if (parsed.maxPercentage != null) rows.push({ label: 'Maximum Percentage', value: percent(Number(parsed.maxPercentage)) });
      if (parsed.maxFamilyIncome != null) rows.push({ label: 'Max Family Income', value: currency(Number(parsed.maxFamilyIncome)) });
      if (parsed.educationLevels) rows.push({ label: 'Education Levels', value: list(parsed.educationLevels) });
      if (parsed.categories) rows.push({ label: 'Categories', value: list(parsed.categories) });
      if (parsed.states) rows.push({ label: 'States', value: list(parsed.states) });
      if (parsed.specialConditions) rows.push({ label: 'Special Conditions', value: list(parsed.specialConditions) });

      if (!rows.length) {
        return <p className="text-sm text-gray-600">{String(criteria)}</p>;
      }

      return (
        <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
          {rows.map((r, i) => (
            <li key={i}><span className="font-medium text-gray-900">{r.label}:</span> {r.value}</li>
          ))}
        </ul>
      );
    } catch {
      return <p className="text-sm text-gray-600">{String(criteria)}</p>;
    }
  };

  const handleApply = (scholarshipId: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const target = `/application-form?id=${encodeURIComponent(scholarshipId)}`;
      if (!token) {
        router.push(`/login?redirect=${encodeURIComponent(target)}`);
        return;
      }
      router.push(target);
    } catch {
      router.push(`/application-form?id=${encodeURIComponent(scholarshipId)}`);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: {[key: string]: {days: number, hours: number, minutes: number, seconds: number}} = {};
      scholarships.forEach(scholarship => {
        newTimeLeft[scholarship.id] = calculateTimeLeft(scholarship.applicationEndDate);
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [scholarships]);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from backend first
      try {
        const response = await apiClient.request('/scholarships?isActive=true');
        // Normalize response to array
        const list = Array.isArray(response)
          ? response
          : Array.isArray((response as any)?.data)
          ? (response as any).data
          : [];
        // Filter only active scholarships
        const activeScholarships = getActiveScholarships(list as Scholarship[]);
        setScholarships(activeScholarships);
      } catch (backendError) {
        console.log('Backend not available, using mock data');
        // Fallback to mock data
        const mockScholarships: Scholarship[] = [
          {
            id: '1',
            title: 'TVS Merit Scholarship',
            description: 'For students with outstanding academic performance',
            amount: 50000,
            category: 'MERIT_BASED',
            applicationEndDate: '2025-12-31',
            eligibilityCriteria: 'Minimum 80% marks in previous year',
            isActive: true
          },
          {
            id: '2',
            title: 'TVS Need-based Scholarship',
            description: 'For students from economically weaker sections',
            amount: 25000,
            category: 'NEED_BASED',
            applicationEndDate: '2025-12-31',
            eligibilityCriteria: 'Family income below 3 LPA',
            isActive: true
          },
          {
            id: '3',
            title: 'TVS Sports Excellence Scholarship',
            description: 'For students excelling in sports',
            amount: 30000,
            category: 'SPORTS',
            applicationEndDate: '2025-12-31',
            eligibilityCriteria: 'State/National level sports achievement',
            isActive: true
          },
          {
            id: '4',
            title: 'TVS Minority Scholarship 2024',
            description: 'For students from minority communities',
            amount: 45000,
            category: 'MINORITY',
            applicationEndDate: '2024-04-30T23:59:59.000Z',
            eligibilityCriteria: '{"minPercentage":70,"maxFamilyIncome":400000,"educationLevels":["undergraduate","postgraduate"],"categories":["minority"],"states":["all"]}',
            isActive: true
          }
        ];
        // Filter only active scholarships
        const activeMockScholarships = getActiveScholarships(mockScholarships);
        setScholarships(activeMockScholarships);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch scholarships');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-200"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-600 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading scholarships...</p>
          <p className="mt-2 text-sm text-gray-500">Please wait while we fetch the latest opportunities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="group flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-indigo-200"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back</span>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Available Scholarships</h1>
                <p className="text-gray-600 mt-1">Discover and apply for scholarships that match your profile</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">{scholarships.length} Active Scholarships</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {scholarships.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Scholarships</h3>
            <p className="text-gray-600">There are currently no active scholarships available. Please check back later.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((scholarship) => {
              const currentTime = timeLeft[scholarship.id] || calculateTimeLeft(scholarship.applicationEndDate);
              const expired = isExpired(scholarship.applicationEndDate);
              
              return (
                <div key={scholarship.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200">
                  {/* Card Header */}
                  <div className="relative p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                          {scholarship.title}
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                          {scholarship.description}
                        </p>
                      </div>
                      <span className="ml-4 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {scholarship.category.replace(/_/g, ' ')}
                      </span>
                    </div>
                    
                    {/* Amount */}
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-green-600">
                        ₹{scholarship.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Timer Section */}
                  <div className="px-6 pb-4">
                    {!expired ? (
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-orange-800">Application Deadline</span>
                          <span className="text-xs text-orange-600">
                            {new Date(scholarship.applicationEndDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="text-center">
                            <div className="bg-white rounded-lg p-2 border border-orange-200">
                              <div className="text-lg font-bold text-orange-600">{currentTime.days}</div>
                              <div className="text-xs text-orange-600">Days</div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="bg-white rounded-lg p-2 border border-orange-200">
                              <div className="text-lg font-bold text-orange-600">{currentTime.hours}</div>
                              <div className="text-xs text-orange-600">Hours</div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="bg-white rounded-lg p-2 border border-orange-200">
                              <div className="text-lg font-bold text-orange-600">{currentTime.minutes}</div>
                              <div className="text-xs text-orange-600">Min</div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="bg-white rounded-lg p-2 border border-orange-200">
                              <div className="text-lg font-bold text-orange-600">{currentTime.seconds}</div>
                              <div className="text-xs text-orange-600">Sec</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span className="text-red-700 font-medium">Application Closed</span>
                        </div>
                        <p className="text-red-600 text-sm mt-1">
                          Deadline: {new Date(scholarship.applicationEndDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Eligibility Section */}
                  <div className="px-6 pb-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Eligibility Criteria
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {renderEligibility((scholarship as any).eligibilityCriteria)}
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="px-6 pb-6">
                    {!expired ? (
                      <button
                        onClick={() => handleApply(scholarship.id)}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Apply Now
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-xl cursor-not-allowed font-semibold"
                      >
                        Application Closed
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
