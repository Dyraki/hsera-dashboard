export interface Channel {
  id: string;
  kode: string;
  nama: string;
  deskripsi?: string | null;
  urutan: number;
  status: string;
}
