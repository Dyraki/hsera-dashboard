import React from 'react';
import { Briefcase, Building2, CreditCard, MapPin } from 'lucide-react';
import { SlideOver } from '@/presentation/components/ui/SlideOver';
import { Button } from '@/presentation/components/ui/Button';
import { Karyawan, KaryawanSupervisor } from '../../../../../core/domain/models/Karyawan';
import { KaryawanFormValues, OperationUnitOption } from '../types';

interface KaryawanFormDrawerProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  employee: Karyawan | null;
  activeTab: 'identitas' | 'kontak' | 'penempatan' | 'bank';
  values: KaryawanFormValues;
  units: OperationUnitOption[];
  supervisors: KaryawanSupervisor[];
  isSubmitting: boolean;
  onClose: () => void;
  onTabChange: (tab: KaryawanFormDrawerProps['activeTab']) => void;
  onChange: <K extends keyof KaryawanFormValues>(field: K, value: KaryawanFormValues[K]) => void;
  onSubmit: (event: React.FormEvent) => void;
}

const control = 'w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-md text-body-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100';

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <label className="block text-body-sm font-medium text-gray-700">
    <span className="block mb-1">{label}{required && <span className="text-error-600"> *</span>}</span>
    {children}
  </label>
);

export const KaryawanFormDrawer: React.FC<KaryawanFormDrawerProps> = ({
  isOpen, mode, employee, activeTab, values, units, supervisors, isSubmitting,
  onClose, onTabChange, onChange, onSubmit
}) => {
  const tabs = [
    { id: 'identitas' as const, label: '1. Identitas & Pribadi', icon: <Briefcase size={13} /> },
    { id: 'kontak' as const, label: '2. Kontak & Alamat', icon: <MapPin size={13} /> },
    { id: 'penempatan' as const, label: '3. Penempatan & Karir', icon: <Building2 size={13} /> },
    { id: 'bank' as const, label: '4. Perbankan', icon: <CreditCard size={13} /> }
  ];

  return (
    <SlideOver isOpen={isOpen} onClose={onClose} title={mode === 'create' ? 'Input Karyawan Baru (32 Kolom HRIS)' : `Edit: ${employee?.legalName}`}>
      <form onSubmit={onSubmit} className="p-5 sm:p-6 space-y-6">
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1 overflow-x-auto text-xs font-semibold">
          {tabs.map((tab) => <button key={tab.id} type="button" onClick={() => onTabChange(tab.id)} className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-950 hover:bg-gray-200'}`}>
            {tab.icon} {tab.label}
          </button>)}
        </div>

        {activeTab === 'identitas' && <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="NIK (Nomor KTP)" required><input maxLength={16} value={values.nik} onChange={(event) => onChange('nik', event.target.value)} placeholder="3273010101900001" className={`${control} font-mono`} /></Field>
            <Field label="Nomor Karyawan / NIP" required><input value={values.employeeNumber} onChange={(event) => onChange('employeeNumber', event.target.value)} placeholder="EMP-2026-001" className={`${control} font-mono`} /></Field>
          </div>
          <Field label="Nama Lengkap (Sesuai KTP)" required><input value={values.legalName} onChange={(event) => onChange('legalName', event.target.value)} placeholder="Misal: Budi Santoso" className={control} /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Jenis Kelamin"><select value={values.sex} onChange={(event) => onChange('sex', event.target.value)} className={control}><option>Laki-laki</option><option>Perempuan</option></select></Field>
            <Field label="Status Pernikahan"><select value={values.maritalStatus} onChange={(event) => onChange('maritalStatus', event.target.value)} className={control}><option>Belum Menikah</option><option>Menikah</option><option>Cerai Hidup</option><option>Cerai Mati</option></select></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Agama"><select value={values.religion} onChange={(event) => onChange('religion', event.target.value)} className={control}><option>Islam</option><option>Kristen Protestan</option><option>Katolik</option><option>Hindu</option><option>Buddha</option><option>Konghucu</option></select></Field>
            <Field label="Pendidikan Terakhir"><select value={values.lastEducation} onChange={(event) => onChange('lastEducation', event.target.value)} className={control}><option value="SMA/SMK">SMA/SMK</option><option value="D3">Diploma 3 (D3)</option><option value="S1">Sarjana (S1)</option><option value="S2">Magister (S2)</option><option value="S3">Doktor (S3)</option></select></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Tempat Lahir"><input value={values.placeOfBirth} onChange={(event) => onChange('placeOfBirth', event.target.value)} placeholder="Bandung" className={control} /></Field>
            <Field label="Tanggal Lahir"><input type="date" value={values.dateOfBirth} onChange={(event) => onChange('dateOfBirth', event.target.value)} className={control} /></Field>
          </div>
        </div>}

        {activeTab === 'kontak' && <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email Karyawan"><input type="email" value={values.email} onChange={(event) => onChange('email', event.target.value)} placeholder="budi@perusahaan.com" className={control} /></Field>
            <Field label="Nomor HP / WhatsApp"><input value={values.phone} onChange={(event) => onChange('phone', event.target.value)} placeholder="+6281234567890" className={control} /></Field>
          </div>
          <Field label="Alamat Domisili KTP"><textarea rows={3} value={values.address} onChange={(event) => onChange('address', event.target.value)} placeholder="Jl. Sukajadi No. 123..." className={control} /></Field>
          <Field label="Kode Pos"><input maxLength={10} value={values.postalCode} onChange={(event) => onChange('postalCode', event.target.value)} placeholder="40164" className={control} /></Field>
        </div>}

        {activeTab === 'penempatan' && <div className="space-y-4 animate-fadeIn">
          <Field label="Unit Penempatan (Homebase)" required><select value={values.operationUnitId} onChange={(event) => onChange('operationUnitId', event.target.value)} className={control}><option value="">-- Pilih Unit Organisasi --</option>{units.map((unit) => <option key={unit.id} value={unit.id}>[{unit.type}] {unit.code} - {unit.name}</option>)}</select></Field>
          <p className="text-[11px] text-gray-600 -mt-3">Menentukan batasan cakupan data (Regional/Area/Cabang) yang dapat diakses oleh karyawan.</p>
          <Field label="Atasan Langsung (Supervisor)"><select value={values.supervisorId} onChange={(event) => onChange('supervisorId', event.target.value)} className={control}><option value="">-- Tidak Ada (Pimpinan Tertinggi) --</option>{supervisors.filter((item) => !employee || item.id !== employee.id).map((item) => <option key={item.id} value={item.id}>{item.legalName} ({item.employeeNumber})</option>)}</select></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Tanggal Mulai Masuk"><input type="date" value={values.originalDateOfHire} onChange={(event) => onChange('originalDateOfHire', event.target.value)} className={control} /></Field>
            <Field label="Tanggal Karyawan Tetap"><input type="date" value={values.permanentDate} onChange={(event) => onChange('permanentDate', event.target.value)} className={control} /></Field>
          </div>
          <Field label="Tanggal Berhenti (Resign)"><input type="date" value={values.actualTerminationDate} onChange={(event) => onChange('actualTerminationDate', event.target.value)} className={control} /></Field>
          <label className="flex items-center gap-2 text-body-sm text-gray-700 font-medium"><input type="checkbox" checked={values.status} onChange={(event) => onChange('status', event.target.checked)} className="rounded border-gray-300 bg-white text-primary-600 focus:ring-primary-500 h-4 w-4" />Karyawan Aktif Bekerja</label>
        </div>}

        {activeTab === 'bank' && <div className="space-y-4 animate-fadeIn">
          <Field label="Nama Pemilik Rekening"><input value={values.accountName} onChange={(event) => onChange('accountName', event.target.value)} placeholder="Misal: Budi Santoso" className={control} /></Field>
          <Field label="Nomor Rekening Bank"><input value={values.accountNumber} onChange={(event) => onChange('accountNumber', event.target.value)} placeholder="1234567890" className={`${control} font-mono`} /></Field>
        </div>}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-6 border-t border-gray-200">
          <div className="text-caption text-gray-600">Semua perubahan langsung tersinkronisasi.</div>
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" type="button" onClick={onClose}>Batal</Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : mode === 'create' ? 'Simpan Karyawan' : 'Perbarui Karyawan'}</Button>
          </div>
        </div>
      </form>
    </SlideOver>
  );
};
