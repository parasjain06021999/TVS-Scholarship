'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/hooks/useComponentState';

// MANDATORY: Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback,
  redirectTo = '/login',
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  if (loading) {
    return fallback || <LoadingSpinner message="Checking authentication..." />;
  }

  if (!user) {
    return null; // Will redirect
  }

  if (requiredRole) {
    const userRole = user.role || '';
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    const hasRequiredRole = requiredRoles.includes(userRole);
    
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-error-100 mb-4">
              <svg className="h-6 w-6 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. Please contact your administrator if you believe this is an error.
            </p>
            <button
              onClick={() => router.back()}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

// MANDATORY: Role-based component wrapper
interface RoleBasedComponentProps {
  children: React.ReactNode;
  allowedRoles: string | string[];
  fallback?: React.ReactNode;
}

export const RoleBasedComponent: React.FC<RoleBasedComponentProps> = ({
  children,
  allowedRoles,
  fallback = null,
}) => {
  const { user } = useAuth();
  
  if (!user) return fallback;
  
  const userRole = user.role || '';
  const allowedRolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  const hasPermission = allowedRolesArray.includes(userRole);
  
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

// MANDATORY: Input sanitization utility
export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    // Remove potentially dangerous characters
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(item => sanitizeInput(item));
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    Object.keys(input).forEach(key => {
      sanitized[key] = sanitizeInput(input[key]);
    });
    return sanitized;
  }
  
  return input;
};

// MANDATORY: Secure form input component
interface SecureInputProps {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  [key: string]: any;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  required = false,
  placeholder,
  disabled = false,
  className = "",
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    onChange(sanitizedValue);
  };

  return (
    <div className={`form-group ${className}`}>
      <label 
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-error-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        {...props}
      />
    </div>
  );
};

// MANDATORY: Data masking component
interface MaskedDataProps {
  data: string;
  type: 'aadhaar' | 'pan' | 'mobile' | 'account' | 'email';
  showFull?: boolean;
  className?: string;
}

export const MaskedData: React.FC<MaskedDataProps> = ({
  data,
  type,
  showFull = false,
  className = "",
}) => {
  const maskData = (data: string, type: string): string => {
    if (showFull) return data;
    
    switch (type) {
      case 'aadhaar':
        return `****-****-${data.slice(-4)}`;
      case 'pan':
        return `${data.slice(0, 2)}****${data.slice(-3)}`;
      case 'mobile':
        return `+91-****-***-${data.slice(-3)}`;
      case 'account':
        return `****-****-****-${data.slice(-4)}`;
      case 'email':
        const [local, domain] = data.split('@');
        return `${local.slice(0, 2)}***@${domain}`;
      default:
        return data;
    }
  };

  return (
    <span className={className}>
      {maskData(data, type)}
    </span>
  );
};

// MANDATORY: Security headers component
export const SecurityHeaders: React.FC = () => {
  useEffect(() => {
    // Set security headers
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;";
    document.head.appendChild(meta);

    // Prevent right-click context menu in production
    if (process.env.NODE_ENV === 'production') {
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
      };
      
      document.addEventListener('contextmenu', handleContextMenu);
      
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, []);

  return null;
};

// MANDATORY: Session timeout handler
export const useSessionTimeout = (timeoutMinutes: number = 30) => {
  const { logout } = useAuth();
  const [timeLeft, setTimeLeft] = useState(timeoutMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Reset timer on user activity
    const resetTimer = () => {
      setTimeLeft(timeoutMinutes * 60);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    return () => {
      clearInterval(timer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [timeoutMinutes, logout]);

  return timeLeft;
};

// MANDATORY: Session timeout warning component
interface SessionTimeoutWarningProps {
  timeLeft: number;
  onExtend: () => void;
  onLogout: () => void;
}

export const SessionTimeoutWarning: React.FC<SessionTimeoutWarningProps> = ({
  timeLeft,
  onExtend,
  onLogout,
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (timeLeft > 300) return null; // Only show warning in last 5 minutes

  return (
    <div className="fixed top-4 right-4 bg-warning-50 border border-warning-200 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-warning-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-warning-800">
            Session Timeout Warning
          </h3>
          <div className="mt-2 text-sm text-warning-700">
            <p>Your session will expire in {minutes}:{seconds.toString().padStart(2, '0')}</p>
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={onExtend}
              className="bg-warning-100 text-warning-800 px-3 py-2 text-sm font-medium rounded-md hover:bg-warning-200"
            >
              Extend Session
            </button>
            <button
              onClick={onLogout}
              className="bg-gray-100 text-gray-800 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
