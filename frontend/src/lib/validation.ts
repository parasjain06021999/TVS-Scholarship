// MANDATORY: Validation schema
export const validationSchema = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: "First name must contain only letters and spaces"
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: "Last name must contain only letters and spaces"
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address"
  },
  mobile: {
    required: true,
    pattern: /^[6-9]\d{9}$/,
    message: "Please enter a valid 10-digit mobile number"
  },
  aadhaar: {
    required: true,
    pattern: /^\d{4}\s\d{4}\s\d{4}$/,
    message: "Please enter a valid Aadhaar number (XXXX XXXX XXXX)"
  },
  pan: {
    required: true,
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    message: "Please enter a valid PAN number"
  },
  percentage: {
    required: true,
    min: 0,
    max: 100,
    message: "Percentage must be between 0 and 100"
  },
  income: {
    required: true,
    min: 0,
    message: "Income must be a positive number"
  },
  dateOfBirth: {
    required: true,
    validate: (value: string) => {
      const date = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 16 && age <= 100;
    },
    message: "Age must be between 16 and 100 years"
  },
  pinCode: {
    required: true,
    pattern: /^\d{6}$/,
    message: "Please enter a valid 6-digit PIN code"
  }
};

// MANDATORY: Real-time validation function
export const validateField = (name: string, value: any): string | null => {
  const rules = validationSchema[name as keyof typeof validationSchema];
  if (!rules) return null;

  if (rules.required && (!value || value.toString().trim() === '')) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
  }

  if (rules.minLength && value && value.length < rules.minLength) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.minLength} characters`;
  }

  if (rules.maxLength && value && value.length > rules.maxLength) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} must be no more than ${rules.maxLength} characters`;
  }

  if (rules.min && value && parseFloat(value) < rules.min) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.min}`;
  }

  if (rules.max && value && parseFloat(value) > rules.max) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} must be no more than ${rules.max}`;
  }

  if (rules.pattern && value && !rules.pattern.test(value)) {
    return rules.message;
  }

  if (rules.validate && value && !rules.validate(value)) {
    return rules.message;
  }

  return null;
};

// MANDATORY: Form validation hook
export const useFormValidation = (initialValues: Record<string, any> = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validateField = useCallback((name: string, value: any) => {
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error || '' }));
    return error;
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(values).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateField,
    validateForm,
    reset,
    isValid: Object.keys(errors).length === 0 && Object.keys(values).length > 0
  };
};

// MANDATORY: Form input component with validation
interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  value: any;
  error?: string;
  touched?: boolean;
  onChange: (value: any) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  [key: string]: any;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type = "text",
  required = false,
  value,
  error,
  touched,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  className = "",
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    onBlur?.();
  };

  return (
    <div className={`form-group ${className}`}>
      <label 
        htmlFor={name}
        className={`block text-sm font-medium ${
          error && touched ? 'text-error-700' : 'text-text-primary'
        }`}
      >
        {label} {required && <span className="text-error-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        aria-required={required}
        aria-invalid={!!(error && touched)}
        aria-describedby={error && touched ? `${name}-error` : `${name}-help`}
        className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
          error && touched
            ? 'border-error-300 text-error-900 placeholder-error-300 focus:border-error-500 focus:ring-error-500'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
        {...props}
      />
      {error && touched && (
        <p id={`${name}-error`} className="mt-2 text-sm text-error-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// MANDATORY: Form select component with validation
interface FormSelectProps {
  name: string;
  label: string;
  required?: boolean;
  value: any;
  error?: string;
  touched?: boolean;
  onChange: (value: any) => void;
  onBlur?: () => void;
  options: Array<{ value: any; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  required = false,
  value,
  error,
  touched,
  onChange,
  onBlur,
  options,
  placeholder,
  disabled = false,
  className = "",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    onBlur?.();
  };

  return (
    <div className={`form-group ${className}`}>
      <label 
        htmlFor={name}
        className={`block text-sm font-medium ${
          error && touched ? 'text-error-700' : 'text-text-primary'
        }`}
      >
        {label} {required && <span className="text-error-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        disabled={disabled}
        aria-required={required}
        aria-invalid={!!(error && touched)}
        aria-describedby={error && touched ? `${name}-error` : `${name}-help`}
        className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
          error && touched
            ? 'border-error-300 text-error-900 focus:border-error-500 focus:ring-error-500'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && touched && (
        <p id={`${name}-error`} className="mt-2 text-sm text-error-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// MANDATORY: Form textarea component with validation
interface FormTextareaProps {
  name: string;
  label: string;
  required?: boolean;
  value: any;
  error?: string;
  touched?: boolean;
  onChange: (value: any) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  name,
  label,
  required = false,
  value,
  error,
  touched,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  rows = 3,
  className = "",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    onBlur?.();
  };

  return (
    <div className={`form-group ${className}`}>
      <label 
        htmlFor={name}
        className={`block text-sm font-medium ${
          error && touched ? 'text-error-700' : 'text-text-primary'
        }`}
      >
        {label} {required && <span className="text-error-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        aria-required={required}
        aria-invalid={!!(error && touched)}
        aria-describedby={error && touched ? `${name}-error` : `${name}-help`}
        className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
          error && touched
            ? 'border-error-300 text-error-900 placeholder-error-300 focus:border-error-500 focus:ring-error-500'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
      />
      {error && touched && (
        <p id={`${name}-error`} className="mt-2 text-sm text-error-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
