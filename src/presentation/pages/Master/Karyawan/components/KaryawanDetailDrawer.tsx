import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  CreditCard,
  MapPin,
  Users,
  ChevronDown,
  Pencil,
  ChevronsUpDown,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { SlideOver } from '@/presentation/components/ui/SlideOver';
import { Button } from '@/presentation/components/ui/Button';
import { PermissionButton } from '@/presentation/components/ui/PermissionButton';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { Badge } from '@/presentation/components/ui/Badge';
import { findBankByIdOrCode } from '@/core/constants/banks';
import { Karyawan } from '../../../../../core/domain/models/Karyawan';

export interface KaryawanDetailDrawerProps {
  isOpen: boolean;
  employee: Karyawan | null;
  onClose: () => void;
  onEdit: (employee: Karyawan) => void;
}

type SectionKey = 'identitas' | 'kontak' | 'penempatan' | 'bank';

const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return '-';
  try {
    const raw = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const parts = raw.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
      ];
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${day} ${months[monthIndex]} ${year}`;
      }
    }
    return raw;
  } catch {
    return dateStr;
  }
};

const DetailRow: React.FC<{
  label: string;
  value?: React.ReactNode;
  isMono?: boolean;
}> = ({ label, value, isMono }) => (
  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between py-2 border-b border-gray-100 last:border-b-0 gap-1 text-body-sm">
    <dt className="text-gray-500 font-normal shrink-0">{label}</dt>
    <dd
      className={`text-gray-900 font-medium sm:text-right break-words ${
        isMono ? 'font-mono' : ''
      }`}
    >
      {value || '-'}
    </dd>
  </div>
);

export const KaryawanDetailDrawer: React.FC<KaryawanDetailDrawerProps> = ({
  isOpen,
  employee,
  onClose,
  onEdit,
}) => {
  // Semua section terbuka secara default di mode detail agar data langsung terbaca
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    identitas: true,
    kontak: true,
    penempatan: true,
    bank: true,
  });

  const toggleSection = (key: SectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const areAllExpanded = Object.values(expandedSections).every(Boolean);

  const toggleAll = () => {
    const nextState = !areAllExpanded;
    setExpandedSections({
      identitas: nextState,
      kontak: nextState,
      penempatan: nextState,
      bank: nextState,
    });
  };

  if (!employee) return null;

  const initials = (employee.legalName || 'K')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title={employee.legalName}
      subtitle={`${employee.employeeNumber} • NIK: ${employee.nik}`}
      icon={<Users size={20} className="text-primary-600" />}
      width="max-w-xl"
      footer={
        <>
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Tutup
          </Button>
          <PermissionButton
            menuId={SYSTEM_MENU_IDS.KARYAWAN}
            minLevel={3}
            variant="primary"
            size="md"
            onClick={() => onEdit(employee)}
          >
            <Pencil size={15} className="mr-1.5" />
            Edit Karyawan Ini
          </PermissionButton>
        </>
      }
    >
      <div className="space-y-4">
        {/* Profile Hero Card */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3.5">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-full bg-gradient-to-br from-primary-600 to-red-700 flex items-center justify-center text-white font-extrabold text-base uppercase shadow-2xs shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-950 text-base leading-tight truncate">
                {employee.legalName}
              </h3>
              <p className="text-caption text-primary-700 font-mono font-medium mt-0.5">
                {employee.employeeNumber} • NIK: {employee.nik}
              </p>
              <div className="mt-1.5">
                {employee.status ? (
                  <Badge variant="success">Karyawan Aktif</Badge>
                ) : (
                  <Badge variant="neutral">Nonaktif</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-gray-200 text-body-sm space-y-1">
            <span className="text-[11px] font-semibold text-primary-700 uppercase tracking-wider block">
              Unit Penempatan (Homebase)
            </span>
            <p className="text-gray-900 font-medium">
              {employee.operationUnit?.hierarchyPath ||
                employee.operationUnit?.name ||
                '-'}
            </p>
          </div>
        </div>

        {/* Toolbar Accordion: Buka / Lipat Semua */}
        <div className="flex items-center justify-between px-1 text-caption text-gray-500">
          <span className="font-medium text-gray-600">
            Detail Lengkap (32 Kolom HRIS)
          </span>
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium transition-colors hover:underline cursor-pointer"
          >
            <ChevronsUpDown size={14} />
            {areAllExpanded ? 'Lipat Semua' : 'Buka Semua'}
          </button>
        </div>

        {/* SECTION 1: IDENTITAS & PRIBADI */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs transition-all">
          <button
            type="button"
            onClick={() => toggleSection('identitas')}
            className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors cursor-pointer ${
              expandedSections.identitas
                ? 'bg-primary-50/40 border-b border-primary-100'
                : 'bg-gray-50/80 hover:bg-gray-100/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  expandedSections.identitas
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-200/80 text-gray-700'
                }`}
              >
                <Briefcase size={16} />
              </div>
              <span className="font-semibold text-body-sm text-gray-900">
                1. Identitas & Profil Pribadi
              </span>
            </div>
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform duration-200 ${
                expandedSections.identitas ? 'rotate-180 text-primary-600' : ''
              }`}
            />
          </button>

          {expandedSections.identitas && (
            <div className="p-4 space-y-1 bg-white animate-fadeIn">
              <dl>
                <DetailRow label="NIK (Nomor KTP)" value={employee.nik} isMono />
                <DetailRow label="Nomor Karyawan (NIP)" value={employee.employeeNumber} isMono />
                <DetailRow label="Nama Lengkap KTP" value={employee.legalName} />
                <DetailRow label="Jenis Kelamin" value={employee.sex} />
                <DetailRow label="Status Pernikahan" value={employee.maritalStatus} />
                <DetailRow label="Agama" value={employee.religion} />
                <DetailRow label="Pendidikan Terakhir" value={employee.lastEducation} />
                <DetailRow
                  label="Tempat, Tanggal Lahir"
                  value={
                    employee.placeOfBirth || employee.dateOfBirth
                      ? `${employee.placeOfBirth || '-'}, ${formatDate(employee.dateOfBirth)}`
                      : '-'
                  }
                />
              </dl>
            </div>
          )}
        </div>

        {/* SECTION 2: KONTAK & ALAMAT DOMISILI */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs transition-all">
          <button
            type="button"
            onClick={() => toggleSection('kontak')}
            className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors cursor-pointer ${
              expandedSections.kontak
                ? 'bg-primary-50/40 border-b border-primary-100'
                : 'bg-gray-50/80 hover:bg-gray-100/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  expandedSections.kontak
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-200/80 text-gray-700'
                }`}
              >
                <MapPin size={16} />
              </div>
              <span className="font-semibold text-body-sm text-gray-900">
                2. Kontak & Alamat Domisili
              </span>
            </div>
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform duration-200 ${
                expandedSections.kontak ? 'rotate-180 text-primary-600' : ''
              }`}
            />
          </button>

          {expandedSections.kontak && (
            <div className="p-4 space-y-1 bg-white animate-fadeIn">
              <dl>
                <DetailRow
                  label="Email Karyawan"
                  value={
                    employee.email ? (
                      <a
                        href={`mailto:${employee.email}`}
                        className="text-primary-600 hover:underline inline-flex items-center gap-1"
                      >
                        <Mail size={13} /> {employee.email}
                      </a>
                    ) : (
                      '-'
                    )
                  }
                />
                <DetailRow
                  label="Nomor HP / WhatsApp"
                  value={
                    employee.phone ? (
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Phone size={13} className="text-gray-500" /> {employee.phone}
                      </span>
                    ) : (
                      '-'
                    )
                  }
                />
                <DetailRow label="Alamat Domisili KTP" value={employee.address} />
                <DetailRow label="Kode Pos" value={employee.postalCode} isMono />
              </dl>
            </div>
          )}
        </div>

        {/* SECTION 3: PENEMPATAN & KARIR ORGANISASI */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs transition-all">
          <button
            type="button"
            onClick={() => toggleSection('penempatan')}
            className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors cursor-pointer ${
              expandedSections.penempatan
                ? 'bg-primary-50/40 border-b border-primary-100'
                : 'bg-gray-50/80 hover:bg-gray-100/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  expandedSections.penempatan
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-200/80 text-gray-700'
                }`}
              >
                <Building2 size={16} />
              </div>
              <span className="font-semibold text-body-sm text-gray-900">
                3. Penempatan & Karir Organisasi
              </span>
            </div>
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform duration-200 ${
                expandedSections.penempatan ? 'rotate-180 text-primary-600' : ''
              }`}
            />
          </button>

          {expandedSections.penempatan && (
            <div className="p-4 space-y-1 bg-white animate-fadeIn">
              <dl>
                <DetailRow
                  label="Unit Organisasi (Homebase)"
                  value={
                    employee.operationUnit
                      ? `[${employee.operationUnit.type}] ${employee.operationUnit.code} - ${employee.operationUnit.name}`
                      : '-'
                  }
                />
                <DetailRow
                  label="Hirarki Organisasi"
                  value={employee.operationUnit?.hierarchyPath || '-'}
                />
                <DetailRow
                  label="Atasan Langsung"
                  value={
                    employee.supervisor
                      ? `${employee.supervisor.legalName} (${employee.supervisor.employeeNumber})`
                      : 'Pimpinan Tertinggi'
                  }
                />
                <DetailRow
                  label="Tanggal Mulai Masuk"
                  value={formatDate(employee.originalDateOfHire)}
                />
                <DetailRow
                  label="Tanggal Karyawan Tetap"
                  value={formatDate(employee.permanentDate)}
                />
                {employee.actualTerminationDate && (
                  <DetailRow
                    label="Tanggal Berhenti (Resign)"
                    value={
                      <span className="text-error-600 font-medium">
                        {formatDate(employee.actualTerminationDate)}
                      </span>
                    }
                  />
                )}
                <DetailRow
                  label="Status Kepegawaian"
                  value={
                    employee.status ? (
                      <span className="text-emerald-700 font-semibold">Aktif Bekerja</span>
                    ) : (
                      <span className="text-gray-500 font-medium">Nonaktif / Resign</span>
                    )
                  }
                />
                {employee.userAccount && (
                  <DetailRow
                    label="Akun Login Terhubung"
                    value={
                      <span className="inline-flex items-center gap-1.5 text-primary-700 font-medium">
                        <ShieldCheck size={14} />
                        {employee.userAccount.username} (
                        {employee.userAccount.aktif ? 'Aktif' : 'Terkunci'})
                      </span>
                    }
                  />
                )}
              </dl>
            </div>
          )}
        </div>

        {/* SECTION 4: INFORMASI PERBANKAN */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs transition-all">
          <button
            type="button"
            onClick={() => toggleSection('bank')}
            className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors cursor-pointer ${
              expandedSections.bank
                ? 'bg-primary-50/40 border-b border-primary-100'
                : 'bg-gray-50/80 hover:bg-gray-100/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  expandedSections.bank
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-200/80 text-gray-700'
                }`}
              >
                <CreditCard size={16} />
              </div>
              <span className="font-semibold text-body-sm text-gray-900">
                4. Informasi Perbankan
              </span>
            </div>
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform duration-200 ${
                expandedSections.bank ? 'rotate-180 text-primary-600' : ''
              }`}
            />
          </button>

          {expandedSections.bank && (
            <div className="p-4 space-y-1 bg-white animate-fadeIn">
              <dl>
                <DetailRow
                  label="Nama Bank"
                  value={
                    (() => {
                      const bankInfo = findBankByIdOrCode(employee.bankId);
                      if (bankInfo) {
                        return (
                          <span className="inline-flex items-center gap-1.5 font-medium text-gray-900">
                            <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-bold border border-gray-200">
                              {bankInfo.code}
                            </span>
                            <span>{bankInfo.name}</span>
                            {bankInfo.alias && (
                              <span className="text-xs text-primary-700 font-semibold">
                                ({bankInfo.alias})
                              </span>
                            )}
                          </span>
                        );
                      }
                      return employee.bankId || '-';
                    })()
                  }
                />
                <DetailRow
                  label="Nomor Rekening Bank"
                  value={employee.accountNumber || '-'}
                  isMono
                />
                <DetailRow
                  label="Nama Pemilik Rekening"
                  value={employee.accountName || '-'}
                />
              </dl>
            </div>
          )}
        </div>
      </div>
    </SlideOver>
  );
};
