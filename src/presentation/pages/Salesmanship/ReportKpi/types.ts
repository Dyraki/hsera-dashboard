export interface KpiReportFilterState {
  year: number;
  quarter: number;
  cycleType: 'ALL' | 'EVEN' | 'ODD';
  selectedWeek: number | 'all';
  ouKode: string;
  districtId: string;
}

export interface QuarterOption {
  year: number;
  quarter: number;
  label: string;
}

export const QUARTER_OPTIONS: QuarterOption[] = [
  { year: 2026, quarter: 4, label: 'Kuartal 4 - 2026 (Okt - Des)' },
  { year: 2026, quarter: 3, label: 'Kuartal 3 - 2026 (Jul - Sep)' },
  { year: 2026, quarter: 2, label: 'Kuartal 2 - 2026 (Apr - Jun)' },
  { year: 2026, quarter: 1, label: 'Kuartal 1 - 2026 (Jan - Mar)' },
  { year: 2025, quarter: 4, label: 'Kuartal 4 - 2025 (Okt - Des)' },
];

export const CYCLE_OPTIONS = [
  { value: 'ALL', label: 'Semua Minggu (Genap & Ganjil)' },
  { value: 'EVEN', label: 'Week Genap Saja' },
  { value: 'ODD', label: 'Week Ganjil Saja' },
] as const;

export type KpiTabType = 'ALL' | 'KUNJUNGAN' | 'EC' | 'BD' | 'VOLUME';
