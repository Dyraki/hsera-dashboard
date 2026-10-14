import React, { useState } from "react";
import { Lock, Unlock, X, ShieldAlert } from "lucide-react";

interface LockWeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (catatan?: string) => Promise<void> | void;
  isLocked: boolean;
  weekDisplay: string;
  startDate?: string;
  endDate?: string;
  isSubmitting?: boolean;
}

export const LockWeekModal: React.FC<LockWeekModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLocked,
  weekDisplay,
  startDate,
  endDate,
  isSubmitting = false,
}) => {
  const [catatan, setCatatan] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(catatan.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl border border-gray-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg ${
                isLocked ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              }`}
            >
              {isLocked ? <Unlock size={20} /> : <Lock size={20} />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-950">
                {isLocked ? "Buka Kunci Periode Minggu" : "Kunci Periode Rekap Minggu"}
              </h3>
              <p className="text-xs text-gray-500">
                Minggu ISO {weekDisplay} {startDate && endDate ? `(${startDate} – ${endDate})` : ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div
            className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
              isLocked
                ? "bg-amber-50 border-amber-200 text-amber-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            <ShieldAlert size={18} className="shrink-0 mt-0.5 text-current" />
            <div>
              <p className="font-semibold mb-0.5">
                {isLocked ? "Perhatian Pembukaan Kunci:" : "Konfirmasi Audit Kunci Periode:"}
              </p>
              <p className="text-[11px] leading-relaxed">
                {isLocked
                  ? "Membuka kunci periode akan mengizinkan kembali salesman untuk mengedit, menambah, atau mengubah status rekap callsheet pada minggu ini."
                  : "Setelah periode dikunci, seluruh rekap callsheet pada minggu ini TIDAK DAPAT diubah, ditambah, atau dihapus oleh salesman. Gunakan fungsi ini setelah proses audit mingguan selesai."}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Catatan / Alasan {isLocked ? "Pembukaan Kunci" : "Penguncian"} (Opsional)
            </label>
            <textarea
              rows={3}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder={
                isLocked
                  ? "Contoh: Koreksi data toko atas persetujuan Supervisor..."
                  : "Contoh: Audit operasional mingguan selesai tervalidasi..."
              }
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50 ${
                isLocked
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isLocked ? (
                <Unlock size={14} />
              ) : (
                <Lock size={14} />
              )}
              {isLocked ? "Ya, Buka Kunci" : "Ya, Kunci Periode"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
