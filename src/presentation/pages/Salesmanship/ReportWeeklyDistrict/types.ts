
export interface ReportFilterState {
  kodeMinggu?: number;
  ouKode: string;
  districtId: string;
  kategori: string;
  statusRekap: string;
}

export type BrandKategoriOption = 'ALL' | 'SKM FF' | 'SKM LTLN' | 'SKT' | 'SPM' | 'SPT' | 'SKTF';

export const BRAND_KATEGORI_OPTIONS: { value: BrandKategoriOption; label: string }[] = [
  { value: 'ALL', label: 'Semua Kategori (SKM FF, SKM LTLN, SKT...)' },
  { value: 'SKM FF', label: 'SKM FF' },
  { value: 'SKM LTLN', label: 'SKM LTLN' },
  { value: 'SKT', label: 'SKT' },
  { value: 'SPM', label: 'SPM' },
  { value: 'SPT', label: 'SPT' },
  { value: 'SKTF', label: 'SKTF' },
];

export const STATUS_DATA_OPTIONS = [
  { value: 'FINAL', label: 'FINAL saja' },
  { value: 'ALL', label: 'Semua (DRAFT & FINAL)' },
];
