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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <EligibilityChecker />
            <div className="space-y-8">
              <Stats />
              <SuccessStories />
            </div>
          </div>
        </div>
        <Features />
        <Testimonials />
        <CTA />
      </main>
      
      <Footer />
    </div>
  );
}
