import React from 'react';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'gold';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 leading-tight gap-1',
    md: 'text-xs px-2.5 py-1 leading-tight gap-1.5',
  }[size];

  const variantClasses = {
    primary: 'bg-primary-50 text-primary-700 border border-primary-100',
    success: 'bg-success-50 text-success-600 border border-success-100',
    warning: 'bg-warning-50 text-warning-600 border border-warning-100',
    error: 'bg-error-50 text-error-600 border border-error-100',
    info: 'bg-info-50 text-info-600 border border-info-100',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200',
    gold: 'bg-gold-100 text-primary-900 border border-gold-500/30',
  }[variant];

  const dotColors = {
    primary: 'bg-primary-600',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    info: 'bg-info-500',
    neutral: 'bg-gray-500',
    gold: 'bg-gold-600',
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors}`} />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
