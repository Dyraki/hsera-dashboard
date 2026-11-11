import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type ToastKind = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title?: string;
  duration?: number;
}

interface ToastMessage {
  id: number;
  kind: ToastKind;
  message: string;
  title?: string;
  duration: number;
}

interface ToastContextValue {
  showToast: (kind: ToastKind, message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const remainingRef = useRef<number>(4000);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const closeToast = useCallback(() => {
    clearTimer();
    setToast(null);
    setIsPaused(false);
  }, []);

  const showToast = useCallback((kind: ToastKind, message: string, options?: ToastOptions) => {
    clearTimer();
    const duration = options?.duration ?? 4000;
    remainingRef.current = duration;
    startTimeRef.current = Date.now();
    setIsPaused(false);

    setToast({
      id: Date.now(),
      kind,
      message,
      title: options?.title,
      duration,
    });
  }, []);

  // Timer auto dismiss logic
  useEffect(() => {
    if (!toast || isPaused) return;

    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      closeToast();
    }, remainingRef.current);

    return () => {
      clearTimer();
    };
  }, [toast, isPaused, closeToast]);

  const handleMouseEnter = () => {
    if (!toast) return;
    clearTimer();
    // Hitung sisa durasi yang tersisa
    const elapsed = Date.now() - startTimeRef.current;
    remainingRef.current = Math.max(500, remainingRef.current - elapsed);
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (!toast) return;
    setIsPaused(false);
  };

  const getVariantConfig = (kind: ToastKind) => {
    switch (kind) {
      case 'success':
        return {
          defaultTitle: 'Berhasil',
          containerBorder: 'border-emerald-200/90 shadow-emerald-500/10',
          iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
          icon: <CheckCircle2 size={19} className="stroke-[2.2]" />,
          titleColor: 'text-emerald-950',
          progressBar: 'bg-emerald-500',
        };
      case 'error':
        return {
          defaultTitle: 'Terjadi Kesalahan',
          containerBorder: 'border-rose-200/90 shadow-rose-500/10',
          iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
          icon: <AlertCircle size={19} className="stroke-[2.2]" />,
          titleColor: 'text-rose-950',
          progressBar: 'bg-rose-500',
        };
      case 'warning':
        return {
          defaultTitle: 'Perhatian',
          containerBorder: 'border-amber-200/90 shadow-amber-500/10',
          iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
          icon: <AlertTriangle size={19} className="stroke-[2.2]" />,
          titleColor: 'text-amber-950',
          progressBar: 'bg-amber-500',
        };
      case 'info':
        return {
          defaultTitle: 'Informasi',
          containerBorder: 'border-indigo-200/90 shadow-indigo-500/10',
          iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
          icon: <Info size={19} className="stroke-[2.2]" />,
          titleColor: 'text-indigo-950',
          progressBar: 'bg-indigo-500',
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <>
          <style>{`
            @keyframes toastShrink {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
          {/* Top-Center Floating Container */}
          <div
            className="fixed left-1/2 -translate-x-1/2 top-6 z-[100] w-[min(30rem,calc(100vw-2rem))] animate-in slide-in-from-top-4 fade-in duration-300 ease-out pointer-events-auto"
            role="status"
            aria-live="polite"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {(() => {
              const config = getVariantConfig(toast.kind);
              const displayTitle = toast.title || config.defaultTitle;

              return (
                <div
                  className={`relative overflow-hidden flex items-start gap-3.5 rounded-2xl border bg-white/95 backdrop-blur-md p-4 shadow-2xl ring-1 ring-black/5 transition-all duration-200 ${config.containerBorder}`}
                >
                  {/* Icon Indicator */}
                  <div className={`rounded-xl p-2 shrink-0 ${config.iconBg}`}>
                    {config.icon}
                  </div>

                  {/* Text Content */}
                  <div className="min-w-0 flex-1 pt-0.5 pb-1">
                    <h4 className={`text-xs font-bold tracking-wider uppercase ${config.titleColor}`}>
                      {displayTitle}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed font-medium">
                      {toast.message}
                    </p>
                  </div>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={closeToast}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors shrink-0 cursor-pointer"
                    aria-label="Tutup notifikasi"
                    title="Tutup"
                  >
                    <X size={16} />
                  </button>

                  {/* Progress Timer Line at the Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${config.progressBar}`}
                      style={{
                        animation: `toastShrink ${toast.duration}ms linear forwards`,
                        animationPlayState: isPaused ? 'paused' : 'running',
                      }}
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        </>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
