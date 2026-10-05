import { Karyawan, KaryawanListQuery, KaryawanPage, KaryawanWriteData } from '../models/Karyawan';

export interface IKaryawanRepository {
  list(query: KaryawanListQuery): Promise<KaryawanPage>;
  getById(id: string): Promise<Karyawan>;
  create(data: KaryawanWriteData): Promise<void>;
  update(id: string, data: KaryawanWriteData): Promise<void>;
  delete(id: string): Promise<void>;
}