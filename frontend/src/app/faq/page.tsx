'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'What types of scholarships are available?',
      answer: 'We offer various types of scholarships including merit-based, need-based, sports excellence, and special category scholarships. Each scholarship has specific eligibility criteria and benefits.',
      category: 'general'
    },
    {
      id: '2',
      question: 'How do I apply for a scholarship?',
      answer: 'You can apply by creating an account on our platform, filling out the application form, uploading required documents, and submitting your application before the deadline.',
      category: 'application'
    },
    {
      id: '3',
      question: 'What documents are required for application?',
      answer: 'Required documents typically include academic transcripts, income certificate, identity proof, address proof, passport size photograph, and any other documents specified for the particular scholarship.',
      category: 'application'
    },
    {
      id: '4',
      question: 'When will I know if my application is approved?',
      answer: 'Application review typically takes 4-6 weeks after the deadline. You will be notified via email and SMS about the status of your application.',
      category: 'application'
    },
    {
      id: '5',
      question: 'Can I apply for multiple scholarships?',
      answer: 'Yes, you can apply for multiple scholarships as long as you meet the eligibility criteria for each one. However, you can only receive one scholarship at a time.',
      category: 'general'
    },
    {
      id: '6',
      question: 'What is the scholarship amount?',
      answer: 'Scholarship amounts vary depending on the program. They can range from ₹10,000 to ₹1,00,000 per year. Check individual scholarship details for specific amounts.',
      category: 'general'
    },
    {
      id: '7',
      question: 'How is the scholarship amount disbursed?',
      answer: 'Scholarship amounts are typically disbursed directly to your bank account in installments. The first installment is usually released after verification of documents.',
      category: 'payment'
    },
    {
      id: '8',
      question: 'What if I change my course or college?',
      answer: 'You must inform us immediately about any changes in your course or college. We will review your case and may adjust the scholarship accordingly.',
      category: 'general'
    },
    {
      id: '9',
      question: 'Is there any age limit for applying?',
      answer: 'Age limits vary by scholarship program. Most undergraduate scholarships have an age limit of 25 years, while postgraduate scholarships may have different limits.',
      category: 'eligibility'
    },
    {
      id: '10',
      question: 'What are the academic requirements?',
      answer: 'Academic requirements vary by scholarship. Generally, you need a minimum percentage in your previous qualifying examination, typically ranging from 60% to 80%.',
      category: 'eligibility'
    },
    {
      id: '11',
      question: 'Can international students apply?',
      answer: 'Currently, our scholarships are available only for Indian citizens. International students are not eligible to apply.',
      category: 'eligibility'
    },
    {
      id: '12',
      question: 'What if I miss the application deadline?',
      answer: 'Late applications are generally not accepted. However, in exceptional circumstances, you may contact our support team to discuss your situation.',
      category: 'application'
    },
    {
      id: '13',
      question: 'How can I track my application status?',
      answer: 'You can track your application status by logging into your account on our platform. You will also receive regular updates via email and SMS.',
      category: 'application'
    },
    {
      id: '14',
      question: 'What happens if my application is rejected?',
      answer: 'If your application is rejected, you will receive a detailed explanation. You can reapply in the next academic year if you meet the eligibility criteria.',
      category: 'application'
    },
    {
      id: '15',
      question: 'Is there any renewal process?',
      answer: 'Yes, most scholarships require annual renewal. You need to maintain good academic performance and submit renewal documents each year.',
      category: 'general'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', count: faqData.length },
    { id: 'general', name: 'General', count: faqData.filter(item => item.category === 'general').length },
    { id: 'application', name: 'Application', count: faqData.filter(item => item.category === 'application').length },
    { id: 'eligibility', name: 'Eligibility', count: faqData.filter(item => item.category === 'eligibility').length },
    { id: 'payment', name: 'Payment', count: faqData.filter(item => item.category === 'payment').length }
  ];

  const filteredFAQs = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory);

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
              </Link>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Frequently Asked Questions</h1>
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our scholarship programs and application process.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {filteredFAQs.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-lg font-medium text-gray-900 pr-4">{item.question}</h3>
                      <div className="flex-shrink-0">
                        <svg
                          className={`w-5 h-5 text-gray-500 transform transition-transform ${
                            openItems.has(item.id) ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    
                    {openItems.has(item.id) && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* No Results */}
              {filteredFAQs.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">❓</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
                  <p className="text-gray-600 mb-4">Try selecting a different category or contact us for specific queries.</p>
                  <Link href="/contact">
                    <Button>Contact Us</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-12 bg-blue-600 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              If you couldn't find the answer you're looking for, our support team is here to help you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Contact Support
                </Button>
              </Link>
              <Link href="/apply">
                <Button variant="secondary" size="lg" className="border-white text-white hover:bg-blue-700">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}