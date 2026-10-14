import { IOperationUnitRepository, OperationUnitFilterParams } from '../../domain/repositories/IOperationUnitRepository';
import { OperationUnit, OperationUnitWriteData } from '../../domain/models/OperationUnit';
import { AxiosHttpClient } from '../api/AxiosHttpClient';
import { OperationUnitDto } from '../dto/OperationUnitDto';
import { toOperationUnit, toOperationUnitWriteDto } from '../mappers/OperationUnitMapper';

export class HttpOperationUnitRepository implements IOperationUnitRepository {
  async getTree(): Promise<OperationUnit[]> {
    const response = await AxiosHttpClient.get<OperationUnitDto[]>('/api/operation-units/tree');
    return (response.data || []).map(toOperationUnit);
  }

  async list(params?: OperationUnitFilterParams): Promise<OperationUnit[]> {
    const query = new URLSearchParams();
    if (params?.scope) query.append('scope', 'true');
    if (params?.onlyBranches) query.append('onlyBranches', 'true');
    if (params?.type) query.append('type', params.type);
    if (params?.status !== undefined) query.append('status', String(params.status));
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString();
    const url = queryString ? `/api/operation-units?${queryString}` : '/api/operation-units';
    const response = await AxiosHttpClient.get<OperationUnitDto[]>(url);
    return (response.data || []).map(toOperationUnit);
  }

  async getById(id: string): Promise<OperationUnit> {
    const response = await AxiosHttpClient.get<OperationUnitDto>(`/api/operation-units/${id}`);
    return toOperationUnit(response.data);
  }

  async create(data: OperationUnitWriteData): Promise<void> {
    await AxiosHttpClient.post('/api/operation-units', toOperationUnitWriteDto(data));
  }

  async update(id: string, data: OperationUnitWriteData): Promise<void> {
    await AxiosHttpClient.put(`/api/operation-units/${id}`, toOperationUnitWriteDto(data));
  }

  async delete(id: string): Promise<void> {
    await AxiosHttpClient.delete(`/api/operation-units/${id}`);
  }
}
