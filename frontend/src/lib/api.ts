import { useState, useEffect, useCallback } from 'react';

// MANDATORY: API utility with proper error handling
class APIClient {
  // Base URL should match backend routes (no "/api" prefix unless backend sets global prefix)
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  private timeout = 30000; // 30 seconds

  async request(endpoint: string, options: RequestInit = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
          'X-Requested-With': 'XMLHttpRequest', // CSRF protection
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          // Do NOT auto-redirect on login endpoint; let caller handle it
          const isLoginEndpoint = endpoint.includes('/auth/login');
          if (!isLoginEndpoint) {
            this.clearToken();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
          throw new Error(errorData.message || 'Authentication required');
        }
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      
      throw error;
    }
  }

  // MANDATORY: Retry mechanism for failed requests
  async requestWithRetry(endpoint: string, options: RequestInit = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        return await this.request(endpoint, options);
      } catch (error) {
        if (i === retries - 1) throw error;
        
        // Exponential backoff
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // MANDATORY: Token management
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
  }

  // MANDATORY: Token refresh mechanism
  async refreshToken(): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        return data.token;
      }
      throw new Error('Token refresh failed');
    } catch (error) {
      this.clearToken();
      window.location.href = '/login';
      throw error;
    }
  }

  // MANDATORY: Authenticated API calls with token refresh
  async authenticatedRequest(endpoint: string, options: RequestInit = {}) {
    let token = this.getToken();

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...options.headers,
        },
      });

      if (response.status === 401) {
        // Token expired, try to refresh
        token = await this.refreshToken();
        
        // Retry with new token
        return fetch(`${this.baseURL}${endpoint}`, {
          ...options,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...options.headers,
          },
        });
      }

      return response;
    } catch (error) {
      throw new Error(`API call failed: ${error.message}`);
    }
  }

  // MANDATORY: File upload with progress
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Upload failed'));
      
      xhr.open('POST', `${this.baseURL}/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${this.getToken()}`);
      xhr.send(formData);
    });
  }

  // MANDATORY: Data masking for sensitive information
  maskSensitiveData(data: any, fields: string[] = ['aadhaar', 'accountNumber', 'mobile']): any {
    const masked = { ...data };
    
    fields.forEach(field => {
      if (masked[field]) {
        if (field === 'aadhaar') {
          masked[field] = `****-****-${masked[field].slice(-4)}`;
        } else if (field === 'accountNumber') {
          masked[field] = `****-****-****-${masked[field].slice(-4)}`;
        } else if (field === 'mobile') {
          masked[field] = `+91-****-***-${masked[field].slice(-3)}`;
        }
      }
    });
    
    return masked;
  }
}

export const api = new APIClient();
export const apiClient = api; // Alias for backward compatibility

// MANDATORY: Custom hook for API calls
export const useAPI = (endpoint: string, options: any = {}) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await api.requestWithRetry(endpoint, options);
        
        if (!isCancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (!isCancelled) {
          setState({ 
            data: null, 
            loading: false, 
            error: error.message || 'An error occurred' 
          });
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [endpoint, JSON.stringify(options)]);

  return state;
};

// MANDATORY: Custom hook for authenticated API calls
export const useAuthenticatedAPI = () => {
  const apiCall = useCallback(async (url: string, options: RequestInit = {}) => {
    try {
      const response = await api.authenticatedRequest(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`API call failed: ${error.message}`);
    }
  }, []);

  return { apiCall };
};

// MANDATORY: API endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  CHANGE_PASSWORD: '/auth/change-password',
  
  // Students
  STUDENTS: '/students',
  STUDENT_PROFILE: '/students/profile',
  UPDATE_PROFILE: '/students/profile',
  
  // Scholarships
  SCHOLARSHIPS: '/scholarships',
  SCHOLARSHIP_DETAILS: '/scholarships/:id',
  ELIGIBILITY_CHECK: '/scholarships/eligibility',
  
  // Applications
  APPLICATIONS: '/applications',
  APPLICATION_DETAILS: '/applications/:id',
  SUBMIT_APPLICATION: '/applications',
  UPDATE_APPLICATION: '/applications/:id',
  
  // Documents
  UPLOAD_DOCUMENT: '/documents/upload',
  DOCUMENTS: '/documents',
  DOCUMENT_DETAILS: '/documents/:id',
  
  // Payments
  PAYMENTS: '/payments',
  PAYMENT_DETAILS: '/payments/:id',
  PAYMENT_STATUS: '/payments/:id/status',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  MARK_READ: '/notifications/:id/read',
  
  // Analytics
  DASHBOARD_STATS: '/analytics/dashboard',
  APPLICATION_STATS: '/analytics/applications',
  PAYMENT_STATS: '/analytics/payments',
};

// MANDATORY: Error handling utilities
export const getErrorMessage = (error: any): string => {
  if (error.message.includes('timeout')) {
    return 'The request took too long to complete. Please check your internet connection and try again.';
  }
  if (error.message.includes('Network Error')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  if (error.message.includes('500')) {
    return 'Server error occurred. Our team has been notified. Please try again later.';
  }
  if (error.message.includes('404')) {
    return 'The requested resource was not found.';
  }
  if (error.message.includes('403')) {
    return 'You do not have permission to access this resource.';
  }
  if (error.message.includes('401')) {
    return 'Authentication required. Please log in again.';
  }
  return 'An unexpected error occurred. Please try again.';
};

// MANDATORY: Network error handler utility
export const createNetworkErrorHandler = ({ 
  error, 
  onRetry, 
  canRetry = true 
}: { 
  error: string; 
  onRetry?: () => void; 
  canRetry?: boolean;
}) => {
  return {
    error: getErrorMessage({ message: error }),
    canRetry: canRetry && !!onRetry,
    onRetry
  };
};