import React, { createContext, useContext, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export type ToastKind = 'success' | 'error';

interface ToastMessage {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  showToast: (kind: ToastKind, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (kind: ToastKind, message: string) => {
    setToast({ id: Date.now(), kind, message });
  };

  useEffect(() => {
    if (!toast) return;
    const timerId = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timerId);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed right-5 top-5 z-[100] w-[min(26rem,calc(100vw-2.5rem))] animate-in slide-in-from-top-3 fade-in duration-200" role="status" aria-live="polite">
          <div className={`flex items-start gap-3 rounded-xl border bg-white p-4 shadow-xl ${toast.kind === 'success' ? 'border-success-200 shadow-success-500/10' : 'border-error-200 shadow-error-500/10'}`}>
            <div className={`rounded-lg p-1.5 shrink-0 ${toast.kind === 'success' ? 'bg-success-50 text-success-600' : 'bg-error-50 text-error-600'}`}>
              {toast.kind === 'success' ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <h4 className="text-xs font-bold text-gray-900 tracking-wide uppercase">
                {toast.kind === 'success' ? 'Berhasil' : 'Pemberitahuan'}
              </h4>
              <p className="text-xs text-gray-700 mt-0.5 leading-relaxed font-medium">
                {toast.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0"
              aria-label="Tutup notifikasi"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
