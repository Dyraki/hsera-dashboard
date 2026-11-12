// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { TargetDrawer } from './TargetDrawer';
import { TargetFormData } from '../types';

describe('TargetDrawer Component', () => {
  afterEach(() => {
    cleanup();
  });

  const mockFormData: TargetFormData = {
    jenisTarget: 'KUNJUNGAN',
    ouKode: 'BDG',
    districtId: 'dist-1',
    hariKunjungan: '',
    nilai: 30,
    berlakuDari: '2026-01-01',
    berlakuSampai: '',
    status: 'AKTIF',
  };

  const mockDistricts = [
    { id: 'dist-1', kode: 'D01', ouKode: 'BDG', karyawanName: 'Salesman A' },
    { id: 'dist-2', kode: 'D02', ouKode: 'BDG', karyawanName: 'Salesman B' },
  ];

  const mockOUs = [
    { id: 'ou-1', kode: 'BDG', nama: 'Bandung' },
  ];

  it('renders "Semua District di Unit BDG" and allows selecting it from specific district', () => {
    const handleChange = vi.fn();
    const handleSubmit = vi.fn();
    const handleClose = vi.fn();

    render(
      <TargetDrawer
        isOpen={true}
        mode="create"
        formData={mockFormData}
        formError={null}
        districts={mockDistricts as any}
        operationUnits={mockOUs as any}
        isSuperAdmin={false}
        isSubmitting={false}
        onClose={handleClose}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    );

    // Look for Cakupan Teritori District select
    const districtSelect = screen.getByLabelText('Cakupan Teritori District') as HTMLSelectElement;
    expect(districtSelect).toBeDefined();
    expect(districtSelect.value).toBe('dist-1');

    // Check options
    const optionLabels = Array.from(districtSelect.options).map((opt) => opt.text);
    expect(optionLabels).toContain('Semua District di Unit BDG');
    expect(optionLabels).not.toContain('Pilih opsi...');

    // Simulate changing to "Semua District di Unit BDG"
    fireEvent.change(districtSelect, { target: { value: '' } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        districtId: '',
      })
    );
  });

  it('displays "Semua District di Unit BDG" when formData.districtId is empty', () => {
    render(
      <TargetDrawer
        isOpen={true}
        mode="create"
        formData={{ ...mockFormData, districtId: '' }}
        formError={null}
        districts={mockDistricts as any}
        operationUnits={mockOUs as any}
        isSuperAdmin={false}
        isSubmitting={false}
        onClose={vi.fn()}
        onChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const districtSelect = screen.getByLabelText('Cakupan Teritori District') as HTMLSelectElement;
    expect(districtSelect.value).toBe('');
    expect(districtSelect.selectedOptions[0].text).toBe('Semua District di Unit BDG');
  });
});

