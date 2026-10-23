export interface BrandFormData {
  id?: string;
  kode: string;
  nama: string;
  kategori: string;
  urutan: number;
  status: string;
}

export interface BrandFilterState {
  search: string;
  kategori: string;
  status: string;
}

export interface BrandReorderItem {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  currentUrutan: number;
  newUrutan: number;
  isChanged: boolean;
}

export type BrandModalMode = 'create' | 'edit';
