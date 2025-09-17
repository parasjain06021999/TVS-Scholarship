'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface AdminStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalStudents: number;
  totalScholarships: number;
  totalAmountDisbursed: number;
}

interface RecentApplication {
  id: string;
  studentName: string;
  scholarshipName: string;
  status: string;
  appliedDate: string;
  amount: string;
}

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<AdminStats>({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalStudents: 0,
    totalScholarships: 0,
    totalAmountDisbursed: 0
  });
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/admin/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'ADMIN' && user.role !== 'REVIEWER' && user.role !== 'SUPER_ADMIN') {
      router.push('/login');
      return;
    }

    setUser(user);
    fetchAdminData();
  }, [router]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const statsRes = await fetch('https://tvs-scholarship.onrender.com/applications/stats/overview', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (statsRes.ok) {
        const s = await statsRes.json();
        setStats({
          totalApplications: s.total || 0,
          pendingApplications: s.pending || 0,
          approvedApplications: s.approved || 0,
          rejectedApplications: s.rejected || 0,
          totalStudents: s.totalStudents || 0,
          totalScholarships: s.totalScholarships || 0,
          totalAmountDisbursed: s.totalAmountDisbursed || 0,
        });
      }

      // Fetch recent applications
      const appsRes = await fetch('https://tvs-scholarship.onrender.com/applications?page=1&limit=5', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (appsRes.ok) {
        const list = await appsRes.json();
        console.log('Dashboard API Response:', list);
        
        // Handle different response structures
        let applicationsData = [];
        if (list.data && list.data.applications) {
          applicationsData = list.data.applications;
        } else if (list.applications) {
          applicationsData = list.applications;
        } else if (Array.isArray(list)) {
          applicationsData = list;
        } else if (list.data && Array.isArray(list.data)) {
          applicationsData = list.data;
        }
        
        console.log('Dashboard Applications data:', applicationsData);
        
        const normalized = applicationsData.map((a: any) => ({
          id: a.id,
          studentName: a.student?.firstName ? `${a.student.firstName} ${a.student.lastName || ''}`.trim() : 'Student',
          scholarshipName: a.scholarship?.title || 'Scholarship',
          status: a.status || 'PENDING',
          appliedDate: a.submittedAt || a.createdAt,
          amount: a.scholarship?.amount || a.awardedAmount || 0
        }));
        setRecentApplications(normalized);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-lg text-gray-600 mt-4">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">TVS Admin Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.firstName || 'Admin'}! 👋</span>
              <Button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  router.push('/admin/login');
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">📝</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Applications</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalApplications}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">⏳</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Review</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.pendingApplications}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">✅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Approved</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.approvedApplications}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">💰</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Amount Disbursed</dt>
                      <dd className="text-lg font-medium text-gray-900">₹{stats.totalAmountDisbursed.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/applications">
                  <Button className="w-full p-4 h-auto flex flex-col items-center space-y-2">
                    <span className="text-2xl">📋</span>
                    <span>Review Applications</span>
                  </Button>
                </Link>
                <Link href="/admin/scholarships">
                  <Button className="w-full p-4 h-auto flex flex-col items-center space-y-2">
                    <span className="text-2xl">🎓</span>
                    <span>Manage Scholarships</span>
                  </Button>
                </Link>
                <Link href="/admin/analytics">
                  <Button className="w-full p-4 h-auto flex flex-col items-center space-y-2">
                    <span className="text-2xl">📊</span>
                    <span>View Analytics</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scholarship
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentApplications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {app.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.scholarshipName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{app.amount ? app.amount.toLocaleString() : '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/admin/applications/${app.id}`} className="text-blue-600 hover:text-blue-900">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}