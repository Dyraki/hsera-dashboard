import React from "react";
import { Save, CheckCircle2 } from "lucide-react";

interface CallsheetActionFooterProps {
  onSaveDraft: () => void;
  onFinalize: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

export const CallsheetActionFooter: React.FC<CallsheetActionFooterProps> = ({
  onSaveDraft,
  onFinalize,
  onCancel,
  isSubmitting,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-md sticky bottom-4 z-20">
      <div>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 cursor-pointer"
        >
          Batal / Refresh
        </button>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Tombol Simpan Draft */}
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={disabled || isSubmitting}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all shadow-xs hover:border-gray-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Save className="w-4 h-4 text-gray-500" />
          <span>Simpan Draft</span>
          <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] bg-gray-100 border border-gray-200 rounded text-gray-600 font-mono">
            Ctrl+S
          </kbd>
        </button>

        {/* Tombol Finalkan Rekap */}
        <button
          type="button"
          onClick={onFinalize}
          disabled={disabled || isSubmitting}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all shadow-sm hover:shadow-primary-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>Finalkan Rekap</span>
          <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] bg-primary-700/80 border border-primary-500/40 rounded text-primary-100 font-mono">
            F8
          </kbd>
        </button>
      </div>
    </div>
  );
};
