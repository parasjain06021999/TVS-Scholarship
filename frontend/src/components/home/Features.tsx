'use client';

import { 
  AcademicCapIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  CloudArrowUpIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Easy Application Process',
    description: 'Streamlined multi-step application form with real-time validation and autosave functionality.',
    icon: DocumentTextIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    name: 'Real-time Status Tracking',
    description: 'Track your application status in real-time with instant notifications and updates.',
    icon: ClockIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    name: 'Secure Document Management',
    description: 'Upload and manage documents securely with encryption and verification system.',
    icon: ShieldCheckIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    name: 'Comprehensive Dashboard',
    description: 'Personalized dashboard with statistics, quick actions, and application history.',
    icon: ChartBarIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    name: 'Multi-role Support',
    description: 'Support for students, administrators, and reviewers with role-based access control.',
    icon: UserGroupIcon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    name: 'Smart Notifications',
    description: 'Intelligent notification system with email and in-app alerts for important updates.',
    icon: BellAlertIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
];

export default function Features() {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Why Choose TVS Scholarship Ecosystem?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides everything you need to manage scholarships efficiently, 
            from application submission to final disbursement.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative group"
              >
                <div className="flex flex-col h-full p-8 bg-white rounded-2xl shadow-soft border border-gray-100 hover:shadow-medium transition-all duration-300 group-hover:-translate-y-1">
                  <div className="flex items-center justify-center w-12 h-12 mb-6 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100">
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.name}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed flex-grow">
                    {feature.description}
                  </p>

                  <div className="mt-6">
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                    </div>
                  </div>
                </div>

                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-primary-100/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 transform scale-105"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-20 bg-gradient-to-r from-primary-50 to-primary-100 rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Built for Modern Education
              </h3>
              <p className="text-lg text-gray-700 mb-8">
                Our platform is designed with the latest technology stack to provide a seamless, 
                secure, and efficient scholarship management experience for all stakeholders.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">Mobile-responsive design</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">Advanced security features</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">Real-time collaboration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-gray-700">Comprehensive reporting</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                    <ChartBarIcon className="w-6 h-6 text-success-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h4>
                    <p className="text-sm text-gray-600">Real-time insights</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Applications Processed</span>
                    <span className="text-lg font-bold text-primary-600">1,247</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Success Rate</span>
                    <span className="text-lg font-bold text-success-600">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Total Disbursed</span>
                    <span className="text-lg font-bold text-primary-600">₹2.1Cr</span>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-success-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce">
                Live Data
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
