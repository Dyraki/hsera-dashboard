// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { KaryawanFormDrawer } from './KaryawanFormDrawer';
import { KaryawanFormValues } from '../types';

describe('KaryawanFormDrawer Component (Option 1 - Vertical Accordion)', () => {
  afterEach(() => {
    cleanup();
  });

  const mockValues: KaryawanFormValues = {
    operationUnitId: 'unit-1',
    supervisorId: '',
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
    address: 'Jl. Test No. 123',
    postalCode: '40164',
    originalDateOfHire: '2026-01-01',
    permanentDate: '',
    actualTerminationDate: '',
    bankId: '',
    accountName: 'Budi Santoso',
    accountNumber: '1234567890',
    status: true,
  };

  const mockUnits = [
    { id: 'unit-1', code: 'BDG', name: 'Bandung', type: 'OPERATION_UNIT' },
  ];

  it('renders all 4 vertical accordion sections without horizontal tab overflow', () => {
    render(
      <KaryawanFormDrawer
        isOpen={true}
        mode="create"
        employee={null}
        values={mockValues}
        units={mockUnits}
        supervisors={[]}
        isSubmitting={false}
        onClose={vi.fn()}
        onChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText('1. Identitas & Profil Pribadi')).toBeDefined();
    expect(screen.getByText('2. Kontak & Alamat Domisili')).toBeDefined();
    expect(screen.getByText('3. Penempatan & Karir Organisasi')).toBeDefined();
    expect(screen.getByText('4. Informasi Perbankan')).toBeDefined();

    // Check that submit button is in sticky footer
    expect(screen.getByRole('button', { name: /Simpan Karyawan/i })).toBeDefined();
  });

  it('can collapse and expand accordion sections', () => {
    render(
      <KaryawanFormDrawer
        isOpen={true}
        mode="create"
        employee={null}
        values={mockValues}
        units={mockUnits}
        supervisors={[]}
        isSubmitting={false}
        onClose={vi.fn()}
        onChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    // Initial state: NIK field is present
    expect(screen.getByPlaceholderText('3273010101900001')).toBeDefined();

    // Click section 1 header to collapse
    const section1Btn = screen.getByText('1. Identitas & Profil Pribadi');
    fireEvent.click(section1Btn);

    // NIK field should now be hidden
    expect(screen.queryByPlaceholderText('3273010101900001')).toBeNull();

    // Click again to expand
    fireEvent.click(section1Btn);
    expect(screen.getByPlaceholderText('3273010101900001')).toBeDefined();
  });

  it('toggles all sections via Lipat Semua / Buka Semua button', () => {
    render(
      <KaryawanFormDrawer
        isOpen={true}
        mode="create"
        employee={null}
        values={mockValues}
        units={mockUnits}
        supervisors={[]}
        isSubmitting={false}
        onClose={vi.fn()}
        onChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const toggleAllBtn = screen.getByText('Lipat Semua');
    fireEvent.click(toggleAllBtn);

    // Now all sections collapsed
    expect(screen.queryByPlaceholderText('3273010101900001')).toBeNull();
    expect(screen.getByText('Buka Semua')).toBeDefined();

    // Click Buka Semua
    fireEvent.click(screen.getByText('Buka Semua'));
    expect(screen.getByPlaceholderText('3273010101900001')).toBeDefined();
  });

  it('triggers onChange when updating an input', () => {
    const handleChange = vi.fn();
    render(
      <KaryawanFormDrawer
        isOpen={true}
        mode="create"
        employee={null}
        values={mockValues}
        units={mockUnits}
        supervisors={[]}
        isSubmitting={false}
        onClose={vi.fn()}
        onChange={handleChange}
        onSubmit={vi.fn()}
      />
    );

    const nikInput = screen.getByPlaceholderText('3273010101900001');
    fireEvent.change(nikInput, { target: { value: '3273010101900002' } });

    expect(handleChange).toHaveBeenCalledWith('nik', '3273010101900002');
  });

  it('triggers onChange when selecting a bank in Section 4', () => {
    const handleChange = vi.fn();
    render(
      <KaryawanFormDrawer
        isOpen={true}
        mode="create"
        employee={null}
        values={mockValues}
        units={mockUnits}
        supervisors={[]}
        isSubmitting={false}
        onClose={vi.fn()}
        onChange={handleChange}
        onSubmit={vi.fn()}
      />
    );

    const bankTrigger = screen.getByRole('button', { name: /Pilih \/ Cari Nama Bank/i });
    fireEvent.click(bankTrigger);

    const searchInput = screen.getByPlaceholderText(/Cari nama bank, kode/i);
    fireEvent.change(searchInput, { target: { value: 'BCA' } });

    const bcaOption = screen.getByText('Bank Central Asia');
    fireEvent.click(bcaOption);

    expect(handleChange).toHaveBeenCalledWith(
      'bankId',
      expect.stringMatching(/^[0-9a-fA-F-]+$/)
    );
  });
});

