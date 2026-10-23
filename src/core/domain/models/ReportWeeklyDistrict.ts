export interface AvailableWeekOption {
  kodeMinggu: number;
  kodeMingguDisplay: string;
  startDate: string;
  endDate: string;
  label: string;
  isCurrent: boolean;
}

export interface BrandMatrixItem {
  urutan: number;
  brandId: string;
  kode: string;
  nama: string;
  kategori: string;
  notasi: {
    skPercent: number;
    slPercent: number;
    sdPercent: number;
    oosPercent: number;
    sbPercent: number;
    tlPercent: number;
    bpjPercent: number;
    bdPercent: number;
  };
  volume: {
    avgStock: number;
    avgBuy: number;
    totalVol: number;
  };
}

export interface WeeklyDistrictReportSummaryRow {
  label: string;
  skPercent: number;
  slPercent: number;
  sdPercent: number;
  oosPercent: number;
  sbPercent: number;
  tlPercent: number;
  bpjPercent: number;
  bdPercent: number;
  avgStock: number;
  avgBuy: number;
  totalVol: number;
}

export interface WeeklyDistrictNotationAnalysis {
  totalKunjungan: number;
  stockLevel: {
    totalOutlet: number;
    sl: number;
    slPercent: number;
    sk: number;
    skPercent: number;
    oos: number;
    oosPercent: number;
  };
  tradeProgram: {
    sd: number;
    sdPercent: number;
    tl: number;
    tlPercent: number;
  };
  penetration: {
    bd: number;
    bdPercent: number;
    bpj: number;
    bpjPercent: number;
    sb: number;
    sbPercent: number;
  };
}

export interface WeeklyDistrictReportResponse {
  header: {
    kodeMinggu: number;
    kodeMingguDisplay: string;
    startDate: string;
    endDate: string;
    isLocked: boolean;
    lockStatusText: string;
    district: {
      id: string;
      kode: string;
      nama: string;
      ouKode: string;
      karyawanId: string;
      karyawanNama: string;
      lastSync?: string | null;
    };
  };
  kpiSummary: {
    kunjungan: {
      target: number;
      actual: number;
      percent: number;
      gap: number;
    };
    ec: {
      target: number;
      actual: number;
      percentFromTarget: number;
      percentFromKunjungan: number;
      nonTransaksi: number;
    };
    bd: {
      target: number;
      actual: number;
      percentFromTarget: number;
      percentFromKunjungan: number;
    };
    volume: {
      target: number;
      actual: number;
      percentFromTarget: number;
    };
    territoryReachIndex: number;
  };
  dailyTrend: Array<{
    hari: number;
    namaHari: string;
    date: string;
    actual: number;
    target: number;
    percent: number;
    statusRekap: string | null;
  }>;
  notationAnalysis: WeeklyDistrictNotationAnalysis;
  brandMatrix: {
    totalSkuAktif: number;
    totalKunjunganMingguan: number;
    brands: BrandMatrixItem[];
    summaryRow: WeeklyDistrictReportSummaryRow;
  };
}

export interface WeeklyDistrictReportFilterQuery {
  districtId: string;
  kodeMinggu?: number;
  kategori?: string;
  statusRekap?: string;
  ouKode?: string;
}
