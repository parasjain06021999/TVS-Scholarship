import { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import EligibilityChecker from '@/components/home/EligibilityChecker';
import Stats from '@/components/home/Stats';
import SuccessStories from '@/components/home/SuccessStories';
import Testimonials from '@/components/home/Testimonials';
import CTA from '@/components/home/CTA';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import HomeChatbotLauncher from '@/components/chatbot/HomeChatbotLauncher';

export const metadata: Metadata = {
  title: 'TVS Scholarship Ecosystem - Empowering Education',
  description: 'Comprehensive scholarship management system for students, administrators, and reviewers. Apply for scholarships, manage applications, and track your educational journey.',
  keywords: 'scholarship, education, TVS, management, students, applications, financial aid',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <Hero />
        
        {/* Eligibility Checker - Full Width */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <EligibilityChecker />
        </div>
        
        {/* Stats - Full Width */}
        <Stats />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <SuccessStories />
        </div>
        
        <Features />
        <Testimonials />
        <CTA />
      </main>
      
      <Footer />

      {/* Public Chatbot Launcher (Client Component) */}
      <HomeChatbotLauncher />
    </div>
  );
}
