import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpProfileRepository } from '../../../../core/infrastructure/repositories/HttpProfileRepository';
import { AxiosHttpClient } from '../../../../core/infrastructure/api/AxiosHttpClient';
import { SYSTEM_MENU_IDS } from '../../../../core/constants/MenuConstants';
import { routePaths } from '../../../../routes/routePaths';

vi.mock('../../../../core/infrastructure/api/AxiosHttpClient', () => ({
  AxiosHttpClient: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe('Profile Module Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('harus memiliki Menu ID dan Route Path yang sesuai dengan spesifikasi', () => {
    expect(SYSTEM_MENU_IDS.PROFILE).toBe('8db77fdb-cd46-467e-a3ab-63b7a9472f78');
    expect(routePaths.profile).toBe('/settings/profile');
  });

  it('HttpProfileRepository.getProfile harus mengembalikan data profil lengkap', async () => {
    const mockProfileData = {
      user: {
        id: 'usr-1',
        username: 'fauzi',
        jenis: 'pegawai',
        aktif: 1,
        tgl1: '2021-01-01',
        tgl2: '2035-12-31',
        roleName: 'SALESMAN',
        roles: [{ id: 'role-1', nama: 'SALESMAN', aktif: 1 }],
      },
      karyawan: {
        id: 'karyawan-1',
        employeeNumber: 'EMP-001',
        nik: '3201019000010001',
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
        bankId: 'BCA',
        accountName: 'Ahmad Fauzi',
        accountNumber: '8270192819',
        status: true,
        operationUnit: {
          id: 'unit-1',
          code: 'CAB-TGK',
          name: 'Cabang Tagog',
          type: 'OPERATION_UNIT',
          breadcrumb: 'HO > REGIONAL 2 > CAB-TGK',
        },
        supervisor: {
          id: 'sup-1',
          employeeNumber: 'EMP-0001',
          legalName: 'Budi Santoso',
        },
      },
    };

    (AxiosHttpClient.get as any).mockResolvedValue({ data: mockProfileData });

    const repo = new HttpProfileRepository();
    const result = await repo.getProfile();

    expect(AxiosHttpClient.get).toHaveBeenCalledWith('/api/auth/profile');
    expect(result.user.username).toBe('fauzi');
    expect(result.karyawan?.employeeNumber).toBe('EMP-001');
    expect(result.karyawan?.operationUnit?.code).toBe('CAB-TGK');
  });

  it('HttpProfileRepository.updateContact harus mengirim payload pembaruan kontak', async () => {
    (AxiosHttpClient.put as any).mockResolvedValue({
      data: { message: 'Data kontak profil berhasil diperbarui.' },
    });

    const repo = new HttpProfileRepository();
    const result = await repo.updateContact({
      email: 'fauzi.baru@hsera.co.id',
      phone: '081298765432',
      address: 'Jl. Riau No. 45',
      postalCode: '40115',
    });

    expect(AxiosHttpClient.put).toHaveBeenCalledWith('/api/auth/profile', {
      email: 'fauzi.baru@hsera.co.id',
      phone: '081298765432',
      address: 'Jl. Riau No. 45',
      postalCode: '40115',
    });
    expect(result.message).toContain('berhasil');
  });
});
