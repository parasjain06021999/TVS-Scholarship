'use client';

import React, { Component, ErrorInfo, ReactNode, useEffect, useState, useCallback } from 'react';
import { Button } from './Button';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// MANDATORY: Global error boundary
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application Error:', error, errorInfo);
    
    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo);
    }
    
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-error-500" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Something went wrong
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                We're sorry for the inconvenience. The application has encountered an unexpected error.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <Button
                onClick={this.handleRetry}
                className="w-full flex justify-center items-center"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                variant="secondary"
                onClick={this.handleReload}
                className="w-full"
              >
                Refresh Page
              </Button>
            </div>

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 bg-gray-100 rounded-lg p-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                  Technical Details (Development Only)
                </summary>
                <div className="text-xs text-gray-600 space-y-2">
                  <div>
                    <strong>Error:</strong>
                    <pre className="mt-1 p-2 bg-white rounded border overflow-auto">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 p-2 bg-white rounded border overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// MANDATORY: Network error handler component
interface NetworkErrorHandlerProps {
  error: string;
  onRetry?: () => void;
  canRetry?: boolean;
  className?: string;
}

export const NetworkErrorHandler: React.FC<NetworkErrorHandlerProps> = ({
  error,
  onRetry,
  canRetry = true,
  className = "",
}) => {
  const getErrorMessage = (error: string): string => {
    if (error.includes('timeout')) {
      return 'The request took too long to complete. Please check your internet connection and try again.';
    }
    if (error.includes('Network Error')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    if (error.includes('500')) {
      return 'Server error occurred. Our team has been notified. Please try again later.';
    }
    if (error.includes('404')) {
      return 'The requested resource was not found.';
    }
    if (error.includes('403')) {
      return 'You do not have permission to access this resource.';
    }
    if (error.includes('401')) {
      return 'Authentication required. Please log in again.';
    }
    return 'An unexpected error occurred. Please try again.';
  };

  return (
    <div className={`bg-error-50 border border-error-200 rounded-lg p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-error-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-error-800">Connection Error</h3>
          <div className="mt-2 text-sm text-error-700">
            <p>{getErrorMessage(error)}</p>
          </div>
          {canRetry && onRetry && (
            <div className="mt-4">
              <Button
                onClick={onRetry}
                variant="secondary"
                size="sm"
                className="bg-error-100 text-error-800 hover:bg-error-200"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// MANDATORY: Form validation error display
interface FormErrorsProps {
  errors: Record<string, string>;
  className?: string;
}

export const FormErrors: React.FC<FormErrorsProps> = ({
  errors,
  className = "",
}) => {
  if (!errors || Object.keys(errors).length === 0) return null;

  return (
    <div className={`bg-error-50 border border-error-200 rounded-md p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-error-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-error-800">Please correct the following errors:</h3>
          <div className="mt-2 text-sm text-error-700">
            <ul className="list-disc space-y-1 pl-5">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// MANDATORY: Success message component
interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
  autoHide?: boolean;
  className?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onDismiss,
  autoHide = true,
  className = "",
}) => {
  useEffect(() => {
    if (autoHide && onDismiss) {
      const timer = setTimeout(onDismiss, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoHide, onDismiss]);

  return (
    <div className={`bg-success-50 border border-success-200 rounded-md p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-success-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-success-800">{message}</p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className="text-success-400 hover:text-success-500 focus:outline-none"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// MANDATORY: Loading states component
interface LoadingStateProps {
  loading: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  children,
  fallback,
  className = "",
}) => {
  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        {fallback || (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

// MANDATORY: Error retry hook
export const useErrorRetry = (maxRetries: number = 3) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(async (fn: () => Promise<any>) => {
    if (retryCount >= maxRetries) {
      throw new Error('Maximum retry attempts reached');
    }

    setIsRetrying(true);
    try {
      const result = await fn();
      setRetryCount(0);
      return result;
    } catch (error) {
      setRetryCount(prev => prev + 1);
      throw error;
    } finally {
      setIsRetrying(false);
    }
  }, [retryCount, maxRetries]);

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    retry,
    reset,
    retryCount,
    isRetrying,
    canRetry: retryCount < maxRetries
  };
};
