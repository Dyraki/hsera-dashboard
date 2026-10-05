import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id,
  className = '',
}) => {
  const switchId = id || (typeof label === 'string' ? `switch-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  let trackColor = 'bg-gray-300';
  if (disabled) {
    trackColor = 'bg-gray-200 cursor-not-allowed';
  } else if (checked) {
    trackColor = 'bg-primary-600';
  }

  return (
    <label
      htmlFor={switchId}
      className={`inline-flex items-start gap-3 select-none ${
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      } ${className}`}
    >
      <div className="relative inline-flex items-center mt-0.5 shrink-0">
        <input
          id={switchId}
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          onClick={handleToggle}
          className={`w-[40px] h-[24px] rounded-full p-[3px] transition-colors duration-200 ease-in-out ${trackColor}`}
        >
          <div
            className={`w-[18px] h-[18px] bg-white rounded-full shadow-xs transform transition-transform duration-200 ease-in-out ${
              checked ? 'translate-x-[16px]' : 'translate-x-0'
            }`}
          />
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
};
