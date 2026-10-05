import { IRoleRepository } from '../../domain/repositories/IManagementRepository';
import { MenuAclRecord, RoleAclWriteData, RoleRecord, RoleWriteData } from '../../domain/models/Management';
import { AxiosHttpClient } from '../api/AxiosHttpClient';
import { MenuAclDto, RoleDto } from '../dto/ManagementDto';
import { toMenuAclRecord, toRoleAclWriteDto, toRoleRecord, toRoleWriteDto } from '../mappers/ManagementMapper';

export class HttpRoleRepository implements IRoleRepository {
  async list(): Promise<RoleRecord[]> {
    const response = await AxiosHttpClient.get<RoleDto[]>('/api/roles');
    return (response.data || []).map(toRoleRecord);
  }

  async getAcls(roleId?: string): Promise<MenuAclRecord[]> {
    const path = roleId ? `/api/roles/${roleId}/acls` : '/api/roles/acls/template';
    const response = await AxiosHttpClient.get<MenuAclDto[]>(path);
    return (response.data || []).map(toMenuAclRecord);
  }

  async create(data: RoleWriteData): Promise<void> {
    await AxiosHttpClient.post('/api/roles', toRoleWriteDto(data));
  }

  async update(id: string, data: RoleWriteData): Promise<void> {
    await AxiosHttpClient.put(`/api/roles/${id}`, toRoleWriteDto(data));
  }

  async saveAcls(roleId: string, data: RoleAclWriteData[]): Promise<void> {
    await AxiosHttpClient.put(`/api/roles/${roleId}/acls`, data.map(toRoleAclWriteDto));
  }

  async delete(id: string): Promise<void> {
    await AxiosHttpClient.delete(`/api/roles/${id}`);
  }
}