'use client';

import { Button } from '@/components/ui/Button';
import { 
  AcademicCapIcon, 
  ArrowRightIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

export default function CTA() {
  return (
    <div className="py-24 bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Ready to Transform Your Educational Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-12 max-w-3xl mx-auto">
            Join thousands of students who have already benefited from our scholarship programs. 
            Start your application today and take the first step towards achieving your academic goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
            >
              <AcademicCapIcon className="w-6 h-6 mr-2" />
              Apply for Scholarship
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold"
            >
              Check Eligibility
            </Button>
          </div>

          {/* Benefits List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <CheckCircleIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Quick Application</h3>
              <p className="text-primary-100">Complete your application in just 15 minutes</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <CheckCircleIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Fast Processing</h3>
              <p className="text-primary-100">Get results within 48 hours of submission</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <CheckCircleIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure Platform</h3>
              <p className="text-primary-100">Your data is protected with enterprise-grade security</p>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">2,500+</div>
                <div className="text-primary-100">Active Students</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">150+</div>
                <div className="text-primary-100">Scholarships</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">₹25Cr+</div>
                <div className="text-primary-100">Disbursed</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">98.5%</div>
                <div className="text-primary-100">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
