import { WeeklyMonitoringResponse } from "../models/Monitoring";
import { District, DistrictWriteData, SalesmanOption, OperationUnitOption } from "../models/District";
import { Target, TargetWriteData, TargetFilterQuery } from "../models/Target";
import { CallsheetFormResponse, SaveCallsheetPayload } from "../models/Callsheet";

export interface DistrictFilterQuery {
  ouKode?: string;
  status?: string;
  search?: string;
}

export interface ISalesmanshipRepository {
  getDistricts(filter?: DistrictFilterQuery): Promise<District[]>;
  getDistrictById(id: string): Promise<District>;
  createDistrict(data: DistrictWriteData): Promise<District>;
  updateDistrict(id: string, data: Partial<DistrictWriteData>): Promise<District>;
  deleteDistrict(id: string): Promise<void>;
  getSalesmen(): Promise<SalesmanOption[]>;
  getOperationUnits(): Promise<OperationUnitOption[]>;

  // Target Management
  getTargets(filter?: TargetFilterQuery): Promise<Target[]>;
  saveTarget(data: TargetWriteData): Promise<Target>;
  deleteTarget(id: string): Promise<void>;

  // Callsheet Management
  getCallsheetFormData(districtId: string, date: string): Promise<CallsheetFormResponse>;
  saveCallsheet(payload: SaveCallsheetPayload): Promise<any>;
  deleteCallsheet(id: string): Promise<void>;

  // Weekly Monitoring & Lock Audit
  getWeeklyMonitoring(kodeMinggu?: number, ouKode?: string): Promise<WeeklyMonitoringResponse>;
  toggleWeekLock(kodeMinggu: number, status: "AKTIF" | "NONAKTIF", catatan?: string): Promise<any>;
}
