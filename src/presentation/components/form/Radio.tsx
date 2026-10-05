import React, { forwardRef } from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  description?: string;
  error?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, error, className = '', disabled, id, checked, ...props }, ref) => {
    const inputId = id || (typeof label === 'string' ? `radio-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    let circleClasses = 'bg-white border-gray-300 hover:border-primary-600 hover:bg-primary-50';
    if (disabled) {
      circleClasses = 'bg-gray-100 border-gray-200 cursor-not-allowed';
    } else if (error) {
      circleClasses = 'bg-white border-error-500 hover:border-error-600';
    } else if (checked) {
      circleClasses = 'bg-white border-primary-600';
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
            type="radio"
            checked={checked}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-150 ${circleClasses}`}
          >
            {checked && (
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  disabled ? 'bg-gray-400' : 'bg-primary-600'
                }`}
              />
            )}
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

Radio.displayName = 'Radio';
