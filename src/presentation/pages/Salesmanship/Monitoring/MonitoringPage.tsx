import React from "react";
import { AdminLayout } from "@/presentation/components/layout/AdminLayout";
import { useWeeklyMonitoring } from "./hooks/useWeeklyMonitoring";
import { MonitoringHeader } from "./components/MonitoringHeader";
import { MonitoringWeekFilter } from "./components/MonitoringWeekFilter";
import { MonitoringKpiCards } from "./components/MonitoringKpiCards";
import { MonitoringMatrixGrid } from "./components/MonitoringMatrixGrid";
import { LockWeekModal } from "./components/LockWeekModal";
import { AlertTriangle, RefreshCw } from "lucide-react";

export const MonitoringPage: React.FC = () => {
  const {
    data,
    isLoading,
    error,
    selectedWeek,
    currentIsoWeek,
    filters,
    setFilters,
    operationUnits,
    filteredDistricts,
    kpiSummary,
    handlePrevWeek,
    handleNextWeek,
    handleCurrentWeek,
    handleRefresh,
    handleExportCsv,
    isLockModalOpen,
    setIsLockModalOpen,
    isSubmittingLock,
    handleToggleLock,
  } = useWeeklyMonitoring();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header & Export Action */}
        <MonitoringHeader
          onExport={handleExportCsv}
          disabled={isLoading || filteredDistricts.length === 0}
        />

        {/* Week Switcher & Filters */}
        <MonitoringWeekFilter
          selectedWeek={selectedWeek}
          currentIsoWeek={currentIsoWeek}
          startDate={data?.startDate}
          endDate={data?.endDate}
          kodeMingguDisplay={data?.kodeMingguDisplay}
          isLocked={data?.isLocked ?? false}
          filters={filters}
          onFilterChange={setFilters}
          operationUnits={operationUnits}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onCurrentWeek={handleCurrentWeek}
          onOpenLockModal={() => setIsLockModalOpen(true)}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />

        {/* 4 Summary KPI Cards */}
        <MonitoringKpiCards kpiSummary={kpiSummary} />

        {/* Error Alert (if any) */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-800">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center gap-1 font-bold text-rose-700 hover:text-rose-900 cursor-pointer"
            >
              <RefreshCw size={12} /> Coba Lagi
            </button>
          </div>
        )}

        {/* Matrix Grid (Senin - Sabtu) */}
        <MonitoringMatrixGrid
          districts={filteredDistricts}
          isLoading={isLoading}
          weekResponse={data}
        />

        {/* Lock / Unlock Confirmation Modal */}
        <LockWeekModal
          isOpen={isLockModalOpen}
          onClose={() => setIsLockModalOpen(false)}
          onConfirm={handleToggleLock}
          isLocked={data?.isLocked ?? false}
          weekDisplay={data?.kodeMingguDisplay ?? ""}
          startDate={data?.startDate}
          endDate={data?.endDate}
          isSubmitting={isSubmittingLock}
        />
      </div>
    </AdminLayout>
  );
};
