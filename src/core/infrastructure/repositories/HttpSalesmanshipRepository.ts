import { WeeklyMonitoringResponse } from "../../domain/models/Monitoring";
import { ISalesmanshipRepository, DistrictFilterQuery } from '../../domain/repositories/ISalesmanshipRepository';
import { District, DistrictWriteData, SalesmanOption, OperationUnitOption } from '../../domain/models/District';
import { Channel } from '../../domain/models/Channel';
import { Target, TargetWriteData, TargetFilterQuery } from '../../domain/models/Target';
import { CallsheetFormResponse, SaveCallsheetPayload } from '../../domain/models/Callsheet';
import { Brand, BrandWriteData, BrandOrderItem, BrandFilterQuery } from '../../domain/models/Brand';
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

  async getChannels(status?: string): Promise<Channel[]> {
    const queryStr = status ? `?status=${status}` : '';
    const res = await SalesmanshipHttpClient.get<{ success: boolean; data: Channel[] }>(
      `/api/salesmanship/channels${queryStr}`
    );
    return res.data.data;
  }

  // Brand Management
  async getBrands(filter?: BrandFilterQuery): Promise<Brand[]> {
    const params = new URLSearchParams();
    if (filter?.status && filter.status !== 'all') params.append('status', filter.status);
    if (filter?.kategori && filter.kategori !== 'all') params.append('kategori', filter.kategori);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await SalesmanshipHttpClient.get<{ success: boolean; data: Brand[] }>(
      `/api/salesmanship/brands${queryStr}`
    );
    let data = res.data.data;
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      data = data.filter((b) => b.kode.toLowerCase().includes(q) || b.nama.toLowerCase().includes(q));
    }
    return data;
  }

  async saveBrand(data: BrandWriteData): Promise<Brand> {
    const res = await SalesmanshipHttpClient.post<{ success: boolean; message: string; data: Brand }>(
      '/api/salesmanship/brands',
      data
    );
    return res.data.data;
  }

  async reorderBrands(orders: BrandOrderItem[]): Promise<void> {
    await SalesmanshipHttpClient.put<{ success: boolean; message: string }>(
      '/api/salesmanship/brands/reorder',
      { orders }
    );
  }

  async deleteBrand(id: string): Promise<void> {
    await SalesmanshipHttpClient.delete(`/api/salesmanship/brands/${id}`);
  }

  // Target Management Implementation
  async getTargets(filter?: TargetFilterQuery): Promise<Target[]> {
    const params = new URLSearchParams();
    if (filter?.ouKode && filter.ouKode !== 'all') params.append('ouKode', filter.ouKode);
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

  async getWeeklyDistrictReport(
    filter: import('../../domain/models/ReportWeeklyDistrict').WeeklyDistrictReportFilterQuery
  ): Promise<import('../../domain/models/ReportWeeklyDistrict').WeeklyDistrictReportResponse> {
    const params = new URLSearchParams();
    params.append('districtId', filter.districtId);
    if (filter.kodeMinggu) params.append('kodeMinggu', String(filter.kodeMinggu));
    if (filter.kategori && filter.kategori !== 'ALL') params.append('kategori', filter.kategori);
    if (filter.statusRekap && filter.statusRekap !== 'ALL') params.append('statusRekap', filter.statusRekap);
    if (filter.ouKode && filter.ouKode !== 'all') params.append('ouKode', filter.ouKode);

    const res = await SalesmanshipHttpClient.get<{
      success: boolean;
      data: import('../../domain/models/ReportWeeklyDistrict').WeeklyDistrictReportResponse;
    }>(`/api/salesmanship/reports/weekly-district?${params.toString()}`);
    return res.data.data;
  }

  async getAvailableWeeks(
    ouKode?: string
  ): Promise<import('../../domain/models/ReportWeeklyDistrict').AvailableWeekOption[]> {
    const params = new URLSearchParams();
    if (ouKode && ouKode !== 'all') params.append('ouKode', ouKode);
    const queryStr = params.toString() ? `?${params.toString()}` : '';

    const res = await SalesmanshipHttpClient.get<{
      success: boolean;
      data: import('../../domain/models/ReportWeeklyDistrict').AvailableWeekOption[];
    }>(`/api/salesmanship/reports/available-weeks${queryStr}`);
    return res.data.data;
  }

  async getDashboard(
    filter?: import('../../domain/models/Dashboard').DashboardFilterQuery
  ): Promise<import('../../domain/models/Dashboard').DashboardDTO> {
    const params = new URLSearchParams();
    if (filter?.tahun) params.append('tahun', String(filter.tahun));
    if (filter?.kuartal) params.append('kuartal', String(filter.kuartal));
    if (filter?.kodeMinggu !== undefined && filter?.kodeMinggu !== null) params.append('kodeMinggu', String(filter.kodeMinggu));
    if (filter?.ouKode && filter.ouKode !== 'ALL') params.append('ouKode', filter.ouKode);
    const queryStr = params.toString() ? `?${params.toString()}` : '';

    const res = await SalesmanshipHttpClient.get<{
      success: boolean;
      data: import('../../domain/models/Dashboard').DashboardDTO;
    }>(`/api/salesmanship/dashboard${queryStr}`);
    return res.data.data;
  }
}

