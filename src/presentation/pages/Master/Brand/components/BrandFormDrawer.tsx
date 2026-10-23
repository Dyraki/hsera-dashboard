import React from 'react';
import { SlideOver } from '@/presentation/components/ui/SlideOver';
import { Button } from '@/presentation/components/ui/Button';
import { BrandFormData, BrandModalMode } from '../types';
import { Tag, Info } from 'lucide-react';

interface BrandFormDrawerProps {
  isOpen: boolean;
  mode: BrandModalMode;
  values: BrandFormData;
  isSubmitting: boolean;
  onClose: () => void;
  onChange: <K extends keyof BrandFormData>(key: K, value: BrandFormData[K]) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BrandFormDrawer: React.FC<BrandFormDrawerProps> = ({
  isOpen,
  mode,
  values,
  isSubmitting,
  onClose,
  onChange,
  onSubmit,
}) => {
  const isEdit = mode === 'edit';

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Brand' : 'Tambah Brand Baru'}
      subtitle={
        isEdit
          ? `Perbarui informasi data produk brand: ${values.nama || values.kode}`
          : 'Tambahkan data master produk brand baru ke dalam sistem.'
      }
      icon={<Tag size={20} />}
      width="max-w-lg"
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onSubmit}
            isLoading={isSubmitting}
          >
            {isEdit ? 'Simpan Perubahan' : 'Tambah Brand'}
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Kode Brand */}
        <div>
          <label className="block text-body-sm font-semibold text-gray-800 mb-1.5">
            Kode Brand <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Misal: GG_FILTER, GG_SURYA, PMI_MARLBORO"
            value={values.kode}
            onChange={(e) => onChange('kode', e.target.value.toUpperCase().replace(/\s+/g, '_'))}
            className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-lg text-body-sm font-mono text-gray-900 placeholder:text-gray-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none uppercase"
          />
          <p className="text-caption text-gray-500 mt-1">
            Kode unik brand sebagai pengenal (otomatis huruf kapital, tanpa spasi).
          </p>
        </div>

        {/* Nama Brand */}
        <div>
          <label className="block text-body-sm font-semibold text-gray-800 mb-1.5">
            Nama Brand <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Misal: GG Filter International, GG Surya 16"
            value={values.nama}
            onChange={(e) => onChange('nama', e.target.value)}
            className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-lg text-body-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none"
          />
        </div>

        {/* Kategori Brand */}
        <div>
          <label className="block text-body-sm font-semibold text-gray-800 mb-1.5">
            Kategori Brand <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {['SKM FF', 'SKM LTLN', 'SKT', 'SPM', 'SPT', 'SKTF'].map((kat) => (
              <button
                key={kat}
                type="button"
                onClick={() => onChange('kategori', kat)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer text-center ${
                  values.kategori.toUpperCase() === kat.toUpperCase()
                    ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-xs ring-1 ring-primary-500/30'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
          <input
            type="text"
            required
            placeholder="Pilih kategori di atas atau ketik kategori lain..."
            value={values.kategori}
            onChange={(e) => onChange('kategori', e.target.value.toUpperCase())}
            className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-lg text-body-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none uppercase"
          />
        </div>

        {/* Nomor Urut (DISABLED Sesuai Spesifikasi User) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-body-sm font-semibold text-gray-800">
              Nomor Urut
            </label>
            <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
              Read-Only
            </span>
          </div>

          <input
            type="number"
            disabled
            value={values.urutan || 1}
            className="w-full bg-gray-100 border border-gray-300 px-3.5 py-2.5 rounded-lg text-body-sm font-mono text-gray-500 cursor-not-allowed select-none"
          />

          <div className="mt-2 p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Catatan:</strong> Nomor urut tidak ikut diubah di form ini. Silakan gunakan tombol menu khusus <strong className="underline">"Update No Urut"</strong> pada halaman utama untuk memperbarui urutan seluruh brand secara bersamaan.
            </p>
          </div>
        </div>

        {/* Status Brand */}
        <div>
          <label className="block text-body-sm font-semibold text-gray-800 mb-1.5">
            Status Brand
          </label>
          <select
            value={values.status}
            onChange={(e) => onChange('status', e.target.value)}
            className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-lg text-body-sm text-gray-900 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
          >
            <option value="AKTIF">AKTIF (Dapat digunakan di callsheet & target)</option>
            <option value="NONAKTIF">NONAKTIF (Diarsipkan/tidak muncul di input harian)</option>
          </select>
        </div>
      </form>
    </SlideOver>
  );
};
