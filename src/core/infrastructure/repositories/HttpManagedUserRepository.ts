import { IManagedUserRepository } from '../../domain/repositories/IManagedUserRepository';
import { ManagedUser, ManagedUserWriteData } from '../../domain/models/Management';
import { AxiosHttpClient } from '../api/AxiosHttpClient';
import { ManagedUserDto } from '../dto/ManagementDto';
import { toManagedUser, toManagedUserWriteDto } from '../mappers/ManagementMapper';

export class HttpManagedUserRepository implements IManagedUserRepository {
  async list(): Promise<ManagedUser[]> {
    const response = await AxiosHttpClient.get<ManagedUserDto[]>('/api/users');
    return (response.data || []).map(toManagedUser);
  }

  async create(data: ManagedUserWriteData): Promise<void> {
    await AxiosHttpClient.post('/api/users', toManagedUserWriteDto(data));
  }

  async update(id: string, data: ManagedUserWriteData): Promise<void> {
    await AxiosHttpClient.put(`/api/users/${id}`, toManagedUserWriteDto(data));
  }

  async updateRoles(id: string, roleIds: string[]): Promise<void> {
    await AxiosHttpClient.put(`/api/users/${id}/roles`, { roleIds });
  }

  async delete(id: string): Promise<void> {
    await AxiosHttpClient.delete(`/api/users/${id}`);
  }
}