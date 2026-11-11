import React from 'react';
import { Check, X, ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react';
import { PasswordValidationResult } from '@/core/utils/passwordSecurity';

interface PasswordStrengthMeterProps {
  result: PasswordValidationResult;
  password?: string;
  confirmPassword?: string;
  showChecklist?: boolean;
  onGeneratePassword?: () => void;
  className?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  result,
  password = '',
  confirmPassword,
  showChecklist = true,
  onGeneratePassword,
  className = '',
}) => {
  const isConfirmProvided = confirmPassword !== undefined;
  const isMatch = isConfirmProvided && password.length > 0 && password === confirmPassword;

  // Bar segments (skor 1 sampai 4+)
  const activeSegments = Math.min(4, Math.max(0, result.score));

  const getSegmentColor = (index: number) => {
    if (index >= activeSegments) return 'bg-gray-200';
    switch (result.score) {
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-amber-500';
      case 4:
      case 5:
        return 'bg-emerald-500';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className={`mt-2 p-3 bg-gray-50/80 rounded-lg border border-gray-200/80 text-xs ${className}`}>
      {/* Top Header: Strength Label & Quick Generate Action */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          {result.isValid ? (
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          )}
          <span className="font-semibold text-gray-700">Kekuatan Sandi:</span>
          <span
            className="font-bold px-1.5 py-0.5 rounded text-[11px] uppercase tracking-wide transition-colors"
            style={{
              backgroundColor: `${result.strengthColor}18`,
              color: result.strengthColor,
            }}
          >
            {password.length === 0 ? 'Belum Diisi' : result.strengthLabel}
          </span>
        </div>

        {onGeneratePassword && (
          <button
            type="button"
            onClick={onGeneratePassword}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-2 py-1 rounded transition-colors cursor-pointer"
            title="Buat kata sandi acak yang aman otomatis"
          >
            <Sparkles className="w-3 h-3 text-primary-600" />
            Generate Sandi Kuat
          </button>
        )}
      </div>

      {/* Progress Bar (4 Segments) */}
      <div className="grid grid-cols-4 gap-1.5 mb-2.5">
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${getSegmentColor(idx)}`}
          />
        ))}
      </div>

      {/* Interactive Requirement Checklist */}
      {showChecklist && (
        <div className="space-y-1.5 pt-1.5 border-t border-gray-200/60">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Standar Keamanan Internasional (NIST & OWASP):
          </p>
          {result.criteria.map((c) => (
            <div key={c.id} className="flex items-center gap-2">
              <span
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  c.met ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-400'
                }`}
              >
                {c.met ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <X className="w-2.5 h-2.5" />}
              </span>
              <span
                className={`transition-colors ${
                  c.met ? 'text-gray-800 font-medium' : 'text-gray-500'
                }`}
              >
                {c.label}
              </span>
            </div>
          ))}

          {/* Confirm Password Check if provided */}
          {isConfirmProvided && confirmPassword.length > 0 && (
            <div className="flex items-center gap-2 pt-1 border-t border-dashed border-gray-200">
              <span
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isMatch
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {isMatch ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <X className="w-2.5 h-2.5" />}
              </span>
              <span
                className={`font-semibold ${
                  isMatch ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {isMatch ? 'Konfirmasi password cocok' : 'Konfirmasi password belum cocok'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
