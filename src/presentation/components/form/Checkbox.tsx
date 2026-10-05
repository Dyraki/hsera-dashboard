import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  description?: string;
  error?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className = '', disabled, id, checked, ...props }, ref) => {
    const inputId = id || (typeof label === 'string' ? `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    let boxClasses = 'bg-white border-gray-300 hover:border-primary-600 hover:bg-primary-50';
    if (disabled) {
      boxClasses = 'bg-gray-100 border-gray-200 cursor-not-allowed';
    } else if (error) {
      boxClasses = 'bg-white border-error-500 hover:border-error-600';
    } else if (checked) {
      boxClasses = 'bg-primary-600 border-primary-600 text-white hover:bg-primary-700 hover:border-primary-700';
    }

    return (
      <label
        htmlFor={inputId}
        className={`inline-flex items-start gap-3 select-none ${
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        } ${className}`}
      >
        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <div
            className={`w-5 h-5 rounded-xs border flex items-center justify-center transition-colors duration-150 ${boxClasses}`}
          >
            {checked && <Check size={14} strokeWidth={3} className="text-white" />}
          </div>
        </div>

        {(label || description) && (
          <div className="text-sm">
            {label && <span className="font-medium text-gray-900 block leading-tight">{label}</span>}
            {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
