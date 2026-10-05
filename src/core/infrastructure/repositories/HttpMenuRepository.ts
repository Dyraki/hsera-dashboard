import { IMenuRepository } from '../../domain/repositories/IManagementRepository';
import { MenuNode, MenuRecord, MenuWriteData } from '../../domain/models/Management';
import { AxiosHttpClient } from '../api/AxiosHttpClient';
import { MenuDto, MenuNodeDto } from '../dto/ManagementDto';
import { toMenuNode, toMenuRecord, toMenuWriteDto } from '../mappers/ManagementMapper';

export class HttpMenuRepository implements IMenuRepository {
  async list(): Promise<MenuRecord[]> {
    const response = await AxiosHttpClient.get<MenuDto[]>('/api/menus');
    return (response.data || []).map(toMenuRecord);
  }

  async getNavigationTree(): Promise<MenuNode[]> {
    const response = await AxiosHttpClient.get<MenuNodeDto[]>('/api/user/menus');
    return (response.data || []).map(toMenuNode);
  }

  async create(data: MenuWriteData): Promise<void> {
    await AxiosHttpClient.post('/api/menus', toMenuWriteDto(data));
  }

  async update(id: string, data: MenuWriteData): Promise<void> {
    await AxiosHttpClient.put(`/api/menus/${id}`, toMenuWriteDto(data));
  }

  async delete(id: string): Promise<void> {
    await AxiosHttpClient.delete(`/api/menus/${id}`);
  }
}