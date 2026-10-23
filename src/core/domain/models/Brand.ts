export interface Brand {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  urutan: number;
  status: 'AKTIF' | 'NONAKTIF' | string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface BrandWriteData {
  id?: string;
  kode: string;
  nama: string;
  kategori: string;
  urutan?: number;
  status?: string;
}

export interface BrandOrderItem {
  id: string;
  urutan: number;
}

export interface BrandFilterQuery {
  status?: string;
  kategori?: string;
  search?: string;
}
