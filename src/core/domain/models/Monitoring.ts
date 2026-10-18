export type DayStatus = "TERISI" | "TIDAK_ADA_KUNJUNGAN" | "KOSONG";
export type RekapStatus = "DRAFT" | "FINAL";

export interface WeeklyMonitoringDayCell {
  hari: number; // 1..6 (1=Senin..6=Sabtu)
  namaHari: string; // Senin..Sabtu
  date: string; // YYYY-MM-DD
  status: DayStatus;
  statusRekap?: RekapStatus | null;
  rekapId?: string | null;
  jumlahKunjungan: number; // Callmade (CM)
  totalEc: number; // Effective Call (EC)
  bdOutlet: number; // Brand Distribution Outlet (BD)
  volumeGg?: number | null; // Volume Pack
  alasan?: string | null; // Alasan jika TIDAK_ADA_KUNJUNGAN
}

export interface DistrictKpiAchievement {
  target: {
    kunjungan: number;
    ec: number;
    bd: number;
    volume: number;
  };
  actual: {
    kunjungan: number;
    ec: number;
    bd: number;
    volume: number;
  };
  percent: {
    kunjungan: number;
    ec: number;
    bd: number;
    volume: number;
    overall: number;
  };
}

export interface WeeklyDistrictMonitoringRow {
  districtId: string;
  districtKode: string;
  ouKode: string;
  karyawanId: string;
  karyawanName: string;
  days: WeeklyMonitoringDayCell[];
  totalHariTerisi: number;
  persentaseLengkap: number;
  kpiAchievement?: DistrictKpiAchievement;
}

export interface WeeklyMonitoringResponse {
  kodeMinggu: number;
  kodeMingguDisplay: string; // e.g. 2641
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isLocked: boolean;
  districts: WeeklyDistrictMonitoringRow[];
}
