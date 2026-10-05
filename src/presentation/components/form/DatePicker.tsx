import React, { forwardRef, useRef } from 'react';
import { Calendar } from 'lucide-react';

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean | string;
  size?: 'sm' | 'md' | 'lg';
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      size = 'md',
      className = '',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const dateId = id || (label ? `datepicker-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    const sizeClasses = {
      sm: 'h-8 text-xs pl-8 pr-3',
      md: 'h-10 text-sm pl-9 pr-3.5', // Default 40px
      lg: 'h-12 text-base pl-11 pr-4',
    }[size];

    const iconSizes = {
      sm: 14,
      md: 17,
      lg: 20,
    }[size];

    let stateClasses = 'bg-white border-gray-300 hover:border-gray-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100';

    if (disabled) {
      stateClasses = 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed hover:border-gray-200';
    } else if (error) {
      stateClasses = 'bg-white border-error-500 text-gray-900 focus:border-error-500 focus:ring-2 focus:ring-error-100';
    } else if (success) {
      stateClasses = 'bg-white border-success-500 text-gray-900 focus:border-success-500 focus:ring-2 focus:ring-success-100';
    }

    const handleIconClick = () => {
      if (inputRef.current && !disabled) {
        if ('showPicker' in HTMLInputElement.prototype) {
          try {
            inputRef.current.showPicker();
          } catch {
            inputRef.current.focus();
          }
        } else {
          inputRef.current.focus();
        }
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={dateId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <button
            type="button"
            tabIndex={-1}
            onClick={handleIconClick}
            disabled={disabled}
            className="absolute left-3 text-gray-400 hover:text-primary-600 disabled:text-gray-300 transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            <Calendar size={iconSizes} />
          </button>
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            id={dateId}
            type="date"
            disabled={disabled}
            className={`w-full border rounded-md font-normal text-gray-900 placeholder:text-gray-500 outline-none transition-colors duration-150 ${sizeClasses} ${stateClasses} ${className}`}
            {...props}
          />
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

DatePicker.displayName = 'DatePicker';
