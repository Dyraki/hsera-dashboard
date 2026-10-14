import { JenisRekap, StatusRekap } from "@/core/domain/models/Callsheet";

export interface RowValidationResult {
  brandId: string;
  brandKode: string;
  brandNama: string;
  totalStatus: number; // SK + SL + SD + OOS + SB + TL + BPJ
  jumlahKunjungan: number; // Realisasi kunjungan outlet hari ini
  diff: number; // totalStatus - jumlahKunjungan
  isMatch: boolean;
  isOver: boolean;
  isUnder: boolean;
}

export interface ColumnTotals {
  oos: number;
  sk: number;
  sl: number;
  sd: number;
  sb: number;
  bd: number;
  tl: number;
  bpj: number;
  stock: number;
  buy: number;
  faceUp: number;
  okCount: number;
  warnCount: number;
  errCount: number;
}

export interface CallsheetFormState {
  districtId: string;
  date: string;
  jenisRekap: JenisRekap;
  alasan: string;
  jumlahKunjungan: number;
  totalEc: number;
  volumeGg: string;
  catatan: string;
  statusRekap: StatusRekap;
  matrix: Record<string, Record<string, number>>; // [brandId][notasiKode] = number
}
