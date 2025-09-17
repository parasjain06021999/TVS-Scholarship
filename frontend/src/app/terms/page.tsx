'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/login"
            className="group flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-indigo-200 w-fit mx-auto mb-8"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Login</span>
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-lg text-gray-600">Last updated: September 16, 2024</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              By accessing and using the TVS Scholarship Management System, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily download one copy of the materials on TVS Scholarship Management System for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on the website</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Scholarship Applications</h2>
            <p className="text-gray-700 mb-4">
              When applying for scholarships through our platform, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Provide accurate and complete information</li>
              <li>Submit all required documents</li>
              <li>Meet the eligibility criteria for each scholarship</li>
              <li>Comply with application deadlines</li>
              <li>Use the scholarship funds for educational purposes only</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Accounts</h2>
            <p className="text-gray-700 mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Ensuring your contact information is up to date</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Privacy and Data Protection</h2>
            <p className="text-gray-700 mb-6">
              We are committed to protecting your privacy. Please review our Privacy Policy to understand how we collect, use, and protect your personal information. By using our service, you consent to the collection and use of information as outlined in our Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Prohibited Uses</h2>
            <p className="text-gray-700 mb-4">
              You may not use our service:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Disclaimer</h2>
            <p className="text-gray-700 mb-6">
              The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, TVS Scholarship Management System excludes all representations, warranties, conditions and terms relating to our website and the use of this website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitations</h2>
            <p className="text-gray-700 mb-6">
              In no event shall TVS Scholarship Management System or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Accuracy of Materials</h2>
            <p className="text-gray-700 mb-6">
              The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Links</h2>
            <p className="text-gray-700 mb-6">
              We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Modifications</h2>
            <p className="text-gray-700 mb-6">
              We may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-700 mb-6">
              These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>TVS Scholarship Management System</strong><br/>
                Email: support@tvsscholarship.com<br/>
                Phone: +91 44 1234 5678<br/>
                Address: TVS House, 7, SIPCOT Industrial Complex, Hosur, Tamil Nadu 635126
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


