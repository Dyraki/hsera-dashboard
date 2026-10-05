import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string; // e.g. 'max-w-lg', 'max-w-xl', 'max-w-2xl'
}

export const SlideOver: React.FC<SlideOverProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  width = 'max-w-xl',
}) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with fade-in and subtle blur */}
      <div
        className="fixed inset-0 bg-gray-950/40 backdrop-blur-[2px] transition-opacity duration-300 ease-in-out"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Container pinned to right */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen ${width} bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out`}
          role="dialog"
          aria-modal="true"
        >
          {/* Slide-over Header */}
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-start gap-3">
              {icon && (
                <div className="p-2 rounded-lg bg-primary-50 text-primary-600 mt-0.5 shrink-0">
                  {icon}
                </div>
              )}
              <div>
                <h3 className="text-h4 text-gray-900">{title}</h3>
                {subtitle && <p className="text-caption text-gray-500 mt-0.5 leading-relaxed">{subtitle}</p>}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Tutup (Esc)"
            >
              <X size={20} />
            </button>
          </div>

          {/* Slide-over Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-white">
            {children}
          </div>

          {/* Slide-over Sticky Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 shrink-0 flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
