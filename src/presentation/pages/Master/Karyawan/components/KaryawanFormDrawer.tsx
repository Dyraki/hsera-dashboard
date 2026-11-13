import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  CreditCard,
  MapPin,
  Users,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  ChevronsUpDown,
} from 'lucide-react';
import { SlideOver } from '@/presentation/components/ui/SlideOver';
import { Button } from '@/presentation/components/ui/Button';
import { SearchableBankSelect } from '@/presentation/components/form/SearchableBankSelect';
import { Karyawan, KaryawanSupervisor } from '../../../../../core/domain/models/Karyawan';
import { KaryawanFormValues, OperationUnitOption } from '../types';

export interface KaryawanFormDrawerProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  employee: Karyawan | null;
  activeTab?: 'identitas' | 'kontak' | 'penempatan' | 'bank';
  values: KaryawanFormValues;
  units: OperationUnitOption[];
  supervisors: KaryawanSupervisor[];
  isSubmitting: boolean;
  onClose: () => void;
  onTabChange?: (tab: 'identitas' | 'kontak' | 'penempatan' | 'bank') => void;
  onChange: <K extends keyof KaryawanFormValues>(field: K, value: KaryawanFormValues[K]) => void;
  onSubmit: (event: React.FormEvent) => void;
}

const controlClass =
  'w-full bg-white border border-gray-300 px-3.5 py-2 rounded-md text-body-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 transition-colors disabled:bg-gray-100 disabled:text-gray-500';

const Field: React.FC<{
  label: string;
  required?: boolean;
  helperText?: string;
  children: React.ReactNode;
}> = ({ label, required, helperText, children }) => (
  <div className="space-y-1">
    <label className="block text-body-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-error-600 font-bold ml-1">*</span>}
    </label>
    {children}
    {helperText && <p className="text-[11px] text-gray-500 leading-tight">{helperText}</p>}
  </div>
);

type SectionKey = 'identitas' | 'kontak' | 'penempatan' | 'bank';

