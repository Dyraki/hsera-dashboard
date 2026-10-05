import { OperationUnit, OperationUnitWriteData } from '../../domain/models/OperationUnit';
import { OperationUnitDto, OperationUnitWriteDto } from '../dto/OperationUnitDto';

export const toOperationUnit = (dto: OperationUnitDto): OperationUnit => ({
  id: dto.id,
  parentId: dto.parentId,
  code: dto.code,
  name: dto.name,
  type: dto.type,
  category: dto.category,
  distributionPoint: dto.distributionPoint,
  address: dto.address,
  phone: dto.phone,
  latitude: dto.latitude,
  longitude: dto.longitude,
  buildingStatus: dto.buildingStatus,
  leaseCategory: dto.leaseCategory,
  leaseStartDate: dto.leaseStartDate,
  leaseEndDate: dto.leaseEndDate,
  annualRent: dto.annualRent,
  legalDocumentType: dto.legalDocumentType,
  legalDocumentNumber: dto.legalDocumentNumber,
  status: dto.status,
  parentName: dto.parentName,
  parentCode: dto.parentCode,
  children: dto.children?.map(toOperationUnit),
  lineage: dto.lineage ? {
    headOffice: dto.lineage.headOffice ? { ...dto.lineage.headOffice } : dto.lineage.headOffice,
    regional: dto.lineage.regional ? { ...dto.lineage.regional } : dto.lineage.regional,
    areaOffice: dto.lineage.areaOffice ? { ...dto.lineage.areaOffice } : dto.lineage.areaOffice,
    breadcrumb: dto.lineage.breadcrumb
  } : undefined
});

export const toOperationUnitWriteDto = (data: OperationUnitWriteData): OperationUnitWriteDto => ({
  parentId: data.parentId,
  code: data.code,
  name: data.name,
  type: data.type,
  category: data.category,
  distributionPoint: data.distributionPoint,
  address: data.address,
  phone: data.phone,
  latitude: data.latitude,
  longitude: data.longitude,
  buildingStatus: data.buildingStatus,
  leaseCategory: data.leaseCategory,
  leaseStartDate: data.leaseStartDate,
  leaseEndDate: data.leaseEndDate,
  annualRent: data.annualRent,
  legalDocumentType: data.legalDocumentType,
  legalDocumentNumber: data.legalDocumentNumber,
  status: data.status
});
