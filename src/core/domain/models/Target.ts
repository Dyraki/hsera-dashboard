export type JenisTarget = 'KUNJUNGAN' | 'BD' | 'EC' | 'FACEUP' | 'VOLUME';

export interface Target {
  id: string;
  jenisTarget: JenisTarget;
  ouKode?: string | null;
  ouNama?: string | null;
  districtId?: string | null;
  districtKode?: string | null;
  hariKunjungan?: number | null; // 1 = Senin, 2 = Selasa, 3 = Rabu, 4 = Kamis, 5 = Jumat, 6 = Sabtu
  nilai: number;
  berlakuDari: string;
  berlakuSampai?: string | null;
  status: 'AKTIF' | 'NONAKTIF' | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TargetWriteData {
  id?: string;
  jenisTarget: JenisTarget;
  ouKode?: string | null;
  districtId?: string | null;
  hariKunjungan?: number | null;
  nilai: number;
  berlakuDari: string;
  berlakuSampai?: string | null;
  status?: string;
}

export interface TargetFilterQuery {
  ouKode?: string | null;
  districtId?: string;
  jenisTarget?: JenisTarget | string;
  status?: string;
}
