import { IKaryawanRepository } from '../../domain/repositories/IKaryawanRepository';
import { Karyawan, KaryawanListQuery, KaryawanPage, KaryawanWriteData } from '../../domain/models/Karyawan';
import { AxiosHttpClient } from '../api/AxiosHttpClient';
import { KaryawanDto, KaryawanPageDto } from '../dto/KaryawanDto';
import { toKaryawan, toKaryawanPage, toKaryawanWriteDto } from '../mappers/KaryawanMapper';

export class HttpKaryawanRepository implements IKaryawanRepository {
  async list(query: KaryawanListQuery): Promise<KaryawanPage> {
    const params = new URLSearchParams({ page: String(query.page), limit: String(query.limit) });
    if (query.search) params.set('search', query.search);
    if (query.operationUnitId) params.set('operationUnitId', query.operationUnitId);
    if (query.status !== undefined) params.set('status', String(query.status));

    const response = await AxiosHttpClient.get<KaryawanPageDto>(`/api/karyawan?${params.toString()}`);
    return toKaryawanPage(response.data);
  }

  async getById(id: string): Promise<Karyawan> {
    const response = await AxiosHttpClient.get<KaryawanDto>(`/api/karyawan/${id}`);
    return toKaryawan(response.data);
  }

  async create(data: KaryawanWriteData): Promise<void> {
    await AxiosHttpClient.post('/api/karyawan', toKaryawanWriteDto(data));
  }

  async update(id: string, data: KaryawanWriteData): Promise<void> {
    await AxiosHttpClient.put(`/api/karyawan/${id}`, toKaryawanWriteDto(data));
  }

  async delete(id: string): Promise<void> {
    await AxiosHttpClient.delete(`/api/karyawan/${id}`);
  }
}