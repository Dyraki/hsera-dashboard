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
  avgStock: number; // Rata-rata Kuantitas Stok (Pack/Outlet/Brand)
  avgBuy: number;   // Rata-rata Kuantitas Pembelian (Pack/Outlet/Brand)
  totalCalls: number;
  brandCount?: number;
  totalStockPack?: number;
  totalBuyPack?: number;
}

export interface BrandNotationAbsoluteItem {
  urutan: number;
  brandId?: string;
  kodeBrand: string;
  namaBrand: string;
  kategori?: string;
  callmade: number;        // Denominator kunjungan siap pakai
  bd: number;              // Jumlah toko BD absolut (oos + sk + sl + sd + sb)
  totalStockPack: number;  // Total fisik pack stok di toko saat diaudit
  totalBuyPack: number;    // Total fisik pack pesanan/pembelian toko
  totalVolPack: number;    // Total volume (pack)
  sk: number;              // Toko Stok Kurang
  sl: number;              // Toko Stok Laku
  sd: number;              // Toko Stok Diam
  oos: number;             // Toko Out Of Stock
  sb: number;              // Toko Stok Baru
  tl: number;              // Toko Tidak Laku
  bpj: number;             // Toko Belum Pernah Jual
  avgStockPack?: number;   // totalStockPack / callmade
  avgStokPack?: number;    // Alias untuk kompatibilitas matrix table
  avgBuyPack?: number;     // totalBuyPack / callmade
  avgBeliPack?: number;    // Alias untuk kompatibilitas matrix table
  bdPercent?: number;      // (bd / callmade) * 100%
  skPercent?: number;      // (sk / callmade) * 100%
  slPercent?: number;      // (sl / callmade) * 100%
  sdPercent?: number;      // (sd / callmade) * 100%
  oosPercent?: number;     // (oos / callmade) * 100%
  sbPercent?: number;      // (sb / callmade) * 100%
  tlPercent?: number;      // (tl / callmade) * 100%
  bpjPercent?: number;     // (bpj / callmade) * 100%
}

export interface BrandNotationMatrixData {
  callmade: number;
  rows: BrandNotationAbsoluteItem[];
  consolidation: BrandNotationAbsoluteItem;
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
  brandMatrix?: BrandNotationMatrixData;
  skuMatrix: {
    weeks: SkuSalesWeekColumn[];
    skuRows: SkuSalesRow[];
    summaryRow: SkuSalesReportResponse['summaryRow'];
    prevCycleWeekNumber: number;
    currentWeekNumber: number;
  };
}
