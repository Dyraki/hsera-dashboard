// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildKaryawanWorkbook, exportKaryawanToExcel } from './exportKaryawanExcel';
import { Karyawan } from '@/core/domain/models/Karyawan';

describe('exportKaryawanExcel with ExcelJS (.xlsx)', () => {
  const sampleKaryawans: Karyawan[] = [
    {
      id: 'k-1',
      employeeNumber: 'EMP-001',
      nik: '0812345678901234',
      legalName: 'Budi Santoso',
      sex: 'Laki-laki',
      maritalStatus: 'Menikah',
      religion: 'Islam',
      lastEducation: 'S1',
      placeOfBirth: 'Bandung',
      dateOfBirth: '1990-05-15T00:00:00Z',
      email: 'budi@hsera.com',
      phone: '08123456789',
      address: 'Jl. Merdeka No. 10',
      postalCode: '40111',
      operationUnitId: 'ou-1',
      operationUnit: {
        id: 'ou-1',
        code: 'CAB-TGK',
        name: 'Cabang Tenggarong',
        type: 'OPERATION_UNIT',
        hierarchyPath: 'RO-SMR > CAB-TGK',
      },
      supervisorId: 'sup-1',
      supervisor: {
        id: 'sup-1',
        employeeNumber: 'MGR-001',
        legalName: 'Hendro Wijaya',
      },
      originalDateOfHire: '2020-01-01T00:00:00Z',
      permanentDate: '2021-01-01T00:00:00Z',
      actualTerminationDate: null,
      accountName: 'Budi Santoso',
      accountNumber: '0123456789',
      status: true,
      userAccount: {
        id: 'u-1',
        username: 'budi.santoso',
        aktif: 1,
      },
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('buildKaryawanWorkbook', () => {
    it('should create separate columns and format headers properly', () => {
      const workbook = buildKaryawanWorkbook(sampleKaryawans, {
        unitName: '[CAB-TGK] Cabang Tenggarong',
        statusLabel: 'Aktif',
        searchKeyword: 'Budi',
      });

      const worksheet = workbook.getWorksheet('Data Karyawan');
      expect(worksheet).toBeDefined();

      // Row 8 is header row
      const headerRow = worksheet?.getRow(8);
      expect(headerRow?.getCell(1).value).toBe('No');
      expect(headerRow?.getCell(2).value).toBe('Nomor Karyawan (NIP)');
      expect(headerRow?.getCell(3).value).toBe('NIK (Nomor KTP)');
      expect(headerRow?.getCell(4).value).toBe('Nama Lengkap (KTP)');

      // Row 9 is first employee row
      const dataRow = worksheet?.getRow(9);
      expect(dataRow?.getCell(1).value).toBe(1);
      expect(dataRow?.getCell(2).value).toBe('EMP-001');
      expect(dataRow?.getCell(3).value).toBe('0812345678901234');
      // Number format should be '@' (text)
      expect(dataRow?.getCell(3).numFmt).toBe('@');
      expect(dataRow?.getCell(4).value).toBe('Budi Santoso');
      expect(dataRow?.getCell(26).value).toBe('AKTIF');
    });
  });

  describe('exportKaryawanToExcel', () => {
    it('should write buffer, create Blob with xlsx MIME type, and trigger download', async () => {
      const appendSpy = vi.spyOn(document.body, 'appendChild');
      const removeSpy = vi.spyOn(document.body, 'removeChild');

      window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      window.URL.revokeObjectURL = vi.fn();

      await exportKaryawanToExcel(sampleKaryawans, {
        unitName: 'Cabang Tenggarong',
        statusLabel: 'Semua',
      });

      expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
      expect(appendSpy).toHaveBeenCalled();
      expect(removeSpy).toHaveBeenCalled();
      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
  });
});
