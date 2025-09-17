'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="text-indigo-600 hover:text-indigo-900 mr-4 flex items-center"
              >
                ← Back
              </button>
              <Link href="/">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
              </Link>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">About TVS Scholarship</h1>
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
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Empowering Dreams Through Education
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              TVS Scholarship Ecosystem is committed to providing financial support and opportunities 
              to deserving students across India, helping them achieve their educational goals.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To identify, support, and nurture talented students from diverse backgrounds by providing 
                comprehensive scholarship programs that remove financial barriers to quality education.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">👁️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To create a world where every deserving student has access to quality education, 
                regardless of their financial circumstances, and can contribute meaningfully to society.
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose TVS Scholarship?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Financial Support</h3>
                <p className="text-gray-600">
                  Comprehensive financial assistance covering tuition fees, books, and other educational expenses.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎓</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Merit & Need Based</h3>
                <p className="text-gray-600">
                  Scholarships based on academic merit, financial need, and special talents.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Mentorship Program</h3>
                <p className="text-gray-600">
                  Access to industry mentors and career guidance to help shape your future.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Academic Support</h3>
                <p className="text-gray-600">
                  Additional academic resources and support to ensure your success.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🌐</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Wide Coverage</h3>
                <p className="text-gray-600">
                  Scholarships available for students across all states and educational levels.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Application</h3>
                <p className="text-gray-600">
                  Simple and streamlined application process with online support.
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-blue-600 rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-blue-200">Students Supported</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">₹2Cr+</div>
                <div className="text-blue-200">Amount Disbursed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">25+</div>
                <div className="text-blue-200">Scholarship Programs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">95%</div>
                <div className="text-blue-200">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Rajesh Kumar</h3>
                <p className="text-blue-600 mb-2">Director of Scholarships</p>
                <p className="text-gray-600 text-sm">
                  Leading our scholarship programs with over 15 years of experience in education.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Priya Sharma</h3>
                <p className="text-blue-600 mb-2">Head of Operations</p>
                <p className="text-gray-600 text-sm">
                  Managing day-to-day operations and ensuring smooth scholarship disbursement.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Amit Patel</h3>
                <p className="text-blue-600 mb-2">Student Relations Manager</p>
                <p className="text-gray-600 text-sm">
                  Supporting students throughout their scholarship journey and beyond.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have already benefited from our scholarship programs. 
              Apply today and take the first step towards achieving your educational goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Apply Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}