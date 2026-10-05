import { describe, expect, it } from 'vitest';
import { OperationUnitDto } from '../dto/OperationUnitDto';
import { toOperationUnit, toOperationUnitWriteDto } from './OperationUnitMapper';

describe('OperationUnitMapper', () => {
  it('maps nested tree DTOs to domain units recursively', () => {
    const dto: OperationUnitDto = {
      id: 'root',
      parentId: null,
      code: 'HO',
      name: 'Head Office',
      type: 'HEAD_OFFICE',
      status: true,
      children: [{
        id: 'branch',
        parentId: 'root',
        code: 'BR-01',
        name: 'Branch',
        type: 'OPERATION_UNIT',
        status: true
      }],
      lineage: { breadcrumb: 'Head Office' }
    };

    const result = toOperationUnit(dto);

    expect(result.id).toBe('root');
    expect(result.children?.[0].parentId).toBe('root');
    expect(result.children?.[0].name).toBe('Branch');
    expect(result.lineage?.breadcrumb).toBe('Head Office');
  });

  it('maps only API write fields from the domain value', () => {
    const result = toOperationUnitWriteDto({
      parentId: null,
      code: 'HO',
      name: 'Head Office',
      type: 'HEAD_OFFICE',
      category: null,
      distributionPoint: null,
      address: null,
      phone: null,
      latitude: null,
      longitude: null,
      buildingStatus: null,
      leaseCategory: null,
      leaseStartDate: null,
      leaseEndDate: null,
      annualRent: null,
      legalDocumentType: null,
      legalDocumentNumber: null,
      status: true
    });

    expect(result).toEqual({
      parentId: null,
      code: 'HO',
      name: 'Head Office',
      type: 'HEAD_OFFICE',
      category: null,
      distributionPoint: null,
      address: null,
      phone: null,
      latitude: null,
      longitude: null,
      buildingStatus: null,
      leaseCategory: null,
      leaseStartDate: null,
      leaseEndDate: null,
      annualRent: null,
      legalDocumentType: null,
      legalDocumentNumber: null,
      status: true
    });
  });
});
