import React, { useState, useEffect } from 'react';
import { SlideOver } from '@/presentation/components/ui/SlideOver';
import { Button } from '@/presentation/components/ui/Button';
import { Brand } from '@/core/domain/models/Brand';
import { BrandReorderItem } from '../types';
import {
  ListOrdered,
  Search,
  Sparkles,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface BrandReorderDrawerProps {
  isOpen: boolean;
  brands: Brand[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (orders: { id: string; urutan: number }[]) => Promise<void>;
}

export const BrandReorderDrawer: React.FC<BrandReorderDrawerProps> = ({
  isOpen,
  brands,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [items, setItems] = useState<BrandReorderItem[]>([]);
  const [search, setSearch] = useState('');

  // Initialize items from brands whenever drawer opens or brands change
  useEffect(() => {
    if (isOpen) {
      const sorted = [...brands].sort((a, b) => a.urutan - b.urutan);
      setItems(
        sorted.map((b) => ({
          id: b.id,
          kode: b.kode,
          nama: b.nama,
          kategori: b.kategori,
          currentUrutan: b.urutan,
          newUrutan: b.urutan,
          isChanged: false,
        }))
      );
      setSearch('');
    }
  }, [isOpen, brands]);

  // Handle direct numeric input change on a row
  const handleUrutanChange = (id: string, valStr: string) => {
    const val = parseInt(valStr, 10);
    const newUrutan = isNaN(val) || val < 1 ? 1 : val;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            newUrutan,
            isChanged: newUrutan !== item.currentUrutan,
          };
        }
        return item;
      })
    );
  };

  // Quick helper: Re-number sequentially 1, 2, 3...
  const handleAutoNumber = () => {
    setItems((prev) =>
      prev.map((item, index) => {
        const newUrutan = index + 1;
        return {
          ...item,
          newUrutan,
          isChanged: newUrutan !== item.currentUrutan,
        };
      })
    );
  };

  // Quick helper: Reset back to original database values
  const handleReset = () => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        newUrutan: item.currentUrutan,
        isChanged: false,
      }))
    );
  };

  // Quick helper: Move item up in the list (swap urutan)
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setItems((prev) => {
      const next = [...prev];
      const current = next[index];
      const above = next[index - 1];

      // Swap newUrutan
      const temp = current.newUrutan;
      current.newUrutan = above.newUrutan;
      above.newUrutan = temp;

      // Update isChanged
      current.isChanged = current.newUrutan !== current.currentUrutan;
      above.isChanged = above.newUrutan !== above.currentUrutan;

      // Swap positions in array
      next[index] = above;
      next[index - 1] = current;

      return next;
    });
  };

  // Quick helper: Move item down in the list (swap urutan)
  const handleMoveDown = (index: number) => {
    if (index >= items.length - 1) return;
    setItems((prev) => {
      const next = [...prev];
      const current = next[index];
      const below = next[index + 1];

      // Swap newUrutan
      const temp = current.newUrutan;
      current.newUrutan = below.newUrutan;
      below.newUrutan = temp;

      // Update isChanged
      current.isChanged = current.newUrutan !== current.currentUrutan;
      below.isChanged = below.newUrutan !== below.currentUrutan;

      // Swap positions in array
      next[index] = below;
      next[index + 1] = current;

      return next;
    });
  };

  // Sort list ascending by newUrutan
  const handleSortByNewUrutan = () => {
    setItems((prev) => [...prev].sort((a, b) => a.newUrutan - b.newUrutan));
  };

  // Check for duplicate sequence numbers
  const urutanCounts = items.reduce<Record<number, number>>((acc, item) => {
    acc[item.newUrutan] = (acc[item.newUrutan] || 0) + 1;
    return acc;
  }, {});

  const hasDuplicates = Object.values(urutanCounts).some((count) => count > 1);
  const changedCount = items.filter((i) => i.isChanged).length;

  // Filter items based on search query
  const filteredItems = items.filter(
    (item) =>
      item.kode.toLowerCase().includes(search.toLowerCase()) ||
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kategori.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const orders = items.map((i) => ({
      id: i.id,
      urutan: i.newUrutan,
    }));
    await onSubmit(orders);
  };

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Update Nomor Urut Brand"
      subtitle="Perbarui nomor urut brand secara bersamaan (batch). Urutan menentukan prioritas pada form Callsheet dan Matriks Monitoring."
      icon={<ListOrdered size={20} />}
      width="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs">
            {changedCount > 0 ? (
              <span className="flex items-center gap-1.5 text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <CheckCircle2 size={14} className="text-amber-600" />
                {changedCount} brand diubah
              </span>
            ) : (
              <span className="text-gray-500">Belum ada perubahan urutan</span>
            )}

            {hasDuplicates && (
              <span className="flex items-center gap-1.5 text-rose-700 font-semibold bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                <AlertTriangle size={14} className="text-rose-600" />
                Ada nomor urut kembar
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
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
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={changedCount === 0 && !hasDuplicates}
            >
              Simpan Nomor Urut
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Quick Instructions & Hint */}
        <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl text-blue-900 text-xs flex items-start gap-2.5">
          <HelpCircle size={17} className="text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed space-y-1">
            <p>
              <strong>Cara Kerja Mode Cepat:</strong> Anda dapat langsung mengetik nomor urut baru pada kolom input di setiap baris, atau gunakan tombol panah (▲ / ▼) untuk menggeser posisi brand.
            </p>
          </div>
        </div>

        {/* Toolbar: Search & Quick Automation Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari kode atau nama brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleAutoNumber}
              title="Urutkan otomatis 1 sampai N"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <Sparkles size={13} className="text-amber-500" />
              Auto 1..N
            </button>

            <button
              type="button"
              onClick={handleSortByNewUrutan}
              title="Urutkan tampilan tabel berdasarkan nilai urutan saat ini"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              Susun Tampilan
            </button>

            <button
              type="button"
              onClick={handleReset}
              title="Kembalikan semua nilai ke semula"
              className="inline-flex items-center gap-1 px-2 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          </div>
        </div>

        {/* Quick Stock Opname Style Table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <div className="max-h-[55vh] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/90 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold sticky top-0 z-10 backdrop-blur-xs">
                <tr>
                  <th className="px-3.5 py-2.5 w-16 text-center">Urutan Lama</th>
                  <th className="px-3.5 py-2.5">Brand</th>
                  <th className="px-3.5 py-2.5 w-32 text-center">Urutan Baru</th>
                  <th className="px-3 py-2.5 w-20 text-center">Geser</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                      Tidak ada brand yang cocok dengan kata kunci pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const originalIndex = items.findIndex((i) => i.id === item.id);
                    const isDuplicate = urutanCounts[item.newUrutan] > 1;

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          item.isChanged
                            ? 'bg-amber-50/40 hover:bg-amber-50/70'
                            : 'hover:bg-gray-50/80'
                        }`}
                      >
                        {/* Posisi Awal */}
                        <td className="px-3.5 py-2.5 text-center">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gray-100 text-gray-600 font-mono font-semibold text-xs border border-gray-200">
                            {item.currentUrutan}
                          </span>
                        </td>

                        {/* Brand Info */}
                        <td className="px-3.5 py-2.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded text-[11px] shrink-0 border border-gray-200/80">
                              {item.kode}
                            </span>
                            <span className="font-semibold text-gray-800 truncate">
                              {item.nama}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 px-1 py-0.5 rounded border border-gray-200/60 shrink-0">
                              {item.kategori}
                            </span>
                          </div>
                        </td>

                        {/* Nomor Urut Baru (Input Box seperti Quick Stok Opname) */}
                        <td className="px-3.5 py-2.5 text-center">
                          <div className="relative inline-flex items-center justify-center">
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={item.newUrutan}
                              onChange={(e) =>
                                handleUrutanChange(item.id, e.target.value)
                              }
                              className={`w-20 px-2.5 py-1.5 text-center font-mono font-bold text-xs rounded-lg border outline-none transition-all ${
                                isDuplicate
                                  ? 'border-rose-400 bg-rose-50 text-rose-700 focus:ring-2 focus:ring-rose-200'
                                  : item.isChanged
                                  ? 'border-amber-400 bg-amber-50 text-amber-900 focus:ring-2 focus:ring-amber-200'
                                  : 'border-gray-300 bg-white text-gray-900 focus:border-primary-600 focus:ring-2 focus:ring-primary-100'
                              }`}
                            />
                            {item.isChanged && (
                              <span
                                title="Nilai diubah"
                                className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"
                              />
                            )}
                          </div>
                        </td>

                        {/* Tombol Geser Atas / Bawah */}
                        <td className="px-3 py-2.5 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveUp(originalIndex)}
                              disabled={originalIndex === 0}
                              title="Pindahkan ke atas"
                              className="p-1 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                            >
                              <ArrowUp size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveDown(originalIndex)}
                              disabled={originalIndex === items.length - 1}
                              title="Pindahkan ke bawah"
                              className="p-1 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                            >
                              <ArrowDown size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SlideOver>
  );
};
