import { JenisTarget } from '@/core/domain/models/Target';

export type ModalMode = 'create' | 'edit';

export interface TargetFormData {
  id?: string;
  jenisTarget: JenisTarget;
  districtId: string; // '' means null/Global
  hariKunjungan: string; // '' means null/Semua Hari, '1'..'6'
  nilai: number | string;
  berlakuDari: string; // YYYY-MM-DD
  berlakuSampai: string; // YYYY-MM-DD or ''
  status: 'AKTIF' | 'NONAKTIF';
}

export const JENIS_TARGET_OPTIONS = [
  { value: 'KUNJUNGAN', label: 'Target Kunjungan Outlet (KUNJUNGAN)' },
  { value: 'BD', label: 'Target Brand Distribution (BD)' },
  { value: 'EC', label: 'Target Effective Call (EC)' },
  { value: 'FACEUP', label: 'Target Face Up (FACEUP)' },
  { value: 'VOLUME', label: 'Target Volume Penjualan (VOLUME)' },
];

export const HARI_KUNJUNGAN_OPTIONS = [
  { value: '', label: 'Semua Hari (Senin - Sabtu)' },
  { value: '1', label: 'Senin (Hari 1)' },
  { value: '2', label: 'Selasa (Hari 2)' },
  { value: '3', label: 'Rabu (Hari 3)' },
  { value: '4', label: 'Kamis (Hari 4)' },
  { value: '5', label: 'Jumat (Hari 5)' },
  { value: '6', label: 'Sabtu (Hari 6)' },
];

export const STATUS_OPTIONS = [
  { value: 'AKTIF', label: 'AKTIF' },
  { value: 'NONAKTIF', label: 'NONAKTIF' },
];

export const getHariLabel = (hari?: number | null): string => {
  if (hari === null || hari === undefined || hari === 0) return 'Semua Hari';
  const mapping: Record<number, string> = {
    1: 'Senin',
    2: 'Selasa',
    3: 'Rabu',
    4: 'Kamis',
    5: 'Jumat',
    6: 'Sabtu',
  };
  return mapping[hari] || `Hari ${hari}`;
};
