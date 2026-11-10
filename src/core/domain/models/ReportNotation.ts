import { KpiSummaryMetric } from './ReportKpi';
import { SkuSalesRow, SkuSalesWeekColumn, SkuSalesReportResponse } from './ReportSkuSales';

export interface NotationReportFilterQuery {
  year?: number;
  quarter?: number;
  cycleType?: 'ALL' | 'EVEN' | 'ODD';
  selectedWeek?: number | 'all';
  ouKode?: string;
  districtId?: string;
  brandId?: string | 'all';
  statusRekap?: string;
}

export interface NotationDataPoint {
  periodKey: string | number;
  label: string;
  cycle?: 'EVEN' | 'ODD';
  isCurrent?: boolean;
  isPast?: boolean;
  isFuture?: boolean;
  hasData?: boolean;
  isEffective?: boolean;
  startDate?: string;
  endDate?: string;
  sk: number;       // Stok Kurang (Outlet)
  sl: number;       // Stok Laku (Outlet)
  oos: number;      // Out Of Stock (Outlet)
  sd: number;       // Stok Diam (Outlet)
  tl: number;       // Tidak Laku (Outlet)
  bpj: number;      // Belum Pernah Jual (Outlet)
  sb: number;       // Stok Baru (Outlet)
  avgStock: number; // Rata-rata Kuantitas Stok (Pack/Outlet)
  avgBuy: number;   // Rata-rata Kuantitas Pembelian (Pack/Outlet)
  totalCalls: number;
}

export interface NotationReportResponse {
  header: {
    year: number;
    quarter: number;
    cycleType: 'ALL' | 'EVEN' | 'ODD';
    selectedWeek: number | 'all';
    ouKode?: string;
    districtId?: string;
    brandId?: string;
    brandNama?: string;
    currentWeekNumber: number;
    prevCycleWeekNumber: number;
  };
  summary: {
    kunjungan: KpiSummaryMetric;
    ec: KpiSummaryMetric;
    bd: KpiSummaryMetric;
    volume: KpiSummaryMetric;
  };
  notationTrend: NotationDataPoint[];
  skuMatrix: {
    weeks: SkuSalesWeekColumn[];
    skuRows: SkuSalesRow[];
    summaryRow: SkuSalesReportResponse['summaryRow'];
    prevCycleWeekNumber: number;
    currentWeekNumber: number;
  };
}
