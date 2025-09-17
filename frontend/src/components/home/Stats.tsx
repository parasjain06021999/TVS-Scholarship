'use client';

import { useState, useEffect } from 'react';
import { 
  AcademicCapIcon, 
  CurrencyRupeeIcon, 
  UserGroupIcon, 
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

interface Stat {
  id: string;
  name: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  description: string;
}

const stats: Stat[] = [
  {
    id: 'students',
    name: 'Active Students',
    value: '2,500+',
    icon: UserGroupIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Students actively using our platform',
  },
  {
    id: 'scholarships',
    name: 'Scholarships Available',
    value: '150+',
    icon: AcademicCapIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Different scholarship programs',
  },
  {
    id: 'applications',
    name: 'Applications Processed',
    value: '15,000+',
    icon: DocumentTextIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    description: 'Successful applications processed',
  },
  {
    id: 'disbursed',
    name: 'Amount Disbursed',
    value: '₹25Cr+',
    icon: CurrencyRupeeIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: 'Total scholarship amount disbursed',
  },
];

export default function Stats() {
  const [animatedStats, setAnimatedStats] = useState<Record<string, number>>({});

  useEffect(() => {
    const animateNumbers = () => {
      const targets: Record<string, number> = {};
      
      stats.forEach((stat) => {
        const value = stat.value.replace(/[^\d]/g, '');
        if (value) {
          targets[stat.id] = parseInt(value);
        }
      });

      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        const newValues: Record<string, number> = {};
        Object.keys(targets).forEach((key) => {
          newValues[key] = Math.floor(targets[key] * progress);
        });
        
        setAnimatedStats(newValues);
        
        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedStats(targets);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    const timer = setTimeout(animateNumbers, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-h2 font-bold text-text-primary">
            Our Impact in Numbers
          </h2>
          <p className="mt-4 text-body text-text-secondary max-w-2xl mx-auto">
            Join thousands of students who have already benefited from our scholarship programs. 
            See how we're making education accessible to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="group relative"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 text-center hover:shadow-medium transition-all duration-300 group-hover:-translate-y-2">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${stat.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                
                <div className="mb-4">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stat.id === 'students' && animatedStats.students ? (
                      `${animatedStats.students.toLocaleString()}+`
                    ) : stat.id === 'scholarships' && animatedStats.scholarships ? (
                      `${animatedStats.scholarships}+`
                    ) : stat.id === 'applications' && animatedStats.applications ? (
                      `${animatedStats.applications.toLocaleString()}+`
                    ) : stat.id === 'disbursed' && animatedStats.disbursed ? (
                      `₹${(animatedStats.disbursed / 10000000).toFixed(1)}Cr+`
                    ) : (
                      stat.value
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {stat.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {stat.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.color.replace('text-', 'from-')} to-${stat.color.replace('text-', '')} rounded-full transition-all duration-1000 ease-out`}
                    style={{ 
                      width: '0%',
                      animation: `fillBar 2s ease-out ${index * 200}ms forwards`
                    }}
                  ></div>
                </div>
              </div>

              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-primary-100/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 transform scale-105"></div>
            </div>
          ))}
        </div>

        {/* Additional Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-primary-50 to-primary-100 rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">98.5%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Success Rate</div>
              <div className="text-gray-600">Applications successfully processed</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Support Available</div>
              <div className="text-gray-600">Round-the-clock assistance</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Partner Institutions</div>
              <div className="text-gray-600">Universities and colleges</div>
            </div>
          </div>
        </div>

        {/* Testimonial Stats */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h3>
            <p className="text-lg text-gray-600">
              Don't just take our word for it - hear from our successful scholarship recipients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">4.9/5</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Average Rating</div>
              <div className="text-gray-600">Based on 2,500+ reviews</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Would Recommend</div>
              <div className="text-gray-600">Students recommend us to others</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">48hrs</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Average Response</div>
              <div className="text-gray-600">Time for application review</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fillBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
