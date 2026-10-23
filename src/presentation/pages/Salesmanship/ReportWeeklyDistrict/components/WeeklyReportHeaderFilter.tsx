import React from 'react';
import { AvailableWeekOption } from '@/core/domain/models/ReportWeeklyDistrict';
import { OperationUnitOption, District } from '@/core/domain/models/District';
import {
  ReportFilterState,
  BRAND_KATEGORI_OPTIONS,
  STATUS_DATA_OPTIONS,
} from '../types';
import {
  Calendar,
  Building2,
  MapPin,
  Tag,
  Filter,
  FileSpreadsheet,
  Printer,
  RotateCcw,
  Lock,
} from 'lucide-react';

interface WeeklyReportHeaderFilterProps {
  filters: ReportFilterState;
  onFilterChange: (newFilters: Partial<ReportFilterState>) => void;
  availableWeeks: AvailableWeekOption[];
  operationUnits: OperationUnitOption[];
  districts: District[];
  isSuperAdmin: boolean;
  isLoading?: boolean;
  isLocked?: boolean;
  lockStatusText?: string;
  onExportExcel: () => void;
  onPrint: () => void;
  onRefresh: () => void;
}

export const WeeklyReportHeaderFilter: React.FC<WeeklyReportHeaderFilterProps> = ({
  filters,
  onFilterChange,
  availableWeeks,
  operationUnits,
  districts,
  isSuperAdmin,
  isLoading = false,
  isLocked = false,
  lockStatusText,
  onExportExcel,
  onPrint,
  onRefresh,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4 print:hidden">
      {/* Top Header: Title, Lock Status Badge, and Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold text-gray-950 tracking-tight">
              Laporan Mingguan Per District
            </h1>
            {lockStatusText && (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  isLocked
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {isLocked ? (
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
                {lockStatusText}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Weekly Retail Intelligence Report (RIS) · Analisis performa ritase kunjungan, penetrasi brand, dan kuantitas penjualan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh Data"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>

          <button
            type="button"
            onClick={onExportExcel}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor Excel</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-primary-800 bg-primary-50 hover:bg-primary-100 border border-primary-300 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Printer className="w-4 h-4 text-primary-600" />
            <span>Cetak</span>
          </button>
        </div>
      </div>

      {/* Filter Grid: Minggu, OU, District, Kategori Brand, Status Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-1">
        {/* 1. MINGGU ISO DROPDOWN */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-primary-600" />
            <span>Minggu ISO</span>
          </label>
          <select
            value={filters.kodeMinggu ?? ''}
            onChange={(e) => onFilterChange({ kodeMinggu: Number(e.target.value) })}
            disabled={isLoading || availableWeeks.length === 0}
            className="w-full text-xs font-medium bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer shadow-2xs"
          >
            {availableWeeks.map((w) => (
              <option key={w.kodeMinggu} value={w.kodeMinggu}>
                {w.label} {w.isCurrent ? '• Minggu Ini' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* 2. UNIT OPERASI (OU) DROPDOWN */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-primary-600" />
            <span>Unit Operasi</span>
          </label>
          {(() => {
            const canSelectOu = isSuperAdmin || operationUnits.length > 1;
            return (
              <select
                value={filters.ouKode}
                onChange={(e) => onFilterChange({ ouKode: e.target.value })}
                disabled={isLoading || !canSelectOu}
                className={`w-full text-xs font-medium border border-gray-300 rounded-lg px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-2xs ${
                  !canSelectOu ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : 'bg-white text-gray-900 cursor-pointer'
                }`}
              >
                {canSelectOu && <option value="all">Semua Unit / Cabang</option>}
                {operationUnits.map((ou) => (
                  <option key={ou.kode} value={ou.kode}>
                    {ou.kode} - {ou.nama}
                  </option>
                ))}
              </select>
            );
          })()}
        </div>

        {/* 3. DISTRICT DROPDOWN */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-primary-600" />
            <span>District / Wilayah</span>
          </label>
          <select
            value={filters.districtId}
            onChange={(e) => onFilterChange({ districtId: e.target.value })}
            disabled={isLoading || districts.length === 0}
            className="w-full text-xs font-medium bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer shadow-2xs"
          >
            {districts.length === 0 ? (
              <option value="">Tidak ada district</option>
            ) : (
              districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.kode} ({d.ouKode}) - {d.karyawanName || d.karyawanId}
                </option>
              ))
            )}
          </select>
        </div>

        {/* 4. KATEGORI BRAND DROPDOWN */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5 text-primary-600" />
            <span>Kategori Brand</span>
          </label>
          <select
            value={filters.kategori}
            onChange={(e) => onFilterChange({ kategori: e.target.value })}
            disabled={isLoading}
            className="w-full text-xs font-medium bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer shadow-2xs"
          >
            {BRAND_KATEGORI_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 5. STATUS DATA DROPDOWN */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-primary-600" />
            <span>Status Lembar</span>
          </label>
          <select
            value={filters.statusRekap}
            onChange={(e) => onFilterChange({ statusRekap: e.target.value })}
            disabled={isLoading}
            className="w-full text-xs font-medium bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer shadow-2xs"
          >
            {STATUS_DATA_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
