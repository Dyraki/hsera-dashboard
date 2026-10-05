export type OperationUnitType = 'HEAD_OFFICE' | 'REGIONAL' | 'AREA_OFFICE' | 'OPERATION_UNIT';

export interface OperationUnitLineageEntry {
  id: string;
  code: string;
  name: string;
}

export interface OperationUnitLineage {
  headOffice?: OperationUnitLineageEntry | null;
  regional?: OperationUnitLineageEntry | null;
  areaOffice?: OperationUnitLineageEntry | null;
  breadcrumb: string;
}

export interface OperationUnit {
  id: string;
  parentId: string | null;
  code: string;
  name: string;
  type: string;
  category?: string | null;
  distributionPoint?: string | null;
  address?: string | null;
  phone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  buildingStatus?: string | null;
  leaseCategory?: string | null;
  leaseStartDate?: string | null;
  leaseEndDate?: string | null;
  annualRent?: number | null;
  legalDocumentType?: string | null;
  legalDocumentNumber?: string | null;
  status: boolean;
  parentName?: string | null;
  parentCode?: string | null;
  children?: OperationUnit[];
  lineage?: OperationUnitLineage;
}

export interface OperationUnitWriteData {
  parentId: string | null;
  code: string;
  name: string;
  type: string;
  category: string | null;
  distributionPoint: string | null;
  address: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  buildingStatus: string | null;
  leaseCategory: string | null;
  leaseStartDate: string | null;
  leaseEndDate: string | null;
  annualRent: number | null;
  legalDocumentType: string | null;
  legalDocumentNumber: string | null;
  status: boolean;
}