export const KaryawanFormDrawer: React.FC<KaryawanFormDrawerProps> = ({
  isOpen,
  mode,
  employee,
  values,
  units,
  supervisors,
  isSubmitting,
  onClose,
  onChange,
  onSubmit,
}) => {
  // Status ekspansi tiap accordion section vertikal
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

  // Validasi kelengkapan data per seksi untuk badge visual
  const isIdentitasComplete = Boolean(
    values.nik && values.employeeNumber && values.legalName
  );
  const isKontakFilled = Boolean(values.email || values.phone || values.address);
  const isPenempatanComplete = Boolean(values.operationUnitId);
  const isBankFilled = Boolean(values.bankId || values.accountName || values.accountNumber);

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Tambah Data Karyawan' : `Edit Karyawan: ${employee?.legalName || ''}`}
      subtitle={
        mode === 'create'
          ? 'Lengkapi data identitas, kontak, penempatan, dan rekening karyawan.'
          : 'Perbarui informasi data diri atau mutasi penempatan karyawan.'
      }
      icon={<Users size={20} className="text-primary-600" />}
      width="max-w-xl"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="karyawan-form"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
          >
            {mode === 'create' ? 'Simpan Karyawan' : 'Perbarui Karyawan'}
          </Button>
        </>
      }
    >
      <form id="karyawan-form" onSubmit={onSubmit} className="space-y-4">
        {/* Toolbar Accordion: Ringkasan & Tombol Buka/Lipat Semua */}
        <div className="flex items-center justify-between px-1 text-caption text-gray-500">
          <span className="font-medium text-gray-600">
            Formulir Master Karyawan (4 Kategori)
          </span>
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium transition-colors hover:underline"
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
              <div>
                <span className="font-semibold text-body-sm text-gray-900 block leading-tight">
                  1. Identitas & Profil Pribadi
                </span>
                <span className="text-[11px] text-gray-500">
                  NIK, NIP, Nama KTP, Data Kependudukan
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isIdentitasComplete ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 size={12} /> Lengkap
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <AlertCircle size={12} /> 3 Wajib Diisi
                </span>
              )}
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform duration-200 ${
                  expandedSections.identitas ? 'rotate-180 text-primary-600' : ''
                }`}
              />
            </div>
          </button>

          {expandedSections.identitas && (
            <div className="p-4 space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Field label="NIK (Nomor KTP)" required>
                  <input
                    maxLength={16}
                    value={values.nik}
                    onChange={(e) => onChange('nik', e.target.value)}
                    placeholder="3273010101900001"
                    className={`${controlClass} font-mono`}
                    required
                  />
                </Field>
                <Field label="Nomor Karyawan / NIP" required>
                  <input
                    value={values.employeeNumber}
                    onChange={(e) => onChange('employeeNumber', e.target.value)}
                    placeholder="EMP-2026-001"
                    className={`${controlClass} font-mono`}
                    required
                  />
                </Field>
              </div>

              <Field label="Nama Lengkap (Sesuai KTP)" required>
                <input
                  value={values.legalName}
                  onChange={(e) => onChange('legalName', e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className={controlClass}
                  required
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Field label="Jenis Kelamin">
                  <select
                    value={values.sex}
                    onChange={(e) => onChange('sex', e.target.value)}
                    className={controlClass}
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </Field>
                <Field label="Status Pernikahan">
                  <select
                    value={values.maritalStatus}
                    onChange={(e) => onChange('maritalStatus', e.target.value)}
                    className={controlClass}
                  >
                    <option value="Belum Menikah">Belum Menikah</option>
                    <option value="Menikah">Menikah</option>
                    <option value="Cerai Hidup">Cerai Hidup</option>
                    <option value="Cerai Mati">Cerai Mati</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Field label="Agama">
                  <select
                    value={values.religion}
                    onChange={(e) => onChange('religion', e.target.value)}
                    className={controlClass}
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen Protestan">Kristen Protestan</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </Field>
                <Field label="Pendidikan Terakhir">
                  <select
                    value={values.lastEducation}
                    onChange={(e) => onChange('lastEducation', e.target.value)}
                    className={controlClass}
                  >
                    <option value="SMA/SMK">SMA/SMK</option>
                    <option value="D3">Diploma 3 (D3)</option>
                    <option value="S1">Sarjana (S1)</option>
                    <option value="S2">Magister (S2)</option>
                    <option value="S3">Doktor (S3)</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Field label="Tempat Lahir">
                  <input
                    value={values.placeOfBirth}
                    onChange={(e) => onChange('placeOfBirth', e.target.value)}
                    placeholder="Contoh: Bandung"
                    className={controlClass}
                  />
                </Field>
                <Field label="Tanggal Lahir">
                  <input
                    type="date"
                    value={values.dateOfBirth}
                    onChange={(e) => onChange('dateOfBirth', e.target.value)}
                    className={controlClass}
                  />
                </Field>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: KONTAK & ALAMAT */}
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
              <div>
                <span className="font-semibold text-body-sm text-gray-900 block leading-tight">
                  2. Kontak & Alamat Domisili
                </span>
                <span className="text-[11px] text-gray-500">
                  Email, Nomor WhatsApp & Alamat KTP
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isKontakFilled ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Terisi
                </span>
              ) : (
                <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  Opsional
                </span>
              )}
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform duration-200 ${
                  expandedSections.kontak ? 'rotate-180 text-primary-600' : ''
                }`}
              />
            </div>
          </button>

          {expandedSections.kontak && (
            <div className="p-4 space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Field label="Email Karyawan">
                  <input
                    type="email"
                    value={values.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    placeholder="budi@perusahaan.com"
                    className={controlClass}
                  />
                </Field>
                <Field label="Nomor HP / WhatsApp">
                  <input
                    value={values.phone}
                    onChange={(e) => onChange('phone', e.target.value)}
                    placeholder="+6281234567890"
                    className={controlClass}
                  />
                </Field>
              </div>

              <Field label="Alamat Domisili KTP">
                <textarea
                  rows={3}
                  value={values.address}
                  onChange={(e) => onChange('address', e.target.value)}
                  placeholder="Jl. Sukajadi No. 123, Kelurahan..."
                  className={controlClass}
                />
              </Field>

              <Field label="Kode Pos">
                <input
                  maxLength={10}
                  value={values.postalCode}
                  onChange={(e) => onChange('postalCode', e.target.value)}
                  placeholder="Contoh: 40164"
                  className={`${controlClass} font-mono`}
                />
              </Field>
            </div>
          )}
        </div>

        {/* SECTION 3: PENEMPATAN & KARIR */}
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
              <div>
                <span className="font-semibold text-body-sm text-gray-900 block leading-tight">
                  3. Penempatan & Karir Organisasi
                </span>
                <span className="text-[11px] text-gray-500">
                  Unit Homebase, Atasan Langsung & Status
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isPenempatanComplete ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 size={12} /> Unit Terpilih
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <AlertCircle size={12} /> Wajib Diisi
                </span>
              )}
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform duration-200 ${
                  expandedSections.penempatan ? 'rotate-180 text-primary-600' : ''
                }`}
              />
            </div>
          </button>

          {expandedSections.penempatan && (
            <div className="p-4 space-y-4 animate-fadeIn">
              <Field
                label="Unit Penempatan (Homebase)"
                required
                helperText="Menentukan batasan cakupan data (Regional/Area/Cabang) yang dapat diakses oleh karyawan."
              >
                <select
                  value={values.operationUnitId}
                  onChange={(e) => onChange('operationUnitId', e.target.value)}
                  className={controlClass}
                  required
                >
                  <option value="">-- Pilih Unit Organisasi --</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      [{unit.type}] {unit.code} - {unit.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Atasan Langsung (Supervisor)">
                <select
                  value={values.supervisorId}
                  onChange={(e) => onChange('supervisorId', e.target.value)}
                  className={controlClass}
                >
                  <option value="">-- Tidak Ada (Pimpinan Tertinggi) --</option>
                  {supervisors
                    .filter((item) => !employee || item.id !== employee.id)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.legalName} ({item.employeeNumber})
                      </option>
                    ))}
                </select>
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Field label="Tanggal Mulai Masuk (Hire)">
                  <input
                    type="date"
                    value={values.originalDateOfHire}
                    onChange={(e) => onChange('originalDateOfHire', e.target.value)}
                    className={controlClass}
                  />
                </Field>
                <Field label="Tanggal Karyawan Tetap">
                  <input
                    type="date"
                    value={values.permanentDate}
                    onChange={(e) => onChange('permanentDate', e.target.value)}
                    className={controlClass}
                  />
                </Field>
              </div>

              <Field label="Tanggal Berhenti (Resign / Terminasi)">
                <input
                  type="date"
                  value={values.actualTerminationDate}
                  onChange={(e) => onChange('actualTerminationDate', e.target.value)}
                  className={controlClass}
                />
              </Field>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <label className="flex items-center gap-2.5 text-body-sm text-gray-900 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={values.status}
                    onChange={(e) => onChange('status', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4 cursor-pointer"
                  />
                  <span>Karyawan Aktif Bekerja</span>
                </label>
                <p className="text-[11px] text-gray-500 mt-1 pl-6.5">
                  Centang untuk mengizinkan penugasan operasional dan aktivasi akun login sistem.
                </p>
              </div>
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
              <div>
                <span className="font-semibold text-body-sm text-gray-900 block leading-tight">
                  4. Informasi Perbankan
                </span>
                <span className="text-[11px] text-gray-500">
                  Nomor & Nama Pemilik Rekening Payroll
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isBankFilled ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Terisi
                </span>
              ) : (
                <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  Opsional
                </span>
              )}
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform duration-200 ${
                  expandedSections.bank ? 'rotate-180 text-primary-600' : ''
                }`}
              />
            </div>
          </button>

          {expandedSections.bank && (
            <div className="p-4 space-y-4 animate-fadeIn">
              <SearchableBankSelect
                label="Nama Bank"
                value={values.bankId}
                onChange={(bankId) => onChange('bankId', bankId)}
                disabled={isSubmitting}
                helperText="Pilih bank penerbit rekening payroll karyawan."
              />
              <Field label="Nomor Rekening Bank">
                <input
                  value={values.accountNumber}
                  onChange={(e) => onChange('accountNumber', e.target.value)}
                  placeholder="Contoh: 1234567890"
                  className={`${controlClass} font-mono`}
                />
              </Field>
              <Field label="Nama Pemilik Rekening">
                <input
                  value={values.accountName}
                  onChange={(e) => onChange('accountName', e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className={controlClass}
                />
              </Field>
            </div>
          )}
        </div>
      </form>
    </SlideOver>
  );
};
