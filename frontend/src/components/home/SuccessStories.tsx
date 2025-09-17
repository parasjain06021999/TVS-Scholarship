'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const successStories = [
  {
    id: 1,
    name: 'Priya Sharma',
    course: 'Computer Science Engineering',
    college: 'IIT Delhi',
    amount: '₹50,000',
    image: '/images/students/priya.jpg',
    story: 'The TVS scholarship helped me pursue my dream of studying at IIT Delhi. Without this financial support, I would not have been able to afford the fees.',
    achievement: 'Placed at Google with ₹45 LPA package'
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    course: 'Mechanical Engineering',
    college: 'NIT Trichy',
    amount: '₹40,000',
    image: '/images/students/rajesh.jpg',
    story: 'Coming from a small village in Tamil Nadu, the TVS scholarship was a blessing. It covered my entire tuition fees for the year.',
    achievement: 'Started his own manufacturing company'
  },
  {
    id: 3,
    name: 'Sneha Patel',
    course: 'Medicine',
    college: 'AIIMS Delhi',
    amount: '₹75,000',
    image: '/images/students/sneha.jpg',
    story: 'The scholarship enabled me to focus on my studies without worrying about financial constraints. I could pursue my passion for medicine.',
    achievement: 'Now working as a doctor in rural areas'
  }
];

export default function SuccessStories() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1) % successStories.length);
  };

  const prevStory = () => {
    setCurrentIndex((prev) => (prev - 1 + successStories.length) % successStories.length);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Success Stories
      </h2>
      
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {successStories.map((story) => (
              <div key={story.id} className="w-full flex-shrink-0">
                <div className="bg-white border-0 shadow-none rounded-lg p-6">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {story.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {story.name}
                    </h3>
                    
                    <p className="text-gray-600 mb-2">
                      {story.course} at {story.college}
                    </p>
                    
                    <p className="text-blue-600 font-semibold mb-4">
                      Scholarship Amount: {story.amount}
                    </p>
                    
                    <blockquote className="text-gray-700 italic mb-4">
                      "{story.story}"
                    </blockquote>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-800 font-medium">
                        Achievement: {story.achievement}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center space-x-2 mt-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={prevStory}
            className="rounded-full p-2"
          >
            ←
          </Button>
          
          <div className="flex space-x-1">
            {successStories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={nextStory}
            className="rounded-full p-2"
          >
            →
          </Button>
        </div>
      </div>
    </div>
  );
}
