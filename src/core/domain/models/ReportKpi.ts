export interface KpiReportFilterQuery {
  year?: number;
  quarter?: number;
  cycleType?: 'ALL' | 'EVEN' | 'ODD';
  selectedWeek?: number | 'all';
  ouKode?: string;
  districtId?: string;
  statusRekap?: string;
}

export interface KpiParameterMetric {
  target: number;
  realisasi: number;
  achievementPercent: number;
  gap: number;
  status: 'ACHIEVED' | 'ON_TRACK' | 'UNDER_TARGET' | 'CRITICAL';
}

export interface KpiWeeklyDataPoint {
  kodeMinggu: number;
  weekNumber: number;
  weekLabel: string;
  cycle: 'EVEN' | 'ODD';
  isCurrent: boolean;
  isSelected: boolean;
  startDate: string;
  endDate: string;
  kunjungan: KpiParameterMetric;
  ec: KpiParameterMetric;
  bd: KpiParameterMetric;
  volume: KpiParameterMetric;
  volumeKarton: KpiParameterMetric;
}

export interface KpiSummaryMetric {
  target: number;
  realisasi: number;
  achievementPercent: number;
  gap: number;
  status: 'ACHIEVED' | 'ON_TRACK' | 'UNDER_TARGET' | 'CRITICAL';
  weeklyAverageReal: number;
  weeklyAverageTarget: number;
  bestWeek: { weekNumber: number; achievement: number };
  worstWeek: { weekNumber: number; achievement: number };
}

export interface KpiTrackingReportResponse {
  header: {
    year: number;
    quarter: number;
    cycleType: 'ALL' | 'EVEN' | 'ODD';
    selectedWeek: number | 'all';
    ouKode?: string;
    districtId?: string;
    districtKode?: string;
    totalWeeksInQuarter: number;
    filteredWeeksCount: number;
    activeDistrictsCount: number;
  };
  summary: {
    kunjungan: KpiSummaryMetric;
    ec: KpiSummaryMetric;
    bd: KpiSummaryMetric;
    volume: KpiSummaryMetric;
  };
  weeks: KpiWeeklyDataPoint[];
}
