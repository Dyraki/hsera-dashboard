import React from "react";
import { LayoutDashboard, Download } from "lucide-react";

interface MonitoringHeaderProps {
  onExport: () => void;
  disabled?: boolean;
}

export const MonitoringHeader: React.FC<MonitoringHeaderProps> = ({ onExport, disabled = false }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
          <span className="font-semibold text-primary-600">OPERASIONAL & TATA KELOLA</span>
          <span>/</span>
          <span>MONITORING KELENGKAPAN</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-950 tracking-tight flex items-center gap-2.5">
          <LayoutDashboard className="text-primary-600" size={26} />
          Monitoring Kelengkapan Rekap Harian
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Pantau status pengisian callsheet seluruh district per minggu ISO sebelum periode dikunci oleh Supervisor & Admin Distribusi.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onExport}
          disabled={disabled}
          className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
        >
          <Download size={15} className="text-emerald-600" />
          Ekspor Rekap (.xlsx)
        </button>
      </div>
    </div>
  );
};
