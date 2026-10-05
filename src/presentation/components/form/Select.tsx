import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean | string;
  size?: 'sm' | 'md' | 'lg';
  options?: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      size = 'md',
      options,
      placeholder = 'Pilih opsi...',
      className = '',
      disabled,
      id,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    const sizeClasses = {
      sm: 'h-8 text-xs pl-3 pr-8',
      md: 'h-10 text-sm pl-3.5 pr-10', // Default 40px
      lg: 'h-12 text-base pl-4 pr-11',
    }[size];

    let stateClasses = 'bg-white border-gray-300 hover:border-gray-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100';

    if (disabled) {
      stateClasses = 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed hover:border-gray-200';
    } else if (error) {
      stateClasses = 'bg-white border-error-500 text-gray-900 focus:border-error-500 focus:ring-2 focus:ring-error-100';
    } else if (success) {
      stateClasses = 'bg-white border-success-500 text-gray-900 focus:border-success-500 focus:ring-2 focus:ring-success-100';
    }

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`w-full appearance-none border rounded-md font-normal text-gray-900 outline-none transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed ${sizeClasses} ${stateClasses} ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-gray-500">
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <span className="absolute right-3 text-gray-500 pointer-events-none flex items-center justify-center">
            <ChevronDown size={18} />
          </span>
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

Select.displayName = 'Select';
