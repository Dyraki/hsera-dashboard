import { IDashboardRepository } from '../../domain/repositories/IManagementRepository';
import { AxiosHttpClient } from '../api/AxiosHttpClient';

interface DashboardStatusDto {
  message: string;
}

export class HttpDashboardRepository implements IDashboardRepository {
  async getStatus(): Promise<string> {
    const response = await AxiosHttpClient.get<DashboardStatusDto>('/api/admin/dashboard');
    return response.data.message;
  }
}