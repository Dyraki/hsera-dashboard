import React, { forwardRef } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean | string;
  size?: 'sm' | 'md' | 'lg';
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      size = 'md',
      prefixIcon,
      suffixIcon,
      className = '',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    // Height & padding based on size
    const sizeClasses = {
      sm: 'h-8 text-xs px-3',
      md: 'h-10 text-sm px-3.5', // Default 40px
      lg: 'h-12 text-base px-4',
    }[size];

    // State classes
    let stateClasses = 'bg-white border-gray-300 hover:border-gray-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100';

    if (disabled) {
      stateClasses = 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed hover:border-gray-200';
    } else if (error) {
      stateClasses = 'bg-white border-error-500 text-gray-900 focus:border-error-500 focus:ring-2 focus:ring-error-100';
    } else if (success) {
      stateClasses = 'bg-white border-success-500 text-gray-900 focus:border-success-500 focus:ring-2 focus:ring-success-100';
    }

    const paddingLeft = prefixIcon ? (size === 'sm' ? 'pl-8' : size === 'lg' ? 'pl-11' : 'pl-10') : '';
    const paddingRight = suffixIcon ? (size === 'sm' ? 'pr-8' : size === 'lg' ? 'pr-11' : 'pr-10') : '';

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixIcon && (
            <span className="absolute left-3 text-gray-400 pointer-events-none flex items-center justify-center">
              {prefixIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full border rounded-md font-normal text-gray-900 placeholder:text-gray-500 outline-none transition-colors duration-150 ${sizeClasses} ${stateClasses} ${paddingLeft} ${paddingRight} ${className}`}
            {...props}
          />
          {suffixIcon && (
            <span className="absolute right-3 text-gray-400 flex items-center justify-center">
              {suffixIcon}
            </span>
          )}
        </div>
        {error ? (
          <p className="text-xs text-error-600 font-medium mt-1">{error}</p>
        ) : typeof success === 'string' && success ? (
          <p className="text-xs text-success-600 font-medium mt-1">{success}</p>
        ) : helperText ? (
          <p className="text-xs text-gray-500 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
