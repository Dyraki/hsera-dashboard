export interface District {
  id: string;
  ouKode: string;
  kode: string;
  karyawanId: string;
  karyawanName?: string;
  channels?: Array<{ id: string; kode: string; nama: string }>;
  status: 'AKTIF' | 'NONAKTIF' | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DistrictWriteData {
  ouKode: string;
  kode: string;
  karyawanId: string;
  channelIds?: string[];
  status?: string;
}

export interface SalesmanOption {
  id: string;
  namaLengkap: string;
  nik?: string;
  jabatan?: string;
  ouKode?: string;
}

export interface OperationUnitOption {
  id: string;
  kode: string;
  nama: string;
  kategori?: string;
  type?: string;
}
