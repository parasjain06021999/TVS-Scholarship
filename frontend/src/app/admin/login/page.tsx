'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      console.log('Attempting admin login with:', formData);

      const response = await apiClient.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      console.log('Admin login response:', response);

      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('Admin token saved, redirecting to admin dashboard');

        // Redirect to admin dashboard
        router.push('/admin/dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError(err.message || 'Admin login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <div className="h-12 w-12 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
          <p className="text-gray-600 mt-2">Access the TVS Scholarship Admin Portal</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Admin Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="admin@tvsscholarship.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="********"
              required
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="form-checkbox mr-2" />
                Remember Me
              </label>
              <Link href="/forgot-password" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                Forgot Password?
              </Link>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'ADMIN LOGIN'}
            </Button>
          </div>
        </form>

        <div className="text-center mt-6">
          <Link href="/login" className="text-blue-500 hover:text-blue-800 text-sm">
            ← Back to Student Login
          </Link>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Test Admin Credentials: admin@tvsscholarship.com / admin123</p>
        </div>
      </div>
    </div>
  );
}