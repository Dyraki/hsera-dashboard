export type StatusFilterOption = "ALL" | "LENGKAP" | "DRAFT" | "BELUM_LENGKAP" | "KOSONG";
export type ViewMode = "RINGKAS" | "DETAIL";

export interface MonitoringKpiSummary {
  totalSlotHari: number;
  totalHariFinal: number;
  persentaseLengkap: number;
  totalHariDraft: number;
  totalHariKosong: number;
  draftDistricts: string[];
  urgentDistricts: string[];
  totalCm: number;
  totalBd: number;
  totalEc: number;
  totalVolume: number;
}

export interface FilterState {
  ouKode: string;
  status: StatusFilterOption;
  search: string;
}
