'use client';

import React from 'react';

interface AccessibleFormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' | 'url';
  required?: boolean;
  helpText?: string;
  errorMessage?: string;
  instructions?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  className?: string;
  id?: string;
}

const AccessibleFormField: React.FC<AccessibleFormFieldProps> = ({
  name,
  label,
  type = 'text',
  required = false,
  helpText = null,
  errorMessage = null,
  instructions = null,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  autoComplete,
  maxLength,
  minLength,
  pattern,
  className = '',
  id,
}) => {
  const fieldId = id || `field-${name}`;
  const helpId = `${fieldId}-help`;
  const errorId = `${fieldId}-error`;
  const instructionId = `${fieldId}-instructions`;

  const describedBy = [
    helpText ? helpId : null,
    errorMessage ? errorId : null,
    instructions ? instructionId : null,
  ].filter(Boolean).join(' ');

  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={fieldId} className="form-label">
        {label}
        {required && (
          <span aria-label="required" className="text-red-500 ml-1">
            *
          </span>
        )}
      </label>
      
      {instructions && (
        <div id={instructionId} className="form-instructions">
          {instructions}
        </div>
      )}
      
      <input
        id={fieldId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        aria-required={required}
        aria-invalid={!!errorMessage}
        aria-describedby={describedBy || undefined}
        className={`form-input ${errorMessage ? 'error' : ''}`}
      />
      
      {helpText && (
        <div id={helpId} className="form-help">
          {helpText}
        </div>
      )}
      
      {errorMessage && (
        <div 
          id={errorId} 
          className="form-error" 
          role="alert" 
          aria-live="polite"
        >
          <span className="sr-only">Error: </span>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default AccessibleFormField;
