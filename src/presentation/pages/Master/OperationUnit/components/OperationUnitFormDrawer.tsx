import React from 'react';
import { Building2, FileText, Layers, MapPin } from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';
import { SlideOver } from '@/presentation/components/ui/SlideOver';
import { OperationUnit, OperationUnitType } from '../../../../../core/domain/models/OperationUnit';
import { OperationUnitFormValues } from '../types';

interface OperationUnitFormDrawerProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  selectedUnit: OperationUnit | null;
  units: OperationUnit[];
  values: OperationUnitFormValues;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
  onChange: <K extends keyof OperationUnitFormValues>(field: K, value: OperationUnitFormValues[K]) => void;
}

const FormSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  title,
  icon,
  children
}) => (
  <section className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
    <h3 className="text-caption font-semibold uppercase tracking-wider text-primary-700 flex items-center gap-1.5">
      {icon} {title}
    </h3>
    {children}
  </section>
);

const FormField: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({
  label,
  required = false,
  children
}) => (
  <label className="block text-body-sm font-medium text-gray-700">
    <span className="block mb-1">
      {label} {required && <span className="text-error-600">*</span>}
    </span>
    {children}
  </label>
);

const inputClassName = 'w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-md text-body-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100';

export const OperationUnitFormDrawer: React.FC<OperationUnitFormDrawerProps> = ({
  isOpen,
  mode,
  selectedUnit,
  units,
  values,
  isSubmitting,
  onClose,
  onSubmit,
  onChange
}) => (
  <SlideOver
    isOpen={isOpen}
    onClose={onClose}
    title={mode === 'create' ? 'Tambah Operation Unit Baru' : `Edit Unit: ${selectedUnit?.name}`}
  >
    <form onSubmit={onSubmit} className="space-y-5 p-5 sm:p-6">
      <FormSection title="Posisi & Hierarki" icon={<Layers size={14} />}>
        <FormField label="Tipe Level Kantor" required>
          <select
            value={values.type}
            onChange={(event) => onChange('type', event.target.value as OperationUnitType)}
            disabled={mode === 'edit' && selectedUnit?.type === 'HEAD_OFFICE'}
            className={inputClassName}
          >
            <option value="HEAD_OFFICE">HEAD OFFICE (Kantor Pusat)</option>
            <option value="REGIONAL">REGIONAL (Kantor Wilayah)</option>
            <option value="AREA_OFFICE">AREA OFFICE (Kantor Area)</option>
            <option value="OPERATION_UNIT">OPERATION UNIT (Cabang / Gudang)</option>
          </select>
        </FormField>

        {values.type !== 'HEAD_OFFICE' && (
          <FormField label="Menginduk ke (Parent Unit)" required>
            <select value={values.parentId} onChange={(event) => onChange('parentId', event.target.value)} className={inputClassName}>
              <option value="">-- Pilih Kantor Induk --</option>
              {units
                .filter((unit) => {
                  if (selectedUnit && unit.id === selectedUnit.id) return false;
                  if (values.type === 'REGIONAL') return unit.type === 'HEAD_OFFICE';
                  if (values.type === 'AREA_OFFICE') return unit.type === 'REGIONAL';
                  if (values.type === 'OPERATION_UNIT') return unit.type === 'AREA_OFFICE' || unit.type === 'REGIONAL';
                  return true;
                })
                .map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    [{unit.type}] {unit.code} - {unit.name}
                  </option>
                ))}
            </select>
          </FormField>
        )}
      </FormSection>

      <FormSection title="Identitas Unit" icon={<Building2 size={14} />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Kode Unit" required>
            <input value={values.code} onChange={(event) => onChange('code', event.target.value)} placeholder="Misal: CAB-PST" className={`${inputClassName} uppercase font-mono`} />
          </FormField>
          <FormField label="Kategori">
            <input value={values.category} onChange={(event) => onChange('category', event.target.value)} placeholder="Cabang, Gudang, Depo, Hub" className={inputClassName} />
          </FormField>
        </div>
        <FormField label="Nama Lengkap Unit" required>
          <input value={values.name} onChange={(event) => onChange('name', event.target.value)} placeholder="Misal: Cabang Pasteur" className={inputClassName} />
        </FormField>
        <FormField label="Titik Distribusi (Distribution Point)">
          <input value={values.distributionPoint} onChange={(event) => onChange('distributionPoint', event.target.value)} placeholder="Titik Distribusi Bandung Barat" className={inputClassName} />
        </FormField>
        <FormField label="Alamat Fisik">
          <textarea value={values.address} onChange={(event) => onChange('address', event.target.value)} rows={2} placeholder="Alamat lengkap..." className={inputClassName} />
        </FormField>
        <FormField label="Nomor Telepon">
          <input value={values.phone} onChange={(event) => onChange('phone', event.target.value)} placeholder="Misal: +62222012345" className={inputClassName} />
        </FormField>
      </FormSection>

      <FormSection title="Koordinat Geospasial" icon={<MapPin size={14} />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Latitude">
            <input value={values.latitude} onChange={(event) => onChange('latitude', event.target.value)} placeholder="-6.891234" className={`${inputClassName} font-mono`} />
          </FormField>
          <FormField label="Longitude">
            <input value={values.longitude} onChange={(event) => onChange('longitude', event.target.value)} placeholder="107.589123" className={`${inputClassName} font-mono`} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Aset & Status Sewa" icon={<FileText size={14} />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Status Bangunan">
            <select value={values.buildingStatus} onChange={(event) => onChange('buildingStatus', event.target.value)} className={inputClassName}>
              <option value="Sewa">Sewa</option>
              <option value="Milik Sendiri">Milik Sendiri</option>
              <option value="Pinjam Pakai">Pinjam Pakai</option>
            </select>
          </FormField>
          <FormField label="Biaya Sewa Tahunan (Rp)">
            <input type="number" value={values.annualRent} onChange={(event) => onChange('annualRent', event.target.value)} placeholder="150000000" className={inputClassName} />
          </FormField>
        </div>
      </FormSection>

      <label className="flex items-center gap-2 text-body-sm font-medium text-gray-700">
        <input type="checkbox" checked={values.status} onChange={(event) => onChange('status', event.target.checked)} className="h-4 w-4 rounded border-gray-300 bg-white text-primary-600 focus:ring-primary-500" />
        Unit Aktif dan Beroperasi
      </label>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <Button variant="secondary" type="button" onClick={onClose}>Batal</Button>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : mode === 'create' ? 'Simpan Unit' : 'Perbarui Unit'}
        </Button>
      </div>
    </form>
  </SlideOver>
);