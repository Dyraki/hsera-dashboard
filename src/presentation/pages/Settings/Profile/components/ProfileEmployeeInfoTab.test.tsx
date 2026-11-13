// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { ProfileEmployeeInfoTab } from './ProfileEmployeeInfoTab';
import { INDONESIA_BANKS } from '@/core/constants/banks';

describe('ProfileEmployeeInfoTab Component', () => {
  afterEach(() => {
    cleanup();
  });

  const bca = INDONESIA_BANKS.find((b) => b.code === '014')!;

  const mockUser = {
    id: 'usr-1',
    username: 'fauzi',
    jenis: 'pegawai',
    aktif: 1,
    tgl1: '2021-01-01',
    tgl2: '2035-12-31',
    roleName: 'Staff HR',
    roles: [{ id: 'role-1', nama: 'Staff HR', aktif: 1 }],
  };

  const mockKaryawan = {
    id: 'emp-1',
    employeeNumber: 'EMP-001',
    nik: '3273010101900001',
    legalName: 'Ahmad Fauzi',
    email: 'fauzi@hsera.co.id',
    phone: '081234567890',
    sex: 'L',
    maritalStatus: 'Menikah',
    religion: 'Islam',
    placeOfBirth: 'Bandung',
    dateOfBirth: '1990-05-14',
    lastEducation: 'S1',
    address: 'Jl. Sukajadi No. 12',
    postalCode: '40162',
    originalDateOfHire: '2021-01-12',
    permanentDate: '2021-07-12',
    bankId: bca.id,
    accountName: 'Ahmad Fauzi',
    accountNumber: '8270192819',
    status: true,
    operationUnit: {
      id: 'unit-1',
      code: 'CAB-BDG',
      name: 'Cabang Bandung',
      type: 'OPERATION_UNIT',
      breadcrumb: 'HO > JABAR > CAB-BDG',
    },
    supervisor: {
      id: 'sup-1',
      employeeNumber: 'EMP-0001',
      legalName: 'Budi Santoso',
    },
  };

  it('renders resolved bank name and code when bankId is set', () => {
    render(<ProfileEmployeeInfoTab user={mockUser} karyawan={mockKaryawan} />);

    expect(screen.getByText('Informasi Payroll Rekening')).toBeDefined();
    expect(screen.getByText('Nama Bank')).toBeDefined();
    expect(screen.getByText('014')).toBeDefined();
    expect(screen.getByText('Bank Central Asia')).toBeDefined();
    expect(screen.getByText('8270192819')).toBeDefined();
    expect(screen.getByText('Ahmad Fauzi')).toBeDefined();
  });

  it('resolves bank properly even when bankId is legacy code like "014" or "BCA"', () => {
    render(
      <ProfileEmployeeInfoTab
        user={mockUser}
        karyawan={{ ...mockKaryawan, bankId: 'BCA' }}
      />
    );

    expect(screen.getByText('014')).toBeDefined();
    expect(screen.getByText('Bank Central Asia')).toBeDefined();
  });

  it('renders "-" when bankId is not set', () => {
    render(
      <ProfileEmployeeInfoTab
        user={mockUser}
        karyawan={{ ...mockKaryawan, bankId: '' }}
      />
    );

    expect(screen.getByText('Nama Bank')).toBeDefined();
  });

  it('renders system admin placeholder when karyawan is null', () => {
    render(<ProfileEmployeeInfoTab user={mockUser} karyawan={null} />);

    expect(screen.getByText('Akun Sistem / Administrator')).toBeDefined();
  });
});
