import React from 'react';
import { AdminLayout } from '@/presentation/components/layout/AdminLayout';
import { useDashboard } from './hooks/useDashboard';
import { DashboardHeaderBar } from './components/DashboardHeaderBar';
import { DashboardKpiCards } from './components/DashboardKpiCards';
import { VolumeTrendChartSection } from './components/VolumeTrendChartSection';
import { BranchComparisonTable } from './components/BranchComparisonTable';
import { BrandNotationMatrixTable } from './components/BrandNotationMatrixTable';
import { SalesmanLeaderboardTable } from './components/SalesmanLeaderboardTable';
import { AlertCircle } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    data,
    loading,
    error,
    selectedQuarter,
    selectedOu,
    selectedWeek,
    lastSyncTime,
    userScopeLocked,
    availableOus,
    setSelectedQuarter,
    setSelectedOu,
    setSelectedWeek,
    refresh,
  } = useDashboard();

  return (
    <AdminLayout>
      <div className="space-y-6 w-full pb-10">
        {/* Error Notification Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={refresh}
              className="px-2.5 py-1 bg-white border border-rose-300 text-rose-700 rounded font-semibold hover:bg-rose-100 transition cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* 1. Header Bar with Scope Context and Quarter/Area/Week Filters */}
        <DashboardHeaderBar
          headerContext={data?.headerContext}
          selectedQuarter={selectedQuarter}
          selectedOu={selectedOu}
          selectedWeek={selectedWeek}
          loading={loading}
          userScopeLocked={userScopeLocked}
          availableOus={availableOus}
          lastSyncTime={lastSyncTime}
          onQuarterChange={setSelectedQuarter}
          onOuChange={setSelectedOu}
          onWeekChange={setSelectedWeek}
          onRefresh={refresh}
        />

        {/* 2. 4 Executive KPI Cards (Disiplin Kunjungan, EC, BD Outlet, Volume Pack & Karton @800) */}
        <DashboardKpiCards summary={data?.kpiSummary} loading={loading} />

        {/* 3. Multi-Week Volume Trend Area/Line Chart + Interactive Week Selector */}
        <VolumeTrendChartSection
          trendSection={data?.trendSection}
          selectedWeek={selectedWeek !== undefined ? selectedWeek : data?.headerContext?.sessionWeek}
          onSelectWeek={setSelectedWeek}
          loading={loading}
        />

        {/* 4. Section 1: Branch / Operation Unit Performance Table (Without Score Column) */}
        <BranchComparisonTable
          branches={data?.branches}
          total={data?.branchesTotal}
          sessionWeekDisplay={data?.headerContext?.sessionWeekDisplay}
          loading={loading}
        />

        {/* 5. Section 2: 15 Real HSERA Brand Notation Matrix Table (Categories & Critical Alerts) */}
        <BrandNotationMatrixTable
          brandMatrix={data?.brandMatrix}
          consolidation={data?.brandMatrixConsolidation}
          sessionWeekDisplay={data?.headerContext?.sessionWeekDisplay}
          loading={loading}
        />

        {/* 6. Section 3: Salesman Leaderboard Table (Sorted Strictly by District D-01 s/d D-12) */}
        <SalesmanLeaderboardTable
          salesmen={data?.salesmen}
          sessionWeekDisplay={data?.headerContext?.sessionWeekDisplay}
          loading={loading}
        />
      </div>
    </AdminLayout>
  );
};
