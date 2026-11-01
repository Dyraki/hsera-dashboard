export interface SkuSalesFilterQuery {
  year?: number;
  quarter?: number;
  cycleType?: 'EVEN' | 'ODD' | 'ALL';
  ouKode?: string;
  districtId?: string;
  statusRekap?: string;
}

export interface SkuSalesWeekColumn {
  kodeMinggu: number;
  weekNumber: number;
  weekLabel: string;
  cycle: 'EVEN' | 'ODD';
  isCurrent: boolean;
  startDate: string;
  endDate: string;
}

export interface SkuSalesRow {
  brandId: string;
  kode: string;
  nama: string;
  urutan: number;
  volumesByWeek: Record<number, number>;
  totalQuarter: number;
  avgWeekly: number;
  avgDaily: number;
  wtdCurrentVolume: number;
  wtdPrevVolume: number;
  growthWtdPercent: number | null;
  deltaPack: number;
}

export interface SkuSalesKpiSummary {
  kunjungan: {
    actual: number;
    target: number;
    achievementPercent: number;
  };
  penjualanWtd: {
    currentWeekNumber: number;
    currentVolume: number;
    cutOffDay: number;
    cutOffDayName: string;
  };
  growthWtd: {
    prevWeekNumber: number;
    prevVolume: number;
    deltaPack: number;
    percent: number | null;
    isPositive: boolean;
  };
  productivity: {
    dropSize: number;
    totalCalls: number;
    totalVolume: number;
  };
  quarterOverview: {
    totalQuarterVolume: number;
    avgVolumePerWeek: number;
    activeSkuCount: number;
  };
}

export interface SkuSalesQuarterChartPoint {
  kodeMinggu: number;
  weekLabel: string;
  weekNumber: number;
  cycle: 'EVEN' | 'ODD';
  isCurrent: boolean;
  isPast: boolean;
  totalVolume: number;
  totalCalls: number;
  targetCalls: number;
}

export interface SkuSalesReportResponse {
  header: {
    year: number;
    quarter: number;
    cycleType: 'EVEN' | 'ODD' | 'ALL';
    ouKode?: string;
    districtId?: string;
    districtKode?: string;
    cutOffDay: number;
    cutOffDayName: string;
    currentWeekNumber: number;
    prevCycleWeekNumber: number;
  };
  weeks: SkuSalesWeekColumn[];
  kpiSummary: SkuSalesKpiSummary;
  chartTrend: SkuSalesQuarterChartPoint[];
  skuRows: SkuSalesRow[];
  summaryRow: {
    totalByWeek: Record<number, number>;
    grandTotalQuarter: number;
    grandAvgWeekly: number;
    grandAvgDaily: number;
    grandWtdCurrent: number;
    grandWtdPrev: number;
    grandGrowthWtdPercent: number | null;
    grandDeltaPack: number;
  };
}
