import React from 'react';
import {
  Calendar,
  Building2,
  MapPin,
  RefreshCw,
  Download,
  Printer,
  Search,
  Filter,
  Layers,
} from 'lucide-react';
import { OperationUnitOption, District } from '@/core/domain/models/District';
import { SkuReportFilterState, QuarterOptionItem, CYCLE_OPTIONS } from '../types';

interface SkuSalesHeaderFilterProps {
  filters: SkuReportFilterState;
  onFilterChange: (updates: Partial<SkuReportFilterState>) => void;
  availableQuarters: QuarterOptionItem[];
  operationUnits: OperationUnitOption[];
  districts: District[];
  isSuperAdmin: boolean;
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onExportExcel: () => void;
  onPrint: () => void;
  onRefresh: () => void;
}

export const SkuSalesHeaderFilter: React.FC<SkuSalesHeaderFilterProps> = ({
  filters,
  onFilterChange,
  availableQuarters,
  operationUnits,
  districts,
  isSuperAdmin,
  isLoading,
  searchQuery,
  onSearchChange,
  onExportExcel,
  onPrint,
  onRefresh,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
      {/* Top Title Banner */}
      <div className="px-5 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-50/60 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center shrink-0 shadow-2xs">
            <Layers className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                Laporan Penjualan SKU (Per Kuartal)
              </h1>
              <span className="text-[11px] font-semibold bg-primary-50 text-primary-700 border border-primary-200 px-2 py-0.5 rounded-full">
                Siklus {filters.cycleType === 'EVEN' ? 'Week Genap' : filters.cycleType === 'ODD' ? 'Week Ganjil' : 'Semua Week'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Analisis performa serapan volume penjualan SKU dan komparasi Like-for-Like antar siklus minggu.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
            title="Cetak Laporan"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak</span>
          </button>

          <button
            type="button"
            onClick={onExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100/80 transition-colors shadow-2xs cursor-pointer"
            title="Ekspor format Excel / CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
            title="Segarkan Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Filter Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white">
        {/* 1. Kuartal */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary-600" />
            Pilih Kuartal
          </label>
          <select
            value={`${filters.year}-${filters.quarter}`}
            onChange={(e) => {
              const [y, q] = e.target.value.split('-').map(Number);
              onFilterChange({ year: y, quarter: q });
            }}
            disabled={isLoading}
            className="w-full text-xs font-medium border border-gray-300 rounded-lg py-2 px-2.5 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors shadow-2xs cursor-pointer"
          >
            {availableQuarters.map((opt) => (
              <option key={`${opt.year}-${opt.quarter}`} value={`${opt.year}-${opt.quarter}`}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Siklus Minggu */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-primary-600" />
            Siklus Minggu
          </label>
          <select
            value={filters.cycleType}
            onChange={(e) => onFilterChange({ cycleType: e.target.value as any })}
            disabled={isLoading}
            className="w-full text-xs font-semibold border border-gray-300 rounded-lg py-2 px-2.5 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors shadow-2xs cursor-pointer text-gray-900"
          >
            {CYCLE_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Operation Unit (Cabang) */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-primary-600" />
            Cabang / Unit
          </label>
          <select
            value={filters.ouKode}
            onChange={(e) => onFilterChange({ ouKode: e.target.value })}
            disabled={isLoading}
            className="w-full text-xs font-medium border border-gray-300 rounded-lg py-2 px-2.5 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors shadow-2xs cursor-pointer"
          >
            {isSuperAdmin && <option value="all">Semua Cabang (Nasional)</option>}
            {!isSuperAdmin && operationUnits.length > 1 && (
              <option value="all">Semua Cabang Terotorisasi</option>
            )}
            {operationUnits.map((u) => (
              <option key={u.kode} value={u.kode}>
                {u.kode} - {u.nama}
              </option>
            ))}
          </select>
        </div>

        {/* 4. District / Wilayah */}
        <div>
          <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary-600" />
            DISTRICT / WILAYAH
          </label>
          <select
            value={filters.districtId}
            onChange={(e) => onFilterChange({ districtId: e.target.value })}
            disabled={isLoading}
            className="w-full text-xs font-medium border border-gray-300 rounded-lg py-2 px-2.5 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-2xs cursor-pointer"
          >
            <option value="">Semua District</option>
            {districts.map((d) => {
              const salesman = d.karyawanName || d.karyawanNip || d.karyawanId;
              const label = salesman
                ? `${d.kode} (${d.ouKode}) - ${salesman}`
                : `${d.kode} (${d.ouKode})`;
              return (
                <option key={d.id} value={d.id}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Sub-bar: Search SKU */}
      <div className="px-4 py-2.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari Kode atau Nama SKU..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-2xs"
          />
        </div>

        <div className="text-[11px] text-gray-500">
          Satuan Volume: <span className="font-semibold text-gray-700">Pack</span> | Periode:{' '}
          <span className="font-semibold text-indigo-700">13 Minggu Kuartal</span>
        </div>
      </div>
    </div>
  );
};
