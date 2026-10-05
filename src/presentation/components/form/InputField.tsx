import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, error, ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 shadow-inner outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
      />
      {error && <span className="mt-1 block text-xs text-rose-400">{error}</span>}
    </div>
  );
};
