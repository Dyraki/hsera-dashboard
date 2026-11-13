// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { KaryawanDetailDrawer } from './KaryawanDetailDrawer';
import { Karyawan } from '../../../../../core/domain/models/Karyawan';

vi.mock('@/presentation/context/AuthContext', () => ({
  useAuth: () => ({
    hasPermission: () => true,
  }),
}));

describe('KaryawanDetailDrawer Component (Option 1 - Structured Accordions)', () => {
  afterEach(() => {
    cleanup();
  });

  const mockEmployee: Karyawan = {
    id: 'emp-1',
    operationUnitId: 'unit-1',
    employeeNumber: 'EMP-001',
    nik: '3273010101900001',
    legalName: 'Budi Santoso',
    email: 'budi@test.com',
    phone: '08123456789',
    sex: 'Laki-laki',
    maritalStatus: 'Menikah',
    religion: 'Islam',
    placeOfBirth: 'Bandung',
    dateOfBirth: '1990-01-01',
    lastEducation: 'S1',
    address: 'Jl. Sukajadi No. 123',
    postalCode: '40164',
    originalDateOfHire: '2026-01-01',
    permanentDate: '2026-06-01',
    actualTerminationDate: null,
    bankId: 'b0000000-0000-4000-a000-000000000014',
    accountName: 'Budi Santoso',
    accountNumber: '1234567890',
    status: true,
    operationUnit: {
      id: 'unit-1',
      code: 'BDG',
      name: 'Cabang Bandung',
      type: 'OPERATION_UNIT',
      hierarchyPath: 'HO > JABAR > Cabang Bandung',
    },
    supervisor: {
      id: 'sup-1',
      employeeNumber: 'MGR-001',
      legalName: 'Ahmad Manager',
    },
  };

  it('renders all 4 detailed accordion sections and employee profile card', () => {
    render(
      <KaryawanDetailDrawer
        isOpen={true}
        employee={mockEmployee}
        onClose={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    // Profile Card & Details
    expect(screen.getAllByText('Budi Santoso').length).toBeGreaterThan(0);
    expect(screen.getByText(/Karyawan Aktif/i)).toBeDefined();
    expect(screen.getAllByText('HO > JABAR > Cabang Bandung').length).toBeGreaterThan(0);

    // 4 Accordions
    expect(screen.getByText('1. Identitas & Profil Pribadi')).toBeDefined();
    expect(screen.getByText('2. Kontak & Alamat Domisili')).toBeDefined();
    expect(screen.getByText('3. Penempatan & Karir Organisasi')).toBeDefined();
    expect(screen.getByText('4. Informasi Perbankan')).toBeDefined();

    // Specific detail fields
    expect(screen.getByText('Jl. Sukajadi No. 123')).toBeDefined();
    expect(screen.getByText('Ahmad Manager (MGR-001)')).toBeDefined();
    expect(screen.getByText('Nama Bank')).toBeDefined();
    expect(screen.getByText('014')).toBeDefined();
    expect(screen.getByText('Bank Central Asia')).toBeDefined();
    expect(screen.getByText('1234567890')).toBeDefined();
  });

  it('calls onEdit when clicking Edit Karyawan Ini button', () => {
    const handleEdit = vi.fn();
    render(
      <KaryawanDetailDrawer
        isOpen={true}
        employee={mockEmployee}
        onClose={vi.fn()}
        onEdit={handleEdit}
      />
    );

    const editButton = screen.getByRole('button', { name: /Edit Karyawan Ini/i });
    fireEvent.click(editButton);

    expect(handleEdit).toHaveBeenCalledWith(mockEmployee);
  });
});
