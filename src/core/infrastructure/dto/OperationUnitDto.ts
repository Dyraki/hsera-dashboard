export interface OperationUnitDto {
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
  children?: OperationUnitDto[];
  lineage?: {
    headOffice?: { id: string; code: string; name: string } | null;
    regional?: { id: string; code: string; name: string } | null;
    areaOffice?: { id: string; code: string; name: string } | null;
    breadcrumb: string;
  };
}

export interface OperationUnitWriteDto {
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
