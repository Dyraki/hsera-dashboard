import React from 'react';
import {
  Calendar,
  Filter,
  Clock,
  Building2,
  MapPin,
  Tag,
  Search,
  Download,
  Printer,
  RefreshCw,
  Sparkles,
  Layers,
} from 'lucide-react';
import { OperationUnitOption, District } from '@/core/domain/models/District';
import { Brand } from '@/core/domain/models/Brand';
import { SkuSalesWeekColumn } from '@/core/domain/models/ReportSkuSales';
import { NotationReportFilterState, QUARTER_OPTIONS, CYCLE_OPTIONS } from '../types';

interface NotationHeaderFilterProps {
  filters: NotationReportFilterState;
  onFilterChange: (updates: Partial<NotationReportFilterState>) => void;
  operationUnits: OperationUnitOption[];
  districts: District[];
  brands: Brand[];
  availableWeeks: SkuSalesWeekColumn[];
  isSuperAdmin: boolean;
  isLoading: boolean;
  isLoadingDistricts: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onRefresh: () => void;
  onExportCsv: () => void;
  onPrint: () => void;
}

export const NotationHeaderFilter: React.FC<NotationHeaderFilterProps> = ({
  filters,
  onFilterChange,
  operationUnits,
  districts,
  brands,
  availableWeeks,
  isSuperAdmin,
  isLoading,
  isLoadingDistricts,
  searchQuery,
  onSearchChange,
  onRefresh,
  onExportCsv,
  onPrint,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden transition-all duration-200">
      {/* Top Banner: Title & Action Buttons */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
              Laporan Notasi Salesmanship & Pergerakan Brand
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-100/70 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200/50">
                Nilai Absolut Nyata
              </span>
            </h1>
            <p className="text-xs text-gray-500">
              Analisis pergerakan notasi lapangan (SK, SL, OOS, SD, TL, BPJ, SB) dan matriks volume penjualan SKU.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
            title="Cetak Halaman Laporan"
          >
            <Printer className="w-3.5 h-3.5 text-gray-500" />
            <span>Cetak</span>
          </button>

          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100/80 transition-colors shadow-2xs cursor-pointer"
            title="Ekspor data notasi ke format CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
            title="Segarkan Data Laporan"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* 6 Filters Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 bg-white">
        {/* 1. Pilih Kuartal */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            Pilih Kuartal
          </label>
          <select
            value={`${filters.year}-${filters.quarter}`}
            onChange={(e) => {
              const [y, q] = e.target.value.split('-').map(Number);
              onFilterChange({ year: y, quarter: q, selectedWeek: 'all' });
            }}
            disabled={isLoading}
            className="w-full text-xs font-medium border border-gray-300 rounded-lg py-2 px-2.5 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-2xs cursor-pointer text-gray-900"
          >
            {QUARTER_OPTIONS.map((opt) => (
              <option key={`${opt.year}-${opt.quarter}`} value={`${opt.year}-${opt.quarter}`}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Siklus Minggu (Default: Semua) */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            Siklus Minggu
          </label>
          <select
            value={filters.cycleType}
            onChange={(e) => onFilterChange({ cycleType: e.target.value as any, selectedWeek: 'all' })}
            disabled={isLoading}
            className="w-full text-xs font-semibold border border-gray-300 rounded-lg py-2 px-2.5 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-2xs cursor-pointer text-gray-900"
          >
            {CYCLE_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Filter Mingguan (Default: Semua Minggu) */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            Filter Mingguan
          </label>
          <select
            value={filters.selectedWeek}
            onChange={(e) => {
              const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
              onFilterChange({ selectedWeek: val });
            }}
            disabled={isLoading}
            className="w-full text-xs font-semibold border border-gray-300 rounded-lg py-2 px-2.5 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-2xs cursor-pointer text-gray-900"
          >
            <option value="all">Semua Minggu ({availableWeeks.length} Wk)</option>
            {availableWeeks.map((w) => (
              <option key={w.kodeMinggu} value={w.kodeMinggu}>
                {w.weekLabel} {w.isCurrent ? '(Berjalan)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Cabang / Operation Unit */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            Cabang / Unit
          </label>
          <select
            value={filters.ouKode}
            onChange={(e) => onFilterChange({ ouKode: e.target.value })}
            disabled={isLoading}
            className="w-full text-xs font-medium border border-gray-300 rounded-lg py-2 px-2.5 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-2xs cursor-pointer text-gray-900"
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

        {/* 5. District / Wilayah */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            District / Wilayah
            {isLoadingDistricts && (
              <span className="text-[10px] text-gray-400 font-normal">...</span>
            )}
          </label>
          <select
            value={filters.districtId}
            onChange={(e) => onFilterChange({ districtId: e.target.value })}
            disabled={isLoading || isLoadingDistricts}
            className="w-full text-xs font-medium border border-gray-300 rounded-lg py-2 px-2.5 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-2xs cursor-pointer text-gray-900"
          >
            <option value="">Semua District ({districts.length} Wilayah)</option>
            {districts.map((d) => {
              const salesman = d.karyawanName || d.karyawanNip;
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

        {/* 6. Filter Brand (Default: All Brand) */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-indigo-600" />
            Pilih Brand
          </label>
          <select
            value={filters.brandId}
            onChange={(e) => onFilterChange({ brandId: e.target.value })}
            disabled={isLoading}
            className="w-full text-xs font-semibold border border-gray-300 rounded-lg py-2 px-2.5 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-2xs cursor-pointer text-gray-900"
          >
            <option value="all">Semua Brand (Konsolidasi)</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.kode} - {b.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bottom Sub-Bar: Search SKU Filter */}
      <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Layers className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>Filter cepat produk pada matriks SKU di bawah:</span>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari kode atau nama SKU..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
