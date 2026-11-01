import { SkuSalesFilterQuery } from '@/core/domain/models/ReportSkuSales';

export interface SkuReportFilterState extends SkuSalesFilterQuery {
  year: number;
  quarter: number;
  cycleType: 'EVEN' | 'ODD' | 'ALL';
  ouKode: string;
  districtId: string;
}

export interface QuarterOptionItem {
  year: number;
  quarter: number;
  label: string;
}

export const QUARTER_OPTIONS: QuarterOptionItem[] = [
  { year: 2026, quarter: 4, label: 'Kuartal Q4 2026 (W40 - W52)' },
  { year: 2026, quarter: 3, label: 'Kuartal Q3 2026 (W27 - W39)' },
  { year: 2026, quarter: 2, label: 'Kuartal Q2 2026 (W14 - W26)' },
  { year: 2026, quarter: 1, label: 'Kuartal Q1 2026 (W01 - W13)' },
];

export const CYCLE_OPTIONS = [
  { value: 'EVEN', label: 'Week Genap' },
  { value: 'ODD', label: 'Week Ganjil' },
  { value: 'ALL', label: 'Semua Week (13 Minggu)' },
] as const;
