export type JenisRekap = "NORMAL" | "TIDAK_ADA_KUNJUNGAN";
export type StatusRekap = "DRAFT" | "FINAL";

export interface CallsheetDistrict {
  id: string;
  kode: string;
  ouKode: string;
  karyawanId: string;
  karyawanName: string;
}

export interface CallsheetTargets {
  kunjungan: number;
  bd: number;
  ec: number;
}

export interface CallsheetBrand {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  urutan: number;
}

export interface CallsheetNotasi {
  id: string;
  kode: string;
  nama: string;
  levelInput: string;
  kelompokTampil: string | null;
  satuan: string;
  urutan: number;
}

export interface CallsheetRekap {
  id?: string;
  jenisRekap: JenisRekap;
  alasan?: string | null;
  jumlahKunjungan: number;
  totalEc: number;
  bdOutlet?: number;
  volumeGg?: number | null;
  statusRekap: StatusRekap;
  catatan?: string | null;
  matrix: Record<string, Record<string, number>>; // [brandId][notasiKode] = nilai
}

export interface CallsheetFormResponse {
  date: string;
  hariKunjungan: number;
  namaHari: string;
  kodeMinggu: number;
  kodeMingguDisplay: string;
  isLocked: boolean;
  isWorkday: boolean;
  district: CallsheetDistrict;
  targets: CallsheetTargets;
  brands: CallsheetBrand[];
  notasiList: CallsheetNotasi[];
  rekap: CallsheetRekap;
}

export interface SaveCallsheetPayload {
  id?: string;
  districtId: string;
  tglKunjungan: string;
  jenisRekap: JenisRekap;
  alasan?: string | null;
  jumlahKunjungan?: number;
  totalEc?: number;
  bdOutlet?: number;
  volumeGg?: number | null;
  statusRekap?: StatusRekap;
  catatan?: string | null;
  matrix?: Array<{
    brandId: string;
    notasiKode: string;
    nilai: number;
  }>;
}
