import React from 'react';
import { OperationUnitOption, SalesmanOption } from '@/core/domain/models/District';
import { Channel } from '@/core/domain/models/Channel';
import { Button } from '@/presentation/components/ui/Button';
import { SlideOver } from '@/presentation/components/ui/SlideOver';
import { ModalMode, TerritoryFormData } from '../types';
import { MapPin, Building2, User, CheckCircle2, ShieldCheck, Filter, Layers, Check } from 'lucide-react';

interface TerritoryModalProps {
  isOpen: boolean;
  mode: ModalMode;
  formData: TerritoryFormData;
  operationUnits: OperationUnitOption[];
  salesmen: SalesmanOption[];
  channels: Channel[];
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
  channels,
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

  const toggleChannel = (channelId: string) => {
    const current = formData.channelIds || [];
    const updated = current.includes(channelId)
      ? current.filter((id) => id !== channelId)
      : [...current, channelId];
    onChange({
      ...formData,
      channelIds: updated,
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

        {/* Channel Distribusi */}
        <div>
          <label className="block text-body-sm font-semibold text-gray-800 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers size={15} className="text-gray-500" />
              Channel Distribusi
            </span>
            <span className="text-[11px] font-normal text-gray-500">
              Multi-pilih (bisa lebih dari 1)
            </span>
          </label>
          {channels.length === 0 ? (
            <div className="text-xs text-gray-500 italic p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              Memuat daftar channel...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {channels.map((ch) => {
                const isSelected = (formData.channelIds || []).includes(ch.id);
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => toggleChannel(ch.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50/70 text-primary-950 ring-1 ring-primary-500 shadow-xs'
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-sm font-semibold truncate">{ch.nama}</div>
                      <div className="text-[11px] text-gray-500 uppercase font-mono">{ch.kode}</div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check size={13} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          <p className="text-[11px] text-gray-500 mt-1.5">
            Pilih channel distribusi yang dilayani oleh teritori ini (contoh: DO-012 melayani Agen & Wholesale).
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
                {sm.namaLengkap} {sm.employeeNumber ? `(NIP: ${sm.employeeNumber})` : sm.nik ? `(NIK: ${sm.nik})` : ''} {sm.ouKode ? `[${sm.ouKode}]` : ''}
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
