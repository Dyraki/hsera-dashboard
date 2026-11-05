import React, { useState } from 'react';
import { AdminLayout } from '@/presentation/components/layout/AdminLayout';
import { useKpiReport } from './hooks/useKpiReport';
import { KpiReportHeaderFilter } from './components/KpiReportHeaderFilter';
import { KpiReportSummaryCards } from './components/KpiReportSummaryCards';
import { KpiReportChartsGrid } from './components/KpiReportChartsGrid';
import { KpiReportWeeklyTable } from './components/KpiReportWeeklyTable';
import { AlertCircle, FileQuestion } from 'lucide-react';

export const ReportKpiPage: React.FC = () => {
  const {
    filters,
    handleFilterChange,
    operationUnits,
    districts,
    reportData,
    isLoading,
    isLoadingDistricts,
    error,
    isSuperAdmin,
    fetchReport,
    handleExportCsv,
    handlePrint,
  } = useKpiReport();

  const [highlightedWeek, setHighlightedWeek] = useState<number | 'all'>('all');

  // Handle week selection from chart or table
  const handleSelectWeek = (kodeMinggu: number) => {
    if (highlightedWeek === kodeMinggu) {
      setHighlightedWeek('all');
    } else {
      setHighlightedWeek(kodeMinggu);
    }
  };

  const activeSelectedWeek =
    filters.selectedWeek !== 'all' ? filters.selectedWeek : highlightedWeek;

  return (
    <AdminLayout>
      <div className="space-y-5 pb-12">
        {/* 1. Header Filter Bar */}
        <KpiReportHeaderFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          operationUnits={operationUnits}
          districts={districts}
          isSuperAdmin={isSuperAdmin}
          isLoading={isLoading}
          isLoadingDistricts={isLoadingDistricts}
          availableWeeks={reportData?.weeks || []}
          onRefresh={fetchReport}
          onExportCsv={handleExportCsv}
          onPrint={handlePrint}
        />

        {/* 2. Loading State */}
        {isLoading && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs space-y-3">
            <div className="inline-block w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <h3 className="text-sm font-bold text-gray-900">Memuat Laporan KPI Salesmanship...</h3>
            <p className="text-xs text-gray-500">
              Menghitung target dan realisasi 4 parameter (Kunjungan, EC, BD, Volume) per minggu...
            </p>
          </div>
        )}

        {/* 3. Error State */}
        {!isLoading && error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <h3 className="text-sm font-bold text-rose-900">Gagal Memuat Laporan KPI</h3>
            <p className="text-xs text-rose-700">{error}</p>
          </div>
        )}

        {/* 4. Empty State */}
        {!isLoading && !error && !reportData && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs space-y-3">
            <FileQuestion className="w-10 h-10 text-indigo-400 mx-auto" />
            <h3 className="text-sm font-bold text-gray-900">Data KPI Tidak Ditemukan</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Tidak ada data rekapan pada kriteria kuartal atau filter cabang/district yang dipilih. Silakan ubah filter.
            </p>
          </div>
        )}

        {/* 5. Main Content when Loaded */}
        {!isLoading && reportData && (
          <div className="space-y-5 animate-fade-in">
            {/* KPI Executive Summary Cards */}
            <KpiReportSummaryCards
              summary={reportData.summary}
              totalWeeks={reportData.weeks.length}
            />

            {/* 4-Parameter Visual Charts Grid */}
            <KpiReportChartsGrid
              weeks={reportData.weeks}
              selectedWeek={activeSelectedWeek}
              onSelectWeek={handleSelectWeek}
            />

            {/* Comprehensive Weekly Tracking Table */}
            <KpiReportWeeklyTable
              weeks={reportData.weeks}
              summary={reportData.summary}
              selectedWeek={activeSelectedWeek}
              onSelectWeek={handleSelectWeek}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
