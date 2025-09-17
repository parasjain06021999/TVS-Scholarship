'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function EligibilityChecker() {
  const [formData, setFormData] = useState({
    state: '',
    incomeRange: '',
    educationLevel: '',
    category: ''
  });
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    
    // Simulate eligibility check
    setTimeout(() => {
      setResult({
        eligible: true,
        scholarships: [
          { name: 'TVS Merit Scholarship', amount: '₹50,000', match: '95%' },
          { name: 'TVS Need-based Scholarship', amount: '₹25,000', match: '88%' }
        ]
      });
      setIsChecking(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Quick Eligibility Checker
        </h2>
        <p className="text-gray-600">
          Find out which scholarships you're eligible for in seconds
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
            <select 
              id="state"
              value={formData.state} 
              onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select State</option>
              <option value="tamil-nadu">Tamil Nadu</option>
              <option value="karnataka">Karnataka</option>
              <option value="kerala">Kerala</option>
              <option value="andhra-pradesh">Andhra Pradesh</option>
              <option value="telangana">Telangana</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="incomeRange" className="block text-sm font-medium text-gray-700">Family Income</label>
            <select 
              id="incomeRange"
              value={formData.incomeRange} 
              onChange={(e) => setFormData(prev => ({ ...prev, incomeRange: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Income Range</option>
              <option value="0-1l">Below ₹1 Lakh</option>
              <option value="1-3l">₹1-3 Lakhs</option>
              <option value="3-5l">₹3-5 Lakhs</option>
              <option value="5-10l">₹5-10 Lakhs</option>
              <option value="10l+">Above ₹10 Lakhs</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700">Education Level</label>
            <select 
              id="educationLevel"
              value={formData.educationLevel} 
              onChange={(e) => setFormData(prev => ({ ...prev, educationLevel: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Education Level</option>
              <option value="school">School (Class 10-12)</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="phd">PhD</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select 
              id="category"
              value={formData.category} 
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Category</option>
              <option value="general">General</option>
              <option value="obc">OBC</option>
              <option value="sc">SC</option>
              <option value="st">ST</option>
              <option value="minority">Minority</option>
            </select>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
          disabled={isChecking}
        >
          {isChecking ? 'Checking Eligibility...' : 'Check Eligibility'}
        </Button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Great! You're eligible for:</h3>
          <div className="space-y-2">
            {result.scholarships.map((scholarship: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                <div>
                  <div className="font-medium text-gray-900">{scholarship.name}</div>
                  <div className="text-sm text-gray-600">Amount: {scholarship.amount}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">{scholarship.match} Match</div>
                  <Button size="sm" className="mt-1">Apply Now</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}