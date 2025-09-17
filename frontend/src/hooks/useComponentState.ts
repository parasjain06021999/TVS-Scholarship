import React, { useState, useCallback } from 'react';

// MANDATORY: Every component must have these states
export interface ComponentState {
  loading: boolean;
  error: string | null;
  success: boolean;
  data: any | null;
}

// MANDATORY: Form state interface
export interface FormState {
  loading: boolean;
  saving: boolean;
  saved: boolean;
  error: string | null;
  validationErrors: Record<string, string>;
  hasChanges: boolean;
}

// MANDATORY: Custom hook for component state management
export const useComponentState = (initialData: any = null) => {
  const [state, setState] = useState<ComponentState>({
    loading: false,
    error: null,
    success: false,
    data: initialData
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: loading ? null : prev.error }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false, success: false }));
  }, []);

  const setSuccess = useCallback((success: boolean, data?: any) => {
    setState(prev => ({ 
      ...prev, 
      success, 
      loading: false, 
      error: success ? null : prev.error,
      data: data !== undefined ? data : prev.data
    }));
  }, []);

  const setData = useCallback((data: any) => {
    setState(prev => ({ ...prev, data, loading: false, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      success: false,
      data: initialData
    });
  }, [initialData]);

  return {
    state,
    setLoading,
    setError,
    setSuccess,
    setData,
    reset
  };
};

// MANDATORY: Custom hook for form state management
export const useFormState = () => {
  const [state, setState] = useState<FormState>({
    loading: false,
    saving: false,
    saved: false,
    error: null,
    validationErrors: {},
    hasChanges: false
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: loading ? null : prev.error }));
  }, []);

  const setSaving = useCallback((saving: boolean) => {
    setState(prev => ({ ...prev, saving, error: saving ? null : prev.error }));
  }, []);

  const setSaved = useCallback((saved: boolean) => {
    setState(prev => ({ ...prev, saved, saving: false, hasChanges: saved ? false : prev.hasChanges }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false, saving: false, success: false }));
  }, []);

  const setValidationErrors = useCallback((errors: Record<string, string>) => {
    setState(prev => ({ ...prev, validationErrors: errors }));
  }, []);

  const setHasChanges = useCallback((hasChanges: boolean) => {
    setState(prev => ({ ...prev, hasChanges }));
  }, []);

  const reset = useCallback(() => {
    setState({
      loading: false,
      saving: false,
      saved: false,
      error: null,
      validationErrors: {},
      hasChanges: false
    });
  }, []);

  return {
    state,
    setLoading,
    setSaving,
    setSaved,
    setError,
    setValidationErrors,
    setHasChanges,
    reset
  };
};

// MANDATORY: Loading component
export const LoadingSpinner = ({ message = "Loading..." }: { message?: string }): React.ReactElement => {
  return React.createElement('div', { className: "flex items-center justify-center p-8" },
    React.createElement('div', { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" }),
    React.createElement('span', { className: "ml-2 text-gray-600" }, message)
  );
};

// MANDATORY: Error display component
export const ErrorDisplay = ({ 
  error, 
  onRetry, 
  canRetry = true 
}: { 
  error: string; 
  onRetry?: () => void; 
  canRetry?: boolean;
}): React.ReactElement => {
  return React.createElement('div', { className: "bg-red-50 border border-red-200 rounded-lg p-4" },
    React.createElement('div', { className: "flex" },
      React.createElement('div', { className: "ml-3" },
        React.createElement('h3', { className: "text-sm font-medium text-red-800" }, "Error"),
        React.createElement('p', { className: "mt-2 text-sm text-red-700" }, error),
        canRetry && onRetry && React.createElement('button', {
          onClick: onRetry,
          className: "mt-3 text-sm font-medium text-red-800 hover:text-red-600"
        }, "Try Again")
      )
    )
  );
};

// MANDATORY: Success message component
export const SuccessMessage = ({ 
  message, 
  onDismiss, 
  autoHide = true 
}: { 
  message: string; 
  onDismiss?: () => void; 
  autoHide?: boolean;
}) => {
  React.useEffect(() => {
    if (autoHide && onDismiss) {
      const timer = setTimeout(onDismiss, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoHide, onDismiss]);

  return (
    <div className="bg-success-50 border border-success-200 rounded-md p-4 mb-4">
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
