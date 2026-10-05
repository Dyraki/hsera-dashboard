import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  onClear?: () => void;
  helperText?: string;
  error?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      label,
      size = 'md',
      placeholder = 'Cari data...',
      value,
      onChange,
      onClear,
      className = '',
      disabled,
      helperText,
      error,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `search-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    const sizeClasses = {
      sm: 'h-8 text-xs pl-8 pr-8',
      md: 'h-10 text-sm pl-9 pr-9', // Default 40px
      lg: 'h-12 text-base pl-11 pr-11',
    }[size];

    const iconSizes = {
      sm: 14,
      md: 17,
      lg: 20,
    }[size];

    const hasValue = Boolean(value && String(value).length > 0);

    let stateClasses = 'bg-white border-gray-300 hover:border-gray-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100';
    if (disabled) {
      stateClasses = 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed hover:border-gray-200';
    } else if (error) {
      stateClasses = 'bg-white border-error-500 text-gray-900 focus:border-error-500 focus:ring-2 focus:ring-error-100';
    }

    const handleClear = () => {
      if (onClear) {
        onClear();
      } else if (onChange) {
        const syntheticEvent = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <span className="absolute left-3 text-gray-400 pointer-events-none flex items-center justify-center">
            <Search size={iconSizes} />
          </span>
          <input
            ref={ref}
            id={inputId}
            type="text"
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full border rounded-md font-normal text-gray-900 placeholder:text-gray-500 outline-none transition-colors duration-150 ${sizeClasses} ${stateClasses} ${className}`}
            {...props}
          />
          {hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Hapus pencarian"
            >
              <X size={15} />
            </button>
          )}
        </div>
        {error ? (
          <p className="text-xs text-error-600 font-medium mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-gray-500 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
