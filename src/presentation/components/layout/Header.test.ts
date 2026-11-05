import { describe, it, expect } from 'vitest';
import { getRoleManagementDisplay } from './Header';
import { User } from '@/core/domain/models/User';

describe('Header getRoleManagementDisplay tests', () => {
  it('should return empty string for null user', () => {
    expect(getRoleManagementDisplay(null)).toBe('');
  });

  it('should format roleName directly from Role Management', () => {
    const user: User = {
      id: 'u1',
      username: 'agoesm',
      jenis: 'pegawai',
      roleName: 'AREA MANAGER',
    };
    expect(getRoleManagementDisplay(user)).toBe('Area Manager');
  });

  it('should format Regional Manager role', () => {
    const user: User = {
      id: 'u2',
      username: 'budi',
      jenis: 'pegawai',
      roleName: 'REGIONAL MANAGER',
    };
    expect(getRoleManagementDisplay(user)).toBe('Regional Manager');
  });

  it('should format Supervisor role', () => {
    const user: User = {
      id: 'u3',
      username: 'dennyp',
      jenis: 'pegawai',
      roleName: 'SUPERVISOR',
    };
    expect(getRoleManagementDisplay(user)).toBe('Supervisor');
  });

  it('should pick active role from roles array if roleName is empty', () => {
    const user: User = {
      id: 'u4',
      username: 'adys',
      jenis: 'pegawai',
      roles: [
        { id: 'r1', nama: 'OLD ROLE', aktif: 0 },
        { id: 'r2', nama: 'SUPERVISOR', aktif: 1 },
      ],
    };
    expect(getRoleManagementDisplay(user)).toBe('Supervisor');
  });

  it('should fallback to Super Admin if user is SA or admin', () => {
    const user1: User = {
      id: 'u5',
      username: 'admin',
      jenis: 'SA',
    };
    expect(getRoleManagementDisplay(user1)).toBe('Super Admin');

    const user2: User = {
      id: 'u6',
      username: 'root',
      jenis: 'pegawai',
      scope: {
        isSuperAdmin: true,
        allowedUnitIds: [],
      },
    };
    expect(getRoleManagementDisplay(user2)).toBe('Super Admin');
  });

  it('should fallback to Area Manager when unitType is AREA_OFFICE', () => {
    const user: User = {
      id: 'u7',
      username: 'manager_area',
      jenis: 'pegawai',
      scope: {
        isSuperAdmin: false,
        unitType: 'AREA_OFFICE',
        allowedUnitIds: ['ou-1'],
      },
    };
    expect(getRoleManagementDisplay(user)).toBe('Area Manager');
  });

  it('should fallback to Supervisor when unitType is OPERATION_UNIT', () => {
    const user: User = {
      id: 'u8',
      username: 'spv_cabang',
      jenis: 'pegawai',
      karyawan: {
        id: 'k1',
        employeeNumber: 'EMP001',
        nik: '123456',
        legalName: 'Denny P',
        operationUnitId: 'ou-cabang',
        unitType: 'OPERATION_UNIT',
      },
    };
    expect(getRoleManagementDisplay(user)).toBe('Supervisor');
  });
});
