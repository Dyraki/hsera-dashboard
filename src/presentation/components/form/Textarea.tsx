import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean | string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      className = '',
      disabled,
      id,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

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
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          className={`w-full p-3 min-h-[96px] resize-y border rounded-md text-sm font-normal text-gray-900 placeholder:text-gray-500 outline-none transition-colors duration-150 ${stateClasses} ${className}`}
          {...props}
        />
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

Textarea.displayName = 'Textarea';
