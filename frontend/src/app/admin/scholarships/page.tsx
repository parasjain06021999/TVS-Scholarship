'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ScholarshipRow {
  id: string;
  title: string;
  category: string;
  amount: number;
  isActive: boolean;
  applicationEndDate: string;
}

export default function AdminScholarshipsPage() {
  const [rows, setRows] = useState<ScholarshipRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
    fetchRows();
  }, [router]);

  const fetchRows = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/scholarships', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to load scholarships');
      const result = await res.json();
      console.log('Scholarships API response:', result);
      
      // Handle the response format - it might be wrapped in a data property
      const data = result.success ? result.data : result;
      const list = Array.isArray(data) ? data : data?.scholarships || data?.data || [];
      const normalized = list.map((s: any) => ({
        id: s.id,
        title: s.title,
        category: s.category,
        amount: Number(s.amount) || 0,
        isActive: !!s.isActive,
        applicationEndDate: s.applicationEndDate
      }));
      setRows(normalized);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/scholarships/${id}/toggle-status`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update');
      }
      const result = await res.json();
      console.log('Status updated:', result);
      await fetchRows();
    } catch (e: any) {
      console.error('Error toggling status:', e);
      alert(e.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-lg text-gray-600 mt-4">Loading scholarships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Manage Scholarships</h1>
            <Link 
              href="/admin/scholarships/new" 
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Create New</span>
            </Link>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>
          )}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((row, index) => (
                  <tr key={row.id} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{row.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {row.category ? row.category.replace('_', ' ') : 'Not specified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">₹{row.amount ? row.amount.toLocaleString() : 'Not specified'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.applicationEndDate ? new Date(row.applicationEndDate).toLocaleDateString() : 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        row.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {row.isActive ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => toggleStatus(row.id)} 
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                            row.isActive
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {row.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <Link 
                          href={`/admin/scholarships/${row.id}`} 
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-xs font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No scholarships found</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first scholarship.</p>
                <Link 
                  href="/admin/scholarships/new"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Create Scholarship
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


