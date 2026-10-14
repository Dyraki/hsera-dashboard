import { WeeklyMonitoringResponse } from "../../domain/models/Monitoring";
import { ISalesmanshipRepository, DistrictFilterQuery } from '../../domain/repositories/ISalesmanshipRepository';
import { District, DistrictWriteData, SalesmanOption, OperationUnitOption } from '../../domain/models/District';
import { Target, TargetWriteData, TargetFilterQuery } from '../../domain/models/Target';
import { CallsheetFormResponse, SaveCallsheetPayload } from '../../domain/models/Callsheet';
import { SalesmanshipHttpClient } from '../api/SalesmanshipHttpClient';

export class HttpSalesmanshipRepository implements ISalesmanshipRepository {
  async getDistricts(filter?: DistrictFilterQuery): Promise<District[]> {
    const params = new URLSearchParams();
    if (filter?.ouKode) params.append('ouKode', filter.ouKode);
    if (filter?.status && filter.status !== 'all') params.append('status', filter.status);
    if (filter?.search) params.append('search', filter.search);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await SalesmanshipHttpClient.get<{ success: boolean; data: District[] }>(
      `/api/salesmanship/districts${queryStr}`
    );
    return res.data.data;
  }

  async getDistrictById(id: string): Promise<District> {
    const res = await SalesmanshipHttpClient.get<{ success: boolean; data: District }>(
      `/api/salesmanship/districts/${id}`
    );
    return res.data.data;
  }

  async createDistrict(data: DistrictWriteData): Promise<District> {
    const res = await SalesmanshipHttpClient.post<{ success: boolean; data: District }>(
      '/api/salesmanship/districts',
      data
    );
    return res.data.data;
  }

  async updateDistrict(id: string, data: Partial<DistrictWriteData>): Promise<District> {
    const res = await SalesmanshipHttpClient.put<{ success: boolean; data: District }>(
      `/api/salesmanship/districts/${id}`,
      data
    );
    return res.data.data;
  }

  async deleteDistrict(id: string): Promise<void> {
    await SalesmanshipHttpClient.delete(`/api/salesmanship/districts/${id}`);
  }

  async getSalesmen(): Promise<SalesmanOption[]> {
    const res = await SalesmanshipHttpClient.get<{ success: boolean; data: SalesmanOption[] }>(
      '/api/salesmanship/references/salesmen'
    );
    return res.data.data;
  }

  async getOperationUnits(): Promise<OperationUnitOption[]> {
    const res = await SalesmanshipHttpClient.get<{ success: boolean; data: OperationUnitOption[] }>(
      '/api/salesmanship/references/operation-units'
    );
    return res.data.data;
  }

  // Target Management Implementation
  async getTargets(filter?: TargetFilterQuery): Promise<Target[]> {
    const params = new URLSearchParams();
    if (filter?.districtId && filter.districtId !== 'all') params.append('districtId', filter.districtId);
    if (filter?.jenisTarget && filter.jenisTarget !== 'all') params.append('jenisTarget', filter.jenisTarget);
    if (filter?.status && filter.status !== 'all') params.append('status', filter.status);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await SalesmanshipHttpClient.get<{ success: boolean; data: Target[] }>(
      `/api/salesmanship/targets${queryStr}`
    );
    return res.data.data;
  }

  async saveTarget(data: TargetWriteData): Promise<Target> {
    const res = await SalesmanshipHttpClient.post<{ success: boolean; data: Target }>(
      '/api/salesmanship/targets',
      data
    );
    return res.data.data;
  }

  async deleteTarget(id: string): Promise<void> {
    await SalesmanshipHttpClient.delete(`/api/salesmanship/targets/${id}`);
  }
  // Callsheet Implementation
  async getCallsheetFormData(districtId: string, date: string): Promise<CallsheetFormResponse> {
    const res = await SalesmanshipHttpClient.get<{ success: boolean; data: CallsheetFormResponse }>(
      `/api/salesmanship/callsheets/form?districtId=${districtId}&date=${date}`
    );
    return res.data.data;
  }

  async saveCallsheet(payload: SaveCallsheetPayload): Promise<any> {
    const res = await SalesmanshipHttpClient.post<{ success: boolean; data: any }>(
      '/api/salesmanship/callsheets',
      payload
    );
    return res.data.data;
  }

  async deleteCallsheet(id: string): Promise<void> {
    await SalesmanshipHttpClient.delete(`/api/salesmanship/callsheets/${id}`);
  }

  async getWeeklyMonitoring(kodeMinggu?: number, ouKode?: string): Promise<WeeklyMonitoringResponse> {
    const params = new URLSearchParams();
    if (kodeMinggu) params.append("kodeMinggu", String(kodeMinggu));
    if (ouKode && ouKode !== "all") params.append("ouKode", ouKode);

    const queryStr = params.toString() ? `?${params.toString()}` : "";
    const res = await SalesmanshipHttpClient.get<{ success: boolean; data: WeeklyMonitoringResponse }>(
      `/api/salesmanship/monitoring/weekly${queryStr}`
    );
    return res.data.data;
  }

  async toggleWeekLock(kodeMinggu: number, status: "AKTIF" | "NONAKTIF", catatan?: string): Promise<any> {
    const res = await SalesmanshipHttpClient.post<{ success: boolean; data: any }>(
      "/api/salesmanship/locks/toggle",
      { kodeMinggu, status, catatan }
    );
    return res.data.data;
  }
}
