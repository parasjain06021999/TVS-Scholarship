'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  TrophyIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon,
  StarIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';

interface Scholar {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentYear: string;
  course: string;
  university: string;
  gpa: number;
  achievements: Achievement[];
  milestones: Milestone[];
  progress: ProgressData;
  mentor?: Mentor;
  alumni: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  verified: boolean;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
}

interface ProgressData {
  academicProgress: number;
  attendanceRate: number;
  assignmentCompletion: number;
  overallScore: number;
  lastUpdated: string;
}

interface Mentor {
  id: string;
  name: string;
  email: string;
  company: string;
  experience: number;
  specialization: string;
}

const ScholarTracking: React.FC = () => {
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScholar, setSelectedScholar] = useState<Scholar | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchScholars();
  }, [filter, searchTerm]);

  const fetchScholars = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/scholars?filter=${filter}&search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        setScholars(result.data);
      }
    } catch (error) {
      console.error('Error fetching scholars:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Scholar Tracking & Alumni Portal</h1>
              <p className="text-gray-600">Track scholar progress and manage alumni network</p>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search scholars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Scholars</option>
                <option value="active">Active Scholars</option>
                <option value="alumni">Alumni</option>
                <option value="at_risk">At Risk</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Scholar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {scholars.map((scholar, index) => (
            <motion.div
              key={scholar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedScholar(scholar)}
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg font-semibold text-blue-600">
                    {scholar.firstName.charAt(0)}{scholar.lastName.charAt(0)}
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {scholar.firstName} {scholar.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{scholar.course} - {scholar.university}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">GPA</span>
                  <span className="text-sm font-medium text-gray-900">{scholar.gpa}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-900">{scholar.progress.overallScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Attendance</span>
                  <span className="text-sm font-medium text-gray-900">{scholar.progress.attendanceRate}%</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${scholar.progress.overallScore}%` }}
                  ></div>
                </div>
              </div>

              {scholar.alumni && (
                <div className="mt-3 flex items-center text-yellow-600">
                  <StarIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Alumni</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Selected Scholar Details */}
        {selectedScholar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedScholar.firstName} {selectedScholar.lastName}
                </h2>
                <p className="text-gray-600">{selectedScholar.course} - {selectedScholar.university}</p>
              </div>
              <button
                onClick={() => setSelectedScholar(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress Overview */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <AcademicCapIcon className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Academic Progress</p>
                        <p className="text-2xl font-bold text-blue-600">{selectedScholar.progress.academicProgress}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <ChartBarIcon className="w-8 h-8 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Overall Score</p>
                        <p className="text-2xl font-bold text-green-600">{selectedScholar.progress.overallScore}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <CalendarIcon className="w-8 h-8 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Attendance</p>
                        <p className="text-2xl font-bold text-purple-600">{selectedScholar.progress.attendanceRate}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <DocumentTextIcon className="w-8 h-8 text-orange-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Assignments</p>
                        <p className="text-2xl font-bold text-orange-600">{selectedScholar.progress.assignmentCompletion}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Milestones</h3>
                <div className="space-y-3">
                  {selectedScholar.milestones.map((milestone) => (
                    <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                            {milestone.status.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(milestone.priority)}`}>
                            {milestone.priority}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Target: {formatDate(milestone.targetDate)}</span>
                        {milestone.completedDate && (
                          <span>Completed: {formatDate(milestone.completedDate)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Achievements */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                  <div className="space-y-3">
                    {selectedScholar.achievements.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-start space-x-3">
                        <TrophyIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{achievement.title}</h4>
                          <p className="text-xs text-gray-600">{achievement.category}</p>
                          <p className="text-xs text-gray-500">{formatDate(achievement.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mentor */}
                {selectedScholar.mentor && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Mentor</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <BriefcaseIcon className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{selectedScholar.mentor.name}</span>
                      </div>
                      <p className="text-sm text-gray-600">{selectedScholar.mentor.company}</p>
                      <p className="text-sm text-gray-500">{selectedScholar.mentor.specialization}</p>
                      <p className="text-xs text-gray-500">{selectedScholar.mentor.experience} years experience</p>
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{selectedScholar.email}</p>
                    <p className="text-sm text-gray-600">{selectedScholar.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScholarTracking;
