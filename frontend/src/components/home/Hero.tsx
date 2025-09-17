'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRightIcon, AcademicCapIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              <span className="text-primary-600">TVS Scholarship</span>
              <br />
              <span className="text-gray-800">Ecosystem</span>
            </h1>
            
            <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-2xl">
              Empowering students with comprehensive scholarship management. 
              Apply, track, and manage your educational journey with ease.
            </p>

            {/* Key Features */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-success-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">Easy Application Process</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-success-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">Real-time Status Tracking</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-success-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">Secure Document Management</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/apply">
                <Button size="lg" className="w-full sm:w-auto">
                  <AcademicCapIcon className="h-5 w-5 mr-2" />
                  Apply Now
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/scholarships">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Browse Scholarships
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">500+</div>
                <div className="text-sm text-gray-600 mt-1">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">50+</div>
                <div className="text-sm text-gray-600 mt-1">Scholarships</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">₹2Cr+</div>
                <div className="text-sm text-gray-600 mt-1">Awarded</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Card */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <AcademicCapIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Application Status</h3>
                    <p className="text-sm text-gray-600">Track your progress</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Profile Complete</span>
                    <CheckCircleIcon className="h-5 w-5 text-success-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Documents Uploaded</span>
                    <div className="h-5 w-5 border-2 border-warning-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Under Review</span>
                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-success-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                Approved!
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                New Scholarship
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-primary-300 rounded-2xl transform -rotate-6 scale-105 opacity-20"></div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-12 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
        </svg>
      </div>
    </div>
  );
}
