import React from 'react';
import { AdminLayout } from '@/presentation/components/layout/AdminLayout';
import { useWeeklyDistrictReport } from './hooks/useWeeklyDistrictReport';
import { WeeklyReportHeaderFilter } from './components/WeeklyReportHeaderFilter';
import { WeeklyDistrictProfileCard } from './components/WeeklyDistrictProfileCard';
import { WeeklyKpiCards } from './components/WeeklyKpiCards';
import { WeeklyDailyBarChart } from './components/WeeklyDailyBarChart';
import { WeeklyNotationAnalysis } from './components/WeeklyNotationAnalysis';
import { WeeklyBrandMatrixTable } from './components/WeeklyBrandMatrixTable';
import { FileQuestion, AlertCircle } from 'lucide-react';

export const ReportWeeklyDistrictPage: React.FC = () => {
  const {
    isSuperAdmin,
    availableWeeks,
    operationUnits,
    districts,
    reportData,
    isLoading,
    isLoadingDistricts,
    error,
    filters,
    handleFilterChange,
    refetchReport,
    handlePrint,
    handleExportExcel,
  } = useWeeklyDistrictReport();

  return (
    <AdminLayout>
      <div className="space-y-5 pb-12">
        {/* 1. Header & Filters */}
        <WeeklyReportHeaderFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          availableWeeks={availableWeeks}
          operationUnits={operationUnits}
          districts={districts}
          isSuperAdmin={isSuperAdmin}
          isLoading={isLoading || isLoadingDistricts}
          isLocked={reportData?.header.isLocked}
          lockStatusText={reportData?.header.lockStatusText}
          onExportExcel={handleExportExcel}
          onPrint={handlePrint}
          onRefresh={refetchReport}
        />

        {/* 2. Loading State */}
        {isLoading && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs space-y-3">
            <div className="inline-block w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <h3 className="text-sm font-bold text-gray-900">Memuat Laporan Mingguan...</h3>
            <p className="text-xs text-gray-500">
              Menghitung agregasi performa ritase dan matriks distribusi brand distrik.
            </p>
          </div>
        )}

        {/* 3. Error / Empty State */}
        {!isLoading && error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <h3 className="text-sm font-bold text-rose-900">Gagal Memuat Laporan</h3>
            <p className="text-xs text-rose-700">{error}</p>
          </div>
        )}

        {!isLoading && !error && !reportData && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs space-y-3">
            <FileQuestion className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="text-sm font-bold text-gray-900">Data Laporan Tidak Tersedia</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Tidak ditemukan data teritori atau lembar callsheet aktif pada kriteria filter yang dipilih. Silakan pilih minggu atau district lain.
            </p>
          </div>
        )}

        {/* 4. Report Content when loaded */}
        {!isLoading && reportData && (
          <div className="space-y-5 animate-fade-in">
            {/* Salesman & District Identity Card */}
            <WeeklyDistrictProfileCard header={reportData.header} />

            {/* Top KPI Cards */}
            <WeeklyKpiCards kpi={reportData.kpiSummary} />

            {/* Daily Ritase Bar Chart (Senin s/d Sabtu) */}
            <WeeklyDailyBarChart dailyTrend={reportData.dailyTrend} />

            {/* Analisis Notasi (Level Stok, Trade Program, Penetrasi) */}
            <WeeklyNotationAnalysis
              notationAnalysis={reportData.notationAnalysis}
              totalKunjungan={reportData.kpiSummary.kunjungan.actual}
            />

            {/* Dynamic 13-15 Brands Matrix Table */}
            <WeeklyBrandMatrixTable brandMatrix={reportData.brandMatrix} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
