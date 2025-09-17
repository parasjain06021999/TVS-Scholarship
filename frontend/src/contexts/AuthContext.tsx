'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  role: 'STUDENT' | 'ADMIN' | 'REVIEWER' | 'SUPER_ADMIN';
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
  };
  adminProfile?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  isAuthenticated: boolean;
  isStudent: boolean;
  isAdmin: boolean;
  isReviewer: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await apiClient.request('/auth/profile');
      setUser(response.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      // Token will be cleared by apiClient
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiClient.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const { user, token } = response;

      localStorage.setItem('token', token);
      setUser(user);

      toast.success('Login successful!');
      
      // Redirect based on role
      if (user.role === 'STUDENT') {
        router.push('/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const response = await apiClient.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      const { user, token } = response;

      localStorage.setItem('token', token);
      setUser(user);

      toast.success('Registration successful!');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
    toast.success('Logged out successfully');
  };

  const updateProfile = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const isAuthenticated = !!user;
  const isStudent = user?.role === 'STUDENT';
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isReviewer = user?.role === 'REVIEWER' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
    isStudent,
    isAdmin,
    isReviewer,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
