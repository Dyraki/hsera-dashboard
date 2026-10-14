import React from "react";
import { ChevronLeft, ChevronRight, Calendar, Lock, Unlock, Search, RotateCcw } from "lucide-react";
import { FilterState, StatusFilterOption } from "../types";
import { OperationUnitOption } from "@/core/domain/models/District";

interface MonitoringWeekFilterProps {
  selectedWeek: number;
  currentIsoWeek: number;
  startDate?: string;
  endDate?: string;
  kodeMingguDisplay?: string;
  isLocked: boolean;
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  operationUnits: OperationUnitOption[];
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
  onOpenLockModal: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

const formatDateShort = (isoDate?: string): string => {
  if (!isoDate) return "-";
  const [y, m, d] = isoDate.split("-");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const mIdx = parseInt(m, 10) - 1;
  return `${parseInt(d, 10)} ${monthNames[mIdx] || m} ${y}`;
};

export const MonitoringWeekFilter: React.FC<MonitoringWeekFilterProps> = ({
  selectedWeek,
  currentIsoWeek,
  startDate,
  endDate,
  kodeMingguDisplay,
  isLocked,
  filters,
  onFilterChange,
  operationUnits,
  onPrevWeek,
  onNextWeek,
  onCurrentWeek,
  onOpenLockModal,
  onRefresh,
  isLoading = false,
}) => {
  const isCurrentWeek = selectedWeek === currentIsoWeek;
  const weekNum = selectedWeek % 100;
  const yearNum = Math.floor(selectedWeek / 100);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-4">
      {/* Top Row: Week Navigator & Audit Lock Status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-gray-100">
        {/* Week Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg p-1">
            <button
              type="button"
              onClick={onPrevWeek}
              disabled={isLoading}
              title="Minggu Sebelumnya"
              className="p-1.5 hover:bg-white text-gray-700 hover:text-gray-950 rounded-md transition-colors cursor-pointer disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="px-3 py-1 flex items-center gap-2 min-w-[200px] justify-center">
              <Calendar size={16} className="text-primary-600 shrink-0" />
              <div className="text-center">
                <div className="text-xs font-bold text-gray-900">
                  Minggu {weekNum} / {yearNum}{" "}
                  {kodeMingguDisplay && (
                    <span className="text-[11px] font-medium text-gray-500">({kodeMingguDisplay})</span>
                  )}
                </div>
                <div className="text-[11px] text-gray-500">
                  {formatDateShort(startDate)} – {formatDateShort(endDate)}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onNextWeek}
              disabled={isLoading}
              title="Minggu Berikutnya"
              className="p-1.5 hover:bg-white text-gray-700 hover:text-gray-950 rounded-md transition-colors cursor-pointer disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {!isCurrentWeek && (
            <button
              type="button"
              onClick={onCurrentWeek}
              disabled={isLoading}
              className="px-2.5 py-1.5 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg transition-colors cursor-pointer"
            >
              Kembali ke Minggu Ini
            </button>
          )}

          {/* Period Lock Badge */}
          <div className="flex items-center gap-1.5">
            {isLocked ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                <Lock size={12} className="text-rose-600" />
                Periode Terkunci (Audit)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                <Unlock size={12} className="text-emerald-600" />
                Periode Terbuka (Aktif)
              </span>
            )}
          </div>
        </div>

        {/* Lock / Unlock Toggle Action & Refresh */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={onOpenLockModal}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs border ${
              isLocked
                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300"
                : "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300"
            }`}
          >
            {isLocked ? (
              <>
                <Unlock size={14} />
                Buka Kunci Minggu
              </>
            ) : (
              <>
                <Lock size={14} />
                Kunci Periode Minggu
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            title="Muat ulang data"
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCcw size={16} className={isLoading ? "animate-spin text-primary-600" : ""} />
          </button>
        </div>
      </div>

      {/* Bottom Row: Filter Controls (OU, Status, Search) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Filter OU / Cabang */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">
            Cabang / Unit Operasional
          </label>
          <select
            value={filters.ouKode}
            onChange={(e) => onFilterChange({ ...filters, ouKode: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
          >
            <option value="all">Semua Cabang (OU)</option>
            {operationUnits.map((ou) => (
              <option key={ou.id} value={ou.kode}>
                {ou.kode} – {ou.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Status */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">
            Status Kelengkapan
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value as StatusFilterOption })}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            <option value="LENGKAP">Lengkap (100% Final)</option>
            <option value="DRAFT">Menunggu Finalisasi (Ada Draft)</option>
            <option value="BELUM_LENGKAP">Belum Lengkap (&lt; 100%)</option>
            <option value="KOSONG">Belum Ada Rekap (Kosong)</option>
          </select>
        </div>

        {/* Search District / Salesman */}
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">
            Cari District / Salesman
          </label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Ketik kode district atau nama salesman..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, search: "" })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
