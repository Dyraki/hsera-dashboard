import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const sizeClasses = {
    sm: 'btn-sm h-8 px-3 text-xs gap-1.5 rounded-md',
    md: 'btn-md h-10 px-4 text-sm gap-2 rounded-md', // Default 40px
    lg: 'btn-lg h-12 px-5 text-base gap-2.5 rounded-lg',
  }[size];

  const variantClasses = {
    primary:
      'btn-primary bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-xs focus:ring-2 focus:ring-primary-100',
    secondary:
      'btn-secondary bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 focus:ring-2 focus:ring-gray-200',
    outline:
      'btn-outline bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 focus:ring-2 focus:ring-primary-100',
    ghost:
      'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-2 focus:ring-gray-200',
    danger:
      'bg-error-500 text-white hover:bg-error-600 active:bg-error-700 shadow-xs focus:ring-2 focus:ring-error-100',
    gold:
      'bg-gold-500 text-primary-900 font-semibold hover:bg-gold-600 active:bg-gold-600 shadow-xs focus:ring-2 focus:ring-gold-100',
  }[variant];

  // Guaranteed fallback style to ensure button colors always render
  const guaranteedStyle: React.CSSProperties = { ...style };
  if (variant === 'primary') {
    if (!guaranteedStyle.backgroundColor) guaranteedStyle.backgroundColor = '#6D28D9';
    if (!guaranteedStyle.color) guaranteedStyle.color = '#FFFFFF';
  } else if (variant === 'secondary') {
    if (!guaranteedStyle.backgroundColor) guaranteedStyle.backgroundColor = '#F3F4F6';
    if (!guaranteedStyle.color) guaranteedStyle.color = '#374151';
  }

  return (
    <button
      data-variant={variant}
      data-size={size}
      disabled={disabled || isLoading}
      style={guaranteedStyle}
      className={`inline-flex items-center justify-center font-medium outline-none transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 select-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>
      )}
      <span className="inline-flex items-center whitespace-nowrap">{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
    </button>
  );
};

export default Button;
