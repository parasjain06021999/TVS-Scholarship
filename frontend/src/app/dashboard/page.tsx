'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Global flag to prevent duplicate API calls across component instances
let isDataFetching = false;

interface Application {
  id: string;
  title: string;
  status: string;
  appliedDate: string;
  progress: number;
  amount: string;
  nextStep: string;
  scholarshipId: string;
  statusColor: string;
  statusBg: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: string;
  isRead: boolean;
}

interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePicture?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const router = useRouter();
  const fetchRef = useRef(false);

  const fetchStudentData = useCallback(async () => {
    // Prevent duplicate calls using global flag
    if (isDataFetching) {
      console.log('Data fetching already in progress, skipping...');
      return;
    }

    if (dataFetched) {
      console.log('Data already fetched, skipping...');
      return;
    }

    try {
      isDataFetching = true;
      setLoading(true);
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const currentUser = userData ? JSON.parse(userData) : null;
      
      // Make all API calls in parallel
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      };

      const [profileResponse, applicationsResponse, notificationsResponse] = await Promise.allSettled([
        fetch('https://tvs-scholarship-a1fi.vercel.app/auth/profile', { 
          method: 'GET',
          headers,
          credentials: 'include',
          mode: 'cors'
        }),
        fetch('https://tvs-scholarship-a1fi.vercel.app/applications', { 
          method: 'GET',
          headers,
          credentials: 'include',
          mode: 'cors'
        }),
        fetch('https://tvs-scholarship-a1fi.vercel.app/notifications', { 
          method: 'GET',
          headers,
          credentials: 'include',
          mode: 'cors'
        })
      ]);

      // Handle profile data
      if (profileResponse.status === 'fulfilled' && profileResponse.value.ok) {
        const profileData = await profileResponse.value.json();
        console.log('Profile data received:', profileData);
        
        if (profileData.user && profileData.user.student) {
          const studentData = profileData.user.student;
          setStudentProfile({
            id: studentData.id,
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: profileData.user.email,
            phone: studentData.phone,
            dateOfBirth: studentData.dateOfBirth,
            gender: studentData.gender,
            address: studentData.address,
            city: studentData.city,
            state: studentData.state,
            pincode: studentData.pincode
          });
        }
      } else {
        console.log('Using mock profile data');
        setStudentProfile({
          id: currentUser?.id || '1',
          firstName: currentUser?.firstName || 'John',
          lastName: currentUser?.lastName || 'Doe',
          email: currentUser?.email || 'student@example.com',
          phone: '+91 98765 43210'
        });
      }

      // Handle applications data
      if (applicationsResponse.status === 'fulfilled' && applicationsResponse.value.ok) {
        const data = await applicationsResponse.value.json();
        console.log('Applications data received:', data);
        
        // Handle different response structures
        let applicationsList = [];
        if (data.data && data.data.applications) {
          applicationsList = data.data.applications;
        } else if (data.applications) {
          applicationsList = data.applications;
        } else if (Array.isArray(data)) {
          applicationsList = data;
        } else if (data.data && Array.isArray(data.data)) {
          applicationsList = data.data;
        }
        
        console.log('Applications list extracted:', applicationsList);
        
        const enhancedApplications = applicationsList.map((app: any) => ({
          id: app.id,
          title: app.scholarship?.title || 'Unknown Scholarship',
          status: app.status,
          appliedDate: app.createdAt || app.submittedAt,
          progress: getProgressFromStatus(app.status),
          amount: app.scholarship?.amount ? `₹${app.scholarship.amount.toLocaleString()}` : '₹0',
          nextStep: getNextStepFromStatus(app.status),
          scholarshipId: app.scholarshipId,
          statusColor: getStatusColor(app.status),
          statusBg: getStatusBg(app.status)
        }));
        
        console.log('Enhanced applications:', enhancedApplications);
        setApplications(enhancedApplications);
      } else {
        console.log('Using mock applications data');
        setApplications([
          {
            id: '1',
            title: 'TVS Merit Scholarship 2024',
            status: 'UNDER_REVIEW',
            appliedDate: '2024-01-15',
            progress: 60,
            amount: '₹50,000',
            nextStep: 'Interview Scheduled',
            scholarshipId: 'sch-1',
            statusColor: 'text-yellow-800',
            statusBg: 'bg-yellow-100'
          },
          {
            id: '2',
            title: 'TVS Need-based Scholarship 2023',
            status: 'APPROVED',
            appliedDate: '2023-03-10',
            progress: 100,
            amount: '₹25,000',
            nextStep: 'Funds Disbursed',
            scholarshipId: 'sch-2',
            statusColor: 'text-green-800',
            statusBg: 'bg-green-100'
          },
          {
            id: '3',
            title: 'TVS Engineering Excellence Scholarship 2024',
            status: 'PENDING',
            appliedDate: '2024-02-01',
            progress: 30,
            amount: '₹75,000',
            nextStep: 'Document Verification',
            scholarshipId: 'sch-3',
            statusColor: 'text-blue-800',
            statusBg: 'bg-blue-100'
          }
        ]);
      }

      // Handle notifications data
      if (notificationsResponse.status === 'fulfilled' && notificationsResponse.value.ok) {
        const data = await notificationsResponse.value.json();
        console.log('Notifications data received:', data);
        setNotifications(data.notifications || data.data || []);
      } else {
        console.log('Using mock notifications data');
        setNotifications([
          {
            id: '1',
            title: 'Document verification completed',
            message: 'Your documents have been verified successfully for TVS Merit Scholarship',
            time: '2 days ago',
            type: 'success',
            isRead: false
          },
          {
            id: '2',
            title: 'Interview scheduled',
            message: 'Your interview is scheduled for 25 Jan 2024 at 2:00 PM',
            time: '5 days ago',
            type: 'info',
            isRead: false
          },
          {
            id: '3',
            title: 'Profile updated successfully',
            message: 'Your profile information has been updated',
            time: '1 week ago',
            type: 'success',
            isRead: true
          },
          {
            id: '4',
            title: 'New scholarship available',
            message: 'TVS Engineering Excellence Scholarship 2024 is now open for applications',
            time: '2 weeks ago',
            type: 'info',
            isRead: true
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch student data:', error);
    } finally {
      setLoading(false);
      setDataFetched(true);
      isDataFetching = false;
    }
  }, [dataFetched]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role === 'ADMIN' || user.role === 'REVIEWER') {
      router.push('/admin/dashboard');
      return;
    }

    setUser(user);
    
    // Use ref to prevent duplicate calls in React Strict Mode
    if (!fetchRef.current) {
      fetchRef.current = true;
      fetchStudentData();
    }
  }, [router]); // Remove fetchStudentData dependency to prevent infinite loop

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-green-800';
      case 'UNDER_REVIEW': return 'text-yellow-800';
      case 'PENDING': return 'text-blue-800';
      case 'REJECTED': return 'text-red-800';
      case 'DISBURSED': return 'text-purple-800';
      default: return 'text-gray-800';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100';
      case 'UNDER_REVIEW': return 'bg-yellow-100';
      case 'PENDING': return 'bg-blue-100';
      case 'REJECTED': return 'bg-red-100';
      case 'DISBURSED': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  };

  const getProgressFromStatus = (status: string) => {
    switch (status) {
      case 'PENDING': return 25;
      case 'UNDER_REVIEW': return 60;
      case 'APPROVED': return 90;
      case 'DISBURSED': return 100;
      case 'REJECTED': return 0;
      default: return 0;
    }
  };

  const getNextStepFromStatus = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Document Verification';
      case 'UNDER_REVIEW': return 'Interview Scheduled';
      case 'APPROVED': return 'Funds Disbursed';
      case 'DISBURSED': return 'Completed';
      case 'REJECTED': return 'Application Rejected';
      default: return 'Processing';
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const fullName = studentProfile ? 
    `${studentProfile.firstName || ''} ${studentProfile.lastName || ''}`.trim() : 
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Student';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TVS Scholarship Portal</h1>
                <p className="text-sm text-gray-500">Student Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Welcome back,</p>
                <p className="text-lg font-semibold text-gray-900">{fullName}! 👋</p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  router.push('/login');
                }}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* My Applications Section */}
          <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl mb-8 border border-gray-100">
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
                <Link 
                  href="/scholarships"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  Apply for New Scholarship
                </Link>
              </div>
            </div>
            <div className="p-8">
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                  <p className="text-gray-600 mb-6">Start your scholarship journey by applying for available scholarships.</p>
                  <Link 
                    href="/scholarships"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    Browse Scholarships
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {applications.map((app) => (
                    <div key={app.id} className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${app.statusBg} ${app.statusColor}`}>
                            {app.status.replace('_', ' ')}
                          </div>
                          <div className="text-sm text-gray-500">
                            Applied: {new Date(app.appliedDate).toLocaleDateString('en-IN', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{app.amount}</div>
                          <div className="text-sm text-gray-500">Scholarship Amount</div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{app.title}</h3>
                      
                      <div className="mb-6">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                          <span className="font-medium">Application Progress</span>
                          <span className="font-semibold">{app.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${app.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600 font-medium">
                            Next: {app.nextStep}
                          </span>
                        </div>
                        <Link 
                          href={`/applications/${app.id}`}
                          className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 py-2.5 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions and Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 gap-6">
                  <Link 
                    href="/scholarships"
                    className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">New Application</div>
                    </div>
                  </Link>
                  <Link 
                    href="/documents"
                    className="group p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">View Documents</div>
                    </div>
                  </Link>
                  <Link 
                    href="/profile"
                    className="group p-6 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-2xl hover:from-purple-100 hover:to-violet-100 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">Update Profile</div>
                    </div>
                  </Link>
                  <Link 
                    href="/support"
                    className="group p-6 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl hover:from-orange-100 hover:to-red-100 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">Contact Support</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                  <Link 
                    href="/notifications"
                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-8">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5L19 5" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.slice(0, 4).map((notification) => (
                      <div key={notification.id} className={`p-4 rounded-xl border-l-4 ${
                        notification.type === 'success' ? 'bg-green-50 border-green-400' :
                        notification.type === 'info' ? 'bg-blue-50 border-blue-400' :
                        'bg-gray-50 border-gray-400'
                      } ${!notification.isRead ? 'ring-2 ring-blue-100' : ''}`}>
                        <div className="flex items-start space-x-3">
                          <div className={`w-3 h-3 rounded-full mt-2 ${
                            notification.type === 'success' ? 'bg-green-500' :
                            notification.type === 'info' ? 'bg-blue-500' :
                            'bg-gray-500'
                          }`}></div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900 mb-1">{notification.title}</div>
                            <div className="text-sm text-gray-600 mb-2">{notification.message}</div>
                            <div className="text-xs text-gray-500">{notification.time}</div>
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">TVS Scholarship Portal</p>
                <p className="text-xs text-gray-500">Empowering Education</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              © 2024 TVS Group. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
