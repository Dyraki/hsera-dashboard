import ExcelJS from 'exceljs';
import { Karyawan } from '@/core/domain/models/Karyawan';

export interface ExportKaryawanFilterMeta {
  unitName?: string;
  searchKeyword?: string;
  statusLabel?: string;
}

/**
 * Format string tanggal ISO menjadi YYYY-MM-DD
 */
const formatDate = (val?: string | null): string => {
  if (!val) return '-';
  try {
    return val.substring(0, 10);
  } catch {
    return val;
  }
};

/**
 * Buat workbook ExcelJS berisi data master karyawan (32 atribut HRIS)
 */
export const buildKaryawanWorkbook = (
  karyawans: Karyawan[],
  meta?: ExportKaryawanFilterMeta
): ExcelJS.Workbook => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'HSERA HRIS Platform';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Data Karyawan', {
    views: [{ state: 'frozen', ySplit: 8 }], // Freeze baris metadata + header kolom
    properties: { defaultRowHeight: 20 },
  });

  const now = new Date();
  const timestampStr =
    now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }) +
    ' ' +
    now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  // 1. Title & Metadata
  worksheet.addRow(['DATA MASTER KARYAWAN (SDM) - HSERA HRIS']);
  worksheet.addRow(['Waktu Ekspor:', timestampStr]);
  worksheet.addRow(['Unit Penempatan:', meta?.unitName || 'Semua Unit Kerja']);
  worksheet.addRow(['Status Karyawan:', meta?.statusLabel || 'Semua']);
  worksheet.addRow(['Kata Kunci Pencarian:', meta?.searchKeyword || '-']);
  worksheet.addRow(['Total Data:', `${karyawans.length} Karyawan`]);
  worksheet.addRow([]); // Blank line

  // Styling Title Row (Row 1)
  const titleRow = worksheet.getRow(1);
  titleRow.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF1E3A8A' } };
  worksheet.mergeCells('A1:H1');

  // Styling Metadata Labels (Rows 2-6)
  for (let r = 2; r <= 6; r++) {
    const row = worksheet.getRow(r);
    row.getCell(1).font = { bold: true, color: { argb: 'FF4B5563' } };
    row.getCell(2).font = { bold: false, color: { argb: 'FF111827' } };
  }

  // 2. Header Kolom (Row 8)
  const headers = [
    'No',
    'Nomor Karyawan (NIP)',
    'NIK (Nomor KTP)',
    'Nama Lengkap (KTP)',
    'Jenis Kelamin',
    'Status Pernikahan',
    'Agama',
    'Pendidikan Terakhir',
    'Tempat Lahir',
    'Tanggal Lahir',
    'Email Karyawan',
    'Nomor Telepon / WA',
    'Alamat Domisili KTP',
    'Kode Pos',
    'Kode Unit Kerja',
    'Nama Unit Kerja',
    'Tipe Unit Organisasi',
    'Hierarki Penempatan',
    'NIP Atasan Langsung',
    'Nama Atasan Langsung',
    'Tanggal Mulai Masuk',
    'Tanggal Karyawan Tetap',
    'Tanggal Berhenti (Resign)',
    'Nama Pemilik Rekening',
    'Nomor Rekening Bank',
    'Status Karyawan',
    'Username Akun Login',
    'Status Akun Login',
  ];

  const headerRow = worksheet.addRow(headers);
  headerRow.height = 26;

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E40AF' }, // Navy blue corporate
    };
    cell.font = {
      name: 'Calibri',
      size: 11,
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: false,
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF93C5FD' } },
      left: { style: 'thin', color: { argb: 'FF93C5FD' } },
      bottom: { style: 'medium', color: { argb: 'FF1D4ED8' } },
      right: { style: 'thin', color: { argb: 'FF93C5FD' } },
    };
  });

  // 3. Data Rows
  karyawans.forEach((emp, index) => {
    const rowValues = [
      index + 1,
      emp.employeeNumber || '-',
      emp.nik || '-',
      emp.legalName || '-',
      emp.sex || '-',
      emp.maritalStatus || '-',
      emp.religion || '-',
      emp.lastEducation || '-',
      emp.placeOfBirth || '-',
      formatDate(emp.dateOfBirth),
      emp.email || '-',
      emp.phone || '-',
      emp.address || '-',
      emp.postalCode || '-',
      emp.operationUnit?.code || '-',
      emp.operationUnit?.name || '-',
      emp.operationUnit?.type || '-',
      emp.operationUnit?.hierarchyPath || emp.operationUnit?.name || '-',
      emp.supervisor?.employeeNumber || '-',
      emp.supervisor ? emp.supervisor.legalName : 'Pimpinan Tertinggi',
      formatDate(emp.originalDateOfHire),
      formatDate(emp.permanentDate),
      formatDate(emp.actualTerminationDate),
      emp.accountName || '-',
      emp.accountNumber || '-',
      emp.status ? 'AKTIF' : 'NONAKTIF',
      emp.userAccount?.username || 'Belum Ada Akun',
      emp.userAccount ? (emp.userAccount.aktif ? 'Akun Aktif' : 'Akun Nonaktif') : '-',
    ];

    const dataRow = worksheet.addRow(rowValues);
    const isEven = index % 2 === 0;

    dataRow.eachCell((cell, colNumber) => {
      // Cell background zebra-striping
      if (!isEven) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF9FAFB' },
        };
      }

      // Font
      cell.font = { name: 'Calibri', size: 10 };

      // Border halus
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };

      // Alignment & Format Teks Khusus (NIK, NIP, Phone, Rekening)
      // Kolom: 1 = No, 2 = NIP, 3 = NIK, 12 = Phone, 14 = PostalCode, 25 = Rekening
      if (colNumber === 1) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if ([2, 3, 12, 14, 25].includes(colNumber)) {
        // Format teks murni agar 0 tidak hilang
        cell.numFmt = '@';
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      } else if (colNumber === 26) {
        // Status Karyawan
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        if (emp.status) {
          cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF047857' } }; // Green
        } else {
          cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFB91C1C' } }; // Red
        }
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
    });
  });

  // 4. Auto Column Widths
  worksheet.columns.forEach((column, i) => {
    let maxLength = headers[i] ? headers[i].length : 12;

    karyawans.forEach((emp) => {
      let cellValue = '';
      switch (i) {
        case 0: cellValue = String(karyawans.length); break;
        case 1: cellValue = emp.employeeNumber || ''; break;
        case 2: cellValue = emp.nik || ''; break;
        case 3: cellValue = emp.legalName || ''; break;
        case 10: cellValue = emp.email || ''; break;
        case 11: cellValue = emp.phone || ''; break;
        case 12: cellValue = emp.address || ''; break;
        case 15: cellValue = emp.operationUnit?.name || ''; break;
        case 17: cellValue = emp.operationUnit?.hierarchyPath || ''; break;
        case 19: cellValue = emp.supervisor?.legalName || ''; break;
        default: break;
      }
      if (cellValue.length > maxLength) {
        maxLength = cellValue.length;
      }
    });

    column.width = Math.min(45, Math.max(maxLength + 4, 12));
  });

  return workbook;
};

/**
 * Export data karyawan langsung ke file native Excel (.xlsx) dan trigger download di browser
 */
export const exportKaryawanToExcel = async (
  karyawans: Karyawan[],
  meta?: ExportKaryawanFilterMeta
): Promise<void> => {
  const workbook = buildKaryawanWorkbook(karyawans, meta);
  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const now = new Date();
  const dateSlug = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeSlug =
    String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');

  link.href = url;
  link.setAttribute('download', `Data_Karyawan_${dateSlug}_${timeSlug}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
