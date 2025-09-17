'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  documentsRequired: string[];
}

interface ApplicationFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    aadharNumber: string;
    panNumber: string;
  };
  academicInfo: {
    courseOfStudy: string;
    currentYear: string;
    universityName: string;
    collegeName: string;
    academicPercentage: number;
  };
  familyInfo: {
    fatherName: string;
    fatherOccupation: string;
    motherName: string;
    motherOccupation: string;
    familyIncome: number;
    familySize: number;
    emergencyContact: string;
  };
  addressInfo: {
    currentAddress: string;
    currentCity: string;
    currentState: string;
    currentPinCode: string;
  };
  additionalInfo: {
    category: string;
    essay: string;
    futureGoals: string;
    whyScholarship: string;
  };
  documents: File[];
}

export default function ApplicationFormPage() {
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedDocuments, setUploadedDocuments] = useState<{[key: string]: File}>({});
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<ApplicationFormData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      aadharNumber: '',
      panNumber: '',
    },
    academicInfo: {
      courseOfStudy: '',
      currentYear: '',
      universityName: '',
      collegeName: '',
      academicPercentage: 0,
    },
    familyInfo: {
      fatherName: '',
      fatherOccupation: '',
      motherName: '',
      motherOccupation: '',
      familyIncome: 0,
      familySize: 0,
      emergencyContact: '',
    },
    addressInfo: {
      currentAddress: '',
      currentCity: '',
      currentState: '',
      currentPinCode: '',
    },
    additionalInfo: {
      category: '',
      essay: '',
      futureGoals: '',
      whyScholarship: '',
    },
    documents: [],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== 'STUDENT') {
      router.push('/login');
      return;
    }

    // Pre-fill user data
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
      }
    }));

    fetchScholarship();
  }, [router]);

  const fetchScholarship = async () => {
    try {
      const scholarshipId = searchParams.get('id');
      if (!scholarshipId) {
        router.push('/scholarships');
        return;
      }

      const response = await fetch(`https://tvs-scholarship-a1fi.vercel.app/scholarships/${scholarshipId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const scholarshipData = data.data || data;
        setScholarship(scholarshipData);
      } else {
        setError('Failed to fetch scholarship details');
      }
    } catch (err) {
      console.error('Error fetching scholarship:', err);
      setError('Failed to fetch scholarship details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section: keyof ApplicationFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleDocumentUpload = async (documentType: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://tvs-scholarship-a1fi.vercel.app/upload/document', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadedDocuments(prev => ({
          ...prev,
          [documentType]: {
            file,
            uploaded: true,
            filename: result.data.filename,
            url: result.data.url,
            path: result.data.path,
          },
        }));
        console.log('Document uploaded successfully:', result);
      } else {
        throw new Error('Failed to upload document');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document. Please try again.');
    }
  };

  const handleDigiLockerFetch = async (documentType: string) => {
    // Mock DigiLocker integration
    alert(`Mock: Fetching ${documentType} from DigiLocker...\n\nIn a real implementation, this would:\n1. Open DigiLocker OAuth\n2. Fetch the document\n3. Auto-populate the form`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // Prepare documents data with uploaded file paths
      const documentsData = Object.entries(uploadedDocuments).map(([type, docData]) => {
        if (docData.uploaded) {
          return {
            type,
            fileName: docData.file.name,
            filename: docData.filename,
            path: docData.path,
            url: docData.url,
            size: docData.file.size,
          };
        }
        return null;
      }).filter(Boolean);

      const applicationData = {
        scholarshipId: scholarship?.id,
        personalInfo: formData.personalInfo,
        academicInfo: formData.academicInfo,
        familyInfo: formData.familyInfo,
        addressInfo: formData.addressInfo,
        additionalInfo: formData.additionalInfo,
        documents: documentsData,
      };

      const response = await fetch('https://tvs-scholarship-a1fi.vercel.app/applications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        // Handle specific error types
        if (result.error === 'DUPLICATE_APPLICATION') {
          setError('You have already applied for this scholarship. Please check your applications in the dashboard.');
        } else {
          setError(result.message || 'Failed to submit application');
        }
      }
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading scholarship details...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">Your scholarship application has been successfully submitted. You will be redirected to your dashboard shortly.</p>
          <div className="animate-pulse">
            <div className="h-2 bg-green-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Scholarship Not Found</h2>
          <p className="text-gray-600 mb-6">The scholarship you're looking for could not be found.</p>
          <Link href="/scholarships" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Browse Scholarships
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Apply for Scholarship</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Scholarship Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{scholarship.title}</h2>
              <p className="text-gray-600 mb-4">{scholarship.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  ₹{scholarship.amount.toLocaleString()}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {scholarship.category}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(scholarship.applicationEndDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    step <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step === 1 && 'Personal Info'}
                    {step === 2 && 'Academic Info'}
                    {step === 3 && 'Family & Address'}
                    {step === 4 && 'Documents & Submit'}
                  </p>
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-4 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.personalInfo.firstName}
                    onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.personalInfo.lastName}
                    onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.personalInfo.phone}
                    onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.personalInfo.dateOfBirth}
                    onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                  <select
                    required
                    value={formData.personalInfo.gender}
                    onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.personalInfo.aadharNumber}
                    onChange={(e) => handleInputChange('personalInfo', 'aadharNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="12-digit Aadhaar number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.personalInfo.panNumber}
                    onChange={(e) => handleInputChange('personalInfo', 'panNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="10-character PAN number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Academic Information */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course of Study *</label>
                  <input
                    type="text"
                    required
                    value={formData.academicInfo.courseOfStudy}
                    onChange={(e) => handleInputChange('academicInfo', 'courseOfStudy', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., B.Tech Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Year *</label>
                  <select
                    required
                    value={formData.academicInfo.currentYear}
                    onChange={(e) => handleInputChange('academicInfo', 'currentYear', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">University Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.academicInfo.universityName}
                    onChange={(e) => handleInputChange('academicInfo', 'universityName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">College Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.academicInfo.collegeName}
                    onChange={(e) => handleInputChange('academicInfo', 'collegeName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Percentage *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={formData.academicInfo.academicPercentage}
                    onChange={(e) => handleInputChange('academicInfo', 'academicPercentage', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your percentage"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Family & Address Information */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Family & Address Information</h3>
              
              {/* Family Information */}
              <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Family Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.familyInfo.fatherName}
                      onChange={(e) => handleInputChange('familyInfo', 'fatherName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Father's Occupation *</label>
                    <input
                      type="text"
                      required
                      value={formData.familyInfo.fatherOccupation}
                      onChange={(e) => handleInputChange('familyInfo', 'fatherOccupation', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.familyInfo.motherName}
                      onChange={(e) => handleInputChange('familyInfo', 'motherName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Occupation *</label>
                    <input
                      type="text"
                      required
                      value={formData.familyInfo.motherOccupation}
                      onChange={(e) => handleInputChange('familyInfo', 'motherOccupation', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Family Income (Annual) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.familyInfo.familyIncome}
                      onChange={(e) => handleInputChange('familyInfo', 'familyIncome', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter annual family income in ₹"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Family Size *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.familyInfo.familySize}
                      onChange={(e) => handleInputChange('familyInfo', 'familySize', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact *</label>
                    <input
                      type="tel"
                      required
                      value={formData.familyInfo.emergencyContact}
                      onChange={(e) => handleInputChange('familyInfo', 'emergencyContact', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Emergency contact number"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-4">Address Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Address *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.addressInfo.currentAddress}
                      onChange={(e) => handleInputChange('addressInfo', 'currentAddress', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your complete current address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.addressInfo.currentCity}
                      onChange={(e) => handleInputChange('addressInfo', 'currentCity', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      required
                      value={formData.addressInfo.currentState}
                      onChange={(e) => handleInputChange('addressInfo', 'currentState', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.addressInfo.currentPinCode}
                      onChange={(e) => handleInputChange('addressInfo', 'currentPinCode', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="6-digit PIN code"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Documents & Additional Info */}
          {currentStep === 4 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Documents & Additional Information</h3>
              
              {/* Documents Upload */}
              <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Required Documents</h4>
                <div className="space-y-4">
                  {/* Scholarship-specific documents */}
                  {scholarship.documentsRequired.map((docType) => (
                    <div key={docType} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900 capitalize">{docType.replace('_', ' ')}</h5>
                          <p className="text-sm text-gray-500">Upload {docType.replace('_', ' ').toLowerCase()} document</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleDigiLockerFetch(docType)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            📱 DigiLocker
                          </button>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleDocumentUpload(docType, file);
                            }}
                            className="hidden"
                            id={`file-${docType}`}
                          />
                          <label
                            htmlFor={`file-${docType}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer"
                          >
                            📁 Upload
                          </label>
                        </div>
                      </div>
                      {uploadedDocuments[docType] && (
                        <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                          <p className="text-sm text-green-800">
                            ✅ {uploadedDocuments[docType].file.name} ({(uploadedDocuments[docType].file.size / 1024 / 1024).toFixed(2)} MB)
                            {uploadedDocuments[docType].uploaded && <span className="ml-2 text-green-600">✓ Uploaded</span>}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Additional common documents */}
                  {[
                    'INCOME_CERTIFICATE',
                    'MARK_SHEET_12TH',
                    'MARK_SHEET_10TH',
                    'BONAFIDE_CERTIFICATE',
                    'BANK_PASSBOOK',
                    'PHOTOGRAPH',
                    'SIGNATURE'
                  ].map((docType) => (
                    <div key={docType} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900 capitalize">{docType.replace('_', ' ')}</h5>
                          <p className="text-sm text-gray-500">Upload {docType.replace('_', ' ').toLowerCase()} document</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleDigiLockerFetch(docType)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            📱 DigiLocker
                          </button>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleDocumentUpload(docType, file);
                            }}
                            className="hidden"
                            id={`file-${docType}`}
                          />
                          <label
                            htmlFor={`file-${docType}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer"
                          >
                            📁 Upload
                          </label>
                        </div>
                      </div>
                      {uploadedDocuments[docType] && (
                        <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                          <p className="text-sm text-green-800">
                            ✅ {uploadedDocuments[docType].file.name} ({(uploadedDocuments[docType].file.size / 1024 / 1024).toFixed(2)} MB)
                            {uploadedDocuments[docType].uploaded && <span className="ml-2 text-green-600">✓ Uploaded</span>}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-4">Additional Information</h4>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      required
                      value={formData.additionalInfo.category}
                      onChange={(e) => handleInputChange('additionalInfo', 'category', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Category</option>
                      <option value="GENERAL">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Why do you need this scholarship? *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.additionalInfo.whyScholarship}
                      onChange={(e) => handleInputChange('additionalInfo', 'whyScholarship', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Explain why you need this scholarship and how it will help you..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Future Goals *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.additionalInfo.futureGoals}
                      onChange={(e) => handleInputChange('additionalInfo', 'futureGoals', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe your future career goals and aspirations..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              Previous
            </button>
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  submitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}