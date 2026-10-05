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
      {toast && <div className="fixed right-4 top-4 z-[100] w-[min(28rem,calc(100vw-2rem))]" role="status" aria-live="polite">
        <div className={`flex items-start gap-3 rounded-lg border bg-white p-4 shadow-lg ${toast.kind === 'success' ? 'border-success-200' : 'border-error-200'}`}>
          {toast.kind === 'success' ? <CheckCircle2 className="mt-0.5 shrink-0 text-success-600" size={18} /> : <AlertCircle className="mt-0.5 shrink-0 text-error-600" size={18} />}
          <p className={`min-w-0 flex-1 text-sm ${toast.kind === 'success' ? 'text-success-700' : 'text-error-700'}`}>{toast.message}</p>
          <button type="button" onClick={() => setToast(null)} className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900" aria-label="Tutup notifikasi">
            <X size={15} />
          </button>
        </div>
      </div>}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
