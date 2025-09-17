'use client';

import { useState, useEffect } from 'react';
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon as ChevronLeftOutline, ChevronRightIcon as ChevronRightOutline } from '@heroicons/react/24/outline';

interface Testimonial {
  id: number;
  name: string;
  course: string;
  university: string;
  image: string;
  rating: number;
  content: string;
  scholarship: string;
  amount: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    course: 'Computer Science Engineering',
    university: 'IIT Mumbai',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    rating: 5,
    content: 'The TVS Scholarship program has been a game-changer for my education. The application process was smooth, and the support team was incredibly helpful throughout. Thanks to this scholarship, I could focus on my studies without financial worries.',
    scholarship: 'TVS Merit Scholarship',
    amount: '₹75,000',
  },
  {
    id: 2,
    name: 'Arjun Patel',
    course: 'Mechanical Engineering',
    university: 'NIT Surat',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    rating: 5,
    content: 'I was skeptical about online scholarship applications, but TVS made it so easy and transparent. The real-time status updates kept me informed, and the disbursement was prompt. Highly recommended!',
    scholarship: 'TVS Technical Excellence Scholarship',
    amount: '₹50,000',
  },
  {
    id: 3,
    name: 'Sneha Reddy',
    course: 'Medicine',
    university: 'AIIMS Delhi',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    rating: 5,
    content: 'As a medical student, the financial burden was overwhelming. The TVS Need-Based Scholarship came as a blessing. The application was straightforward, and the verification process was quick. Thank you for supporting my dreams!',
    scholarship: 'TVS Need-Based Scholarship',
    amount: '₹1,00,000',
  },
  {
    id: 4,
    name: 'Rahul Kumar',
    course: 'Business Administration',
    university: 'IIM Bangalore',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    rating: 5,
    content: 'The TVS platform is user-friendly and the scholarship process is transparent. I received my scholarship within 2 weeks of approval. The team is responsive and helpful. Great initiative!',
    scholarship: 'TVS Management Excellence Scholarship',
    amount: '₹80,000',
  },
  {
    id: 5,
    name: 'Ananya Singh',
    course: 'Data Science',
    university: 'IISc Bangalore',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    rating: 5,
    content: 'I applied for multiple scholarships through TVS platform. The eligibility checker helped me identify the right opportunities. The entire process was seamless, and I received timely updates. Excellent service!',
    scholarship: 'TVS Women Empowerment Scholarship',
    amount: '₹60,000',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Success Stories
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from our scholarship recipients who have achieved their educational goals 
            with the help of TVS Scholarship programs.
          </p>
        </div>

        <div className="relative">
          {/* Main Testimonial */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Student Image */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      className="w-32 h-32 rounded-full object-cover shadow-lg"
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <StarIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="mb-4">
                    <div className="flex justify-center lg:justify-start mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonials[currentIndex].rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <blockquote className="text-lg text-gray-700 italic mb-6">
                      "{testimonials[currentIndex].content}"
                    </blockquote>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {testimonials[currentIndex].name}
                    </h3>
                    <p className="text-gray-600">
                      {testimonials[currentIndex].course}
                    </p>
                    <p className="text-gray-600">
                      {testimonials[currentIndex].university}
                    </p>
                    <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                      <p className="text-sm text-primary-700 font-medium">
                        Received: {testimonials[currentIndex].scholarship}
                      </p>
                      <p className="text-lg font-bold text-primary-600">
                        {testimonials[currentIndex].amount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            aria-label="Previous testimonial"
          >
            <ChevronLeftOutline className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            aria-label="Next testimonial"
          >
            <ChevronRightOutline className="w-6 h-6 text-gray-600" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-primary-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <img
                  className="w-12 h-12 rounded-full object-cover mr-4"
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.course}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-gray-700 text-sm italic mb-4">
                "{testimonial.content.substring(0, 100)}..."
              </p>
              
              <div className="text-xs text-primary-600 font-medium">
                {testimonial.scholarship} • {testimonial.amount}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of successful students and apply for your scholarship today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Apply Now
            </button>
            <button className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              View All Testimonials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
