import React, { useState } from 'react';
import { AdminLayout } from '@/presentation/components/layout/AdminLayout';
import { useNotationReport } from './hooks/useNotationReport';
import { NotationHeaderFilter } from './components/NotationHeaderFilter';
import { NotationChartsGrid } from './components/NotationChartsGrid';
import { KpiReportSummaryCards } from '../ReportKpi/components/KpiReportSummaryCards';
import { SkuSalesMatrixTable } from '../ReportSku/components/SkuSalesMatrixTable';
import { AlertCircle, FileQuestion } from 'lucide-react';

export const ReportNotasiPage: React.FC = () => {
  const {
    isSuperAdmin,
    operationUnits,
    districts,
    brands,
    reportData,
    isLoading,
    isLoadingDistricts,
    error,
    filters,
    handleFilterChange,
    searchQuery,
    setSearchQuery,
    sortField,
    sortDirection,
    handleSort,
    filteredSkuRows,
    fetchReport,
    handleExportCsv,
    handlePrint,
  } = useNotationReport();

  const [highlightedPeriod, setHighlightedPeriod] = useState<string | number | 'all'>('all');

  const handleSelectPeriod = (periodKey: string | number) => {
    if (highlightedPeriod === periodKey) {
      setHighlightedPeriod('all');
    } else {
      setHighlightedPeriod(periodKey);
    }
  };

  const activePeriod =
    filters.selectedWeek !== 'all' ? filters.selectedWeek : highlightedPeriod;

  return (
    <AdminLayout>
      <div className="space-y-5 pb-12">
        {/* 1. Header Filter Bar (6 Dimensi) */}
        <NotationHeaderFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          operationUnits={operationUnits}
          districts={districts}
          brands={brands}
          availableWeeks={reportData?.skuMatrix?.weeks || []}
          isSuperAdmin={isSuperAdmin}
          isLoading={isLoading}
          isLoadingDistricts={isLoadingDistricts}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={fetchReport}
          onExportCsv={handleExportCsv}
          onPrint={handlePrint}
        />

        {/* 2. Loading State */}
        {isLoading && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs space-y-3">
            <div className="inline-block w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <h3 className="text-sm font-bold text-gray-900">Memuat Laporan Analisis Notasi & Brand...</h3>
            <p className="text-xs text-gray-500">
              Mengagregasi 7 notasi pergerakan toko, kuantitas pack rata-rata, dan matriks volume penjualan SKU.
            </p>
          </div>
        )}

        {/* 3. Error State */}
        {!isLoading && error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <h3 className="text-sm font-bold text-rose-900">Gagal Memuat Laporan Notasi</h3>
            <p className="text-xs text-rose-700">{error}</p>
          </div>
        )}

        {/* 4. Empty State */}
        {!isLoading && !error && !reportData && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs space-y-3">
            <FileQuestion className="w-10 h-10 text-indigo-400 mx-auto" />
            <h3 className="text-sm font-bold text-gray-900">Data Notasi Tidak Ditemukan</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Tidak ada data rekapan notasi pada kriteria kuartal atau filter cabang/district/brand yang dipilih. Silakan ubah filter.
            </p>
          </div>
        )}

        {/* 5. Main Content when Loaded */}
        {!isLoading && reportData && (
          <div className="space-y-5 animate-fade-in">
            {/* KPI Executive Summary Cards */}
            <KpiReportSummaryCards
              summary={reportData.summary}
              totalWeeks={reportData.skuMatrix?.weeks?.length || 0}
            />

            {/* 4 UI Grafis Analisis Notasi (Angka Absolut Toko & Pack) */}
            <NotationChartsGrid
              data={reportData.notationTrend}
              selectedPeriod={activePeriod}
              onSelectPeriod={handleSelectPeriod}
            />

            {/* Matriks Penjualan Produk SKU per Minggu */}
            <SkuSalesMatrixTable
              skuRows={filteredSkuRows}
              weeks={reportData.skuMatrix.weeks}
              summaryRow={reportData.skuMatrix.summaryRow}
              prevCycleWeekNumber={reportData.skuMatrix.prevCycleWeekNumber}
              currentWeekNumber={reportData.skuMatrix.currentWeekNumber}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
