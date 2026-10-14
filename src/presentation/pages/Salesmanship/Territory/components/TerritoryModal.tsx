import React from 'react';
import { OperationUnitOption, SalesmanOption } from '@/core/domain/models/District';
import { Button } from '@/presentation/components/ui/Button';
import { SlideOver } from '@/presentation/components/ui/SlideOver';
import { ModalMode, TerritoryFormData } from '../types';
import { MapPin, Building2, User, CheckCircle2, ShieldCheck, Filter } from 'lucide-react';

interface TerritoryModalProps {
  isOpen: boolean;
  mode: ModalMode;
  formData: TerritoryFormData;
  operationUnits: OperationUnitOption[];
  salesmen: SalesmanOption[];
  isSubmitting: boolean;
  onClose: () => void;
  onChange: (data: TerritoryFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const controlClass =
  'w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-lg text-body-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 transition-all';

export const TerritoryModal: React.FC<TerritoryModalProps> = ({
  isOpen,
  mode,
  formData,
  operationUnits,
  salesmen,
  isSubmitting,
  onClose,
  onChange,
  onSubmit,
}) => {
  const isEdit = mode === 'edit';

  // Filter salesmen relevan berdasarkan Operation Unit yang dipilih
  const filteredSalesmen = React.useMemo(() => {
    if (!formData.ouKode) return salesmen;
    const matched = salesmen.filter((sm) => sm.ouKode === formData.ouKode);
    return matched.length > 0 ? matched : salesmen;
  }, [salesmen, formData.ouKode]);

  const handleOuChange = (newOuKode: string) => {
    const matched = salesmen.filter((sm) => sm.ouKode === newOuKode);
    const newKaryawanId = matched.length > 0 ? matched[0].id : formData.karyawanId;
    onChange({
      ...formData,
      ouKode: newOuKode,
      karyawanId: newKaryawanId,
    });
  };

  const footer = (
    <div className="flex items-center justify-between w-full">
      <div className="text-caption text-gray-500 hidden sm:block">
        Tersinkronisasi ke Salesmanship Database.
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
          Batal
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Menyimpan...
            </span>
          ) : isEdit ? (
            'Simpan Perubahan'
          ) : (
            'Tambahkan Teritori'
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Ubah Data Teritori' : 'Tambah Teritori Baru'}
      subtitle={
        isEdit
          ? 'Perbarui penugasan salesman atau kode wilayah'
          : 'Daftarkan kode teritori dan salesman penanggung jawab lapangan'
      }
      icon={<MapPin size={22} />}
      width="max-w-lg"
      footer={footer}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Banner Info */}
        <div className="bg-primary-50/60 border border-primary-100/80 rounded-xl p-4 text-xs text-primary-900 flex items-start gap-3">
          <ShieldCheck size={18} className="text-primary-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Teritori Management</strong> mengatur batasan area kerja salesman yang akan menjadi acuan input callsheet harian dan evaluasi target mingguan RIS.
          </div>
        </div>

        {/* Operation Unit */}
        <div>
          <label className="block text-body-sm font-semibold text-gray-800 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Building2 size={15} className="text-gray-500" />
              Operation Unit <span className="text-error-600">*</span>
            </span>
            {operationUnits.length > 0 && (
              <span className="text-[11px] font-normal text-gray-600">
                {operationUnits.length} unit wilayah tersedia
              </span>
            )}
          </label>
          <select
            value={formData.ouKode}
            onChange={(e) => handleOuChange(e.target.value)}
            className={controlClass}
            required
          >
            <option value="" disabled>-- Pilih Operation Unit --</option>
            {operationUnits.map((ou) => (
              <option key={ou.id} value={ou.kode}>
                [{ou.kode}] {ou.nama} {ou.kategori ? `• ${ou.kategori}` : ''}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-gray-500 mt-1">
            Unit operasional tempat teritori ini bernaung (disesuaikan dengan hak akses wilayah Anda).
          </p>
        </div>

        {/* Kode District */}
        <div>
          <label className="block text-body-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-1.5">
            <MapPin size={15} className="text-gray-500" />
            Kode District (Teritori) <span className="text-error-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: D-01, 001, SMG-01"
            value={formData.kode}
            onChange={(e) => onChange({ ...formData, kode: e.target.value.toUpperCase() })}
            className={`${controlClass} font-mono uppercase`}
            required
            maxLength={10}
          />
          <p className="text-[11px] text-gray-500 mt-1">
            Kode wilayah harus unik dalam satu Operation Unit (maksimal 10 karakter).
          </p>
        </div>

        {/* Penugasan Salesman */}
        <div>
          <label className="block text-body-sm font-semibold text-gray-800 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <User size={15} className="text-gray-500" />
              Salesman Lapangan <span className="text-error-600">*</span>
            </span>
            {formData.ouKode && filteredSalesmen.length < salesmen.length && (
              <span className="text-[11px] font-normal text-primary-600 flex items-center gap-1">
                <Filter size={11} /> Unit {formData.ouKode}
              </span>
            )}
          </label>
          <select
            value={formData.karyawanId}
            onChange={(e) => onChange({ ...formData, karyawanId: e.target.value })}
            className={controlClass}
            required
          >
            <option value="" disabled>-- Pilih Salesman Lapangan --</option>
            {filteredSalesmen.map((sm) => (
              <option key={sm.id} value={sm.id}>
                {sm.namaLengkap} {sm.nik ? `(NIK: ${sm.nik})` : ''} {sm.ouKode ? `[${sm.ouKode}]` : ''}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-gray-500 mt-1">
            Personil yang bertanggung jawab melakukan input callsheet harian pada teritori ini.
          </p>
        </div>

        {/* Status Teritori */}
        <div>
          <label className="block text-body-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-gray-500" />
            Status Teritori
          </label>
          <select
            value={formData.status}
            onChange={(e) => onChange({ ...formData, status: e.target.value })}
            className={controlClass}
          >
            <option value="AKTIF">AKTIF (Dapat digunakan untuk input callsheet)</option>
            <option value="NONAKTIF">NONAKTIF (Ditutup / Nonaktif)</option>
          </select>
        </div>
      </form>
    </SlideOver>
  );
};

// Alias export for clarity
export const TerritoryFormDrawer = TerritoryModal;
