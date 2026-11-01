import React from 'react';
import { AdminLayout } from '@/presentation/components/layout/AdminLayout';
import { useSkuSalesReport } from './hooks/useSkuSalesReport';
import { SkuSalesHeaderFilter } from './components/SkuSalesHeaderFilter';
import { SkuSalesKpiCards } from './components/SkuSalesKpiCards';
import { SkuSalesQuarterChart } from './components/SkuSalesQuarterChart';
import { SkuSalesMatrixTable } from './components/SkuSalesMatrixTable';
import { AlertCircle, FileQuestion } from 'lucide-react';

export const ReportSkuPage: React.FC = () => {
  const {
    isSuperAdmin,
    operationUnits,
    districts,
    reportData,
    isLoading,
    isLoadingDistricts,
    error,
    filters,
    searchQuery,
    setSearchQuery,
    sortField,
    sortDirection,
    handleSort,
    filteredSkuRows,
    handleFilterChange,
    refetchReport,
    handleExportExcel,
    handlePrint,
    availableQuarters,
  } = useSkuSalesReport();

  return (
    <AdminLayout>
      <div className="space-y-5 pb-12">
        {/* 1. Header Filter */}
        <SkuSalesHeaderFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          availableQuarters={availableQuarters}
          operationUnits={operationUnits}
          districts={districts}
          isSuperAdmin={isSuperAdmin}
          isLoading={isLoading || isLoadingDistricts}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onExportExcel={handleExportExcel}
          onPrint={handlePrint}
          onRefresh={refetchReport}
        />

        {/* 2. Loading State */}
        {isLoading && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs space-y-3">
            <div className="inline-block w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <h3 className="text-sm font-bold text-gray-900">Memuat Laporan Penjualan SKU...</h3>
            <p className="text-xs text-gray-500">
              Menghitung agregasi volume transaksi kuartal dan perbandingan Like-for-Like antar siklus minggu.
            </p>
          </div>
        )}

        {/* 3. Error State */}
        {!isLoading && error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <h3 className="text-sm font-bold text-rose-900">Gagal Memuat Laporan Penjualan SKU</h3>
            <p className="text-xs text-rose-700">{error}</p>
          </div>
        )}

        {/* 4. Empty State */}
        {!isLoading && !error && !reportData && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs space-y-3">
            <FileQuestion className="w-10 h-10 text-primary-400 mx-auto" />
            <h3 className="text-sm font-bold text-gray-900">Data Penjualan SKU Tidak Ditemukan</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Tidak ada data penjualan pada kriteria kuartal atau filter cabang/district yang dipilih. Silakan pilih opsi lain.
            </p>
          </div>
        )}

        {/* 5. Main Content when Loaded */}
        {!isLoading && reportData && (
          <div className="space-y-5 animate-fade-in">
            {/* KPI Summary Cards */}
            <SkuSalesKpiCards kpi={reportData.kpiSummary} />

            {/* 1-Quarter Trend Chart */}
            <SkuSalesQuarterChart
              chartTrend={reportData.chartTrend}
              avgWeeklyVolume={reportData.summaryRow.grandAvgWeekly}
            />

            {/* SKU Sales Matrix Table */}
            <SkuSalesMatrixTable
              skuRows={filteredSkuRows}
              weeks={reportData.weeks}
              summaryRow={reportData.summaryRow}
              prevCycleWeekNumber={reportData.header.prevCycleWeekNumber}
              currentWeekNumber={reportData.header.currentWeekNumber}
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
