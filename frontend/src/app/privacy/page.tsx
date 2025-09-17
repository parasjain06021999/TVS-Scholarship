'use client';

import Link from 'next/link';

export default function PrivacyPage() {
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
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">Last updated: September 16, 2024</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us, such as when you create an account, apply for scholarships, or contact us for support. This may include:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Personal information (name, email, phone number, date of birth)</li>
              <li>Academic information (institution, course, grades, achievements)</li>
              <li>Financial information (family income, bank details for disbursement)</li>
              <li>Identity documents (Aadhaar, PAN, mark sheets)</li>
              <li>Application materials (essays, recommendation letters)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Process and evaluate scholarship applications</li>
              <li>Verify eligibility and authenticate documents</li>
              <li>Communicate with you about your applications</li>
              <li>Disburse scholarship funds</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Send important updates and notifications</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>With scholarship providers and review committees</li>
              <li>With educational institutions for verification</li>
              <li>With financial institutions for fund disbursement</li>
              <li>With government authorities when required by law</li>
              <li>With service providers who assist in our operations</li>
              <li>In case of mergers, acquisitions, or asset sales</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-700 mb-6">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Retention</h2>
            <p className="text-gray-700 mb-6">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law. Typically, we retain application data for 7 years after the completion of your education.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-6">
              We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences. Some features may not function properly if cookies are disabled.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Services</h2>
            <p className="text-gray-700 mb-6">
              Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any personal information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Transfers</h2>
            <p className="text-gray-700 mb-6">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700 mb-6">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-700 mb-6">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our service after any changes constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Data Protection Officer</strong><br/>
                TVS Scholarship Management System<br/>
                Email: privacy@tvsscholarship.com<br/>
                Phone: +91 44 1234 5678<br/>
                Address: TVS House, 7, SIPCOT Industrial Complex, Hosur, Tamil Nadu 635126
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Grievance Redressal</h2>
            <p className="text-gray-700 mb-6">
              If you have any grievances regarding the processing of your personal information, you may contact our Grievance Officer:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Grievance Officer</strong><br/>
                Email: grievance@tvsscholarship.com<br/>
                Phone: +91 44 1234 5679<br/>
                Response Time: Within 30 days of receiving your complaint
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



