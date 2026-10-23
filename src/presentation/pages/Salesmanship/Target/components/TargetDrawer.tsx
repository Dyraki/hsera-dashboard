import React, { useMemo } from 'react';
import { District, OperationUnitOption } from '@/core/domain/models/District';
import { SlideOver } from '@/presentation/components/ui/SlideOver';
import { Button } from '@/presentation/components/ui/Button';
import { Input, Select } from '@/presentation/components/form';
import { Target, AlertCircle } from 'lucide-react';
import {
  ModalMode,
  TargetFormData,
  JENIS_TARGET_OPTIONS,
  HARI_KUNJUNGAN_OPTIONS,
  STATUS_OPTIONS,
} from '../types';

interface TargetDrawerProps {
  isOpen: boolean;
  mode: ModalMode;
  formData: TargetFormData;
  formError: string | null;
  districts: District[];
  operationUnits: OperationUnitOption[];
  isSuperAdmin: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onChange: (data: TargetFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TargetDrawer: React.FC<TargetDrawerProps> = ({
  isOpen,
  mode,
  formData,
  formError,
  districts,
  operationUnits,
  isSuperAdmin,
  isSubmitting,
  onClose,
  onChange,
  onSubmit,
}) => {
  const isCreate = mode === 'create';

  const ouOptions = useMemo(() => {
    const list = operationUnits.map((ou) => ({
      value: ou.kode,
      label: `${ou.kode} - ${ou.nama}`,
    }));
    if (isSuperAdmin) {
      return [{ value: '', label: 'Global (Berlaku untuk Semua Unit & District)' }, ...list];
    }
    return list;
  }, [operationUnits, isSuperAdmin]);

  const districtOptions = useMemo(() => {
    if (!formData.ouKode) {
      return [
        { value: '', label: 'Global (Berlaku untuk Semua District)' },
        ...districts.map((d) => ({
          value: d.id,
          label: `${d.kode} (${d.ouKode}) ${d.karyawanName ? `- ${d.karyawanName}` : ''}`,
        })),
      ];
    }

    const filtered = districts.filter((d) => d.ouKode === formData.ouKode);
    return [
      { value: '', label: `Semua District di Unit ${formData.ouKode}` },
      ...filtered.map((d) => ({
        value: d.id,
        label: `${d.kode} ${d.karyawanName ? `- ${d.karyawanName}` : ''}`,
      })),
    ];
  }, [districts, formData.ouKode]);

  const handleOuChange = (newOu: string) => {
    let newDistrictId = formData.districtId;
    if (newOu) {
      const dist = districts.find((d) => d.id === newDistrictId);
      if (!dist || dist.ouKode !== newOu) {
        newDistrictId = '';
      }
    }
    onChange({
      ...formData,
      ouKode: newOu,
      districtId: newDistrictId,
    });
  };

  const quickPresets: Record<string, number[]> = {
    KUNJUNGAN: [20, 25, 30, 35, 40, 50],
    BD: [10, 15, 20, 25, 30],
    EC: [15, 20, 25, 30, 35],
    FACEUP: [10, 20, 30, 50],
    VOLUME: [50, 70, 100, 140, 200, 300],
  };

  const currentPresets = quickPresets[formData.jenisTarget] || [10, 20, 30, 40];

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title={isCreate ? 'Tambah Target Salesmanship' : `Edit Target: ${formData.jenisTarget}`}
      subtitle={
        isCreate
          ? 'Tentukan target performa kunjungan, brand distribution, atau EC untuk salesmen.'
          : 'Perbarui konfigurasi nilai atau masa berlaku target performa.'
      }
      icon={<Target size={20} className="text-primary-600" />}
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
            form="target-form"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
          >
            {isCreate ? 'Tambah Target' : 'Simpan Perubahan'}
          </Button>
        </>
      }
    >
      <form id="target-form" onSubmit={onSubmit} className="space-y-5">
        {formError && (
          <div className="bg-error-50 border border-error-200 text-error-600 rounded-lg p-3 text-body-sm flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Jenis Target */}
        <Select
          label="Jenis Target *"
          value={formData.jenisTarget}
          onChange={(e) => onChange({ ...formData, jenisTarget: e.target.value as any })}
          options={JENIS_TARGET_OPTIONS}
          disabled={isSubmitting}
          required
        />

        {/* Operation Unit */}
        <Select
          label="Operation Unit / Cabang *"
          value={formData.ouKode}
          onChange={(e) => handleOuChange(e.target.value)}
          options={ouOptions}
          disabled={isSubmitting || (!isSuperAdmin && operationUnits.length <= 1)}
          helperText={
            isSuperAdmin
              ? "Pilih 'Global' untuk target acuan seluruh unit, atau pilih unit cabang tertentu."
              : "Target akan berlaku untuk Operation Unit yang dipilih."
          }
        />

        {/* Teritori District */}
        <Select
          label="Cakupan Teritori District"
          value={formData.districtId}
          onChange={(e) => onChange({ ...formData, districtId: e.target.value })}
          options={districtOptions}
          disabled={isSubmitting}
          helperText={
            formData.ouKode
              ? `Pilih 'Semua District di Unit ${formData.ouKode}' untuk acuan cabang, atau pilih district salesmen tertentu untuk override khusus.`
              : "Pilih 'Global' jika target berlaku secara umum ke semua salesmen/district."
          }
        />

        {/* Hari Kunjungan */}
        <Select
          label="Hari Kunjungan Spesifik"
          value={formData.hariKunjungan}
          onChange={(e) => onChange({ ...formData, hariKunjungan: e.target.value })}
          options={HARI_KUNJUNGAN_OPTIONS}
          disabled={isSubmitting}
          helperText="Pilih hari tertentu jika target hanya berlaku pada hari tersebut, 'Senin - Jumat', atau 'Semua Hari'."
        />

        {/* Nilai Target */}
        <div className="space-y-1.5">
          <Input
            label="Nilai Target *"
            type="number"
            min="1"
            step="any"
            value={formData.nilai}
            onChange={(e) => onChange({ ...formData, nilai: e.target.value })}
            placeholder="Contoh: 40"
            disabled={isSubmitting}
            required
            helperText={
              formData.jenisTarget === 'VOLUME'
                ? 'Masukkan target volume penjualan dalam satuan Pack (Pk).'
                : 'Masukkan angka nominal target capaian.'
            }
          />

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 pt-1 flex-wrap">
            <span className="text-[11px] font-medium text-gray-500">Preset Cepat:</span>
            {currentPresets.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => onChange({ ...formData, nilai: val })}
                className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  Number(formData.nilai) === val
                    ? 'bg-primary-50 border-primary-500 text-primary-700 font-bold'
                    : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Periode Berlaku */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Berlaku Dari *"
            type="date"
            value={formData.berlakuDari}
            onChange={(e) => onChange({ ...formData, berlakuDari: e.target.value })}
            disabled={isSubmitting}
            required
          />
          <Input
            label="Berlaku Sampai (Opsional)"
            type="date"
            value={formData.berlakuSampai}
            onChange={(e) => onChange({ ...formData, berlakuSampai: e.target.value })}
            disabled={isSubmitting}
            helperText="Kosongkan jika target berlaku tanpa batas akhir."
          />
        </div>

        {/* Status */}
        <Select
          label="Status Target"
          value={formData.status}
          onChange={(e) => onChange({ ...formData, status: e.target.value as any })}
          options={STATUS_OPTIONS}
          disabled={isSubmitting}
        />
      </form>
    </SlideOver>
  );
};
