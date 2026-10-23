import React from 'react';
import { Brand } from '@/core/domain/models/Brand';
import { Badge } from '@/presentation/components/ui/Badge';
import { PermissionButton } from '@/presentation/components/ui/PermissionButton';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { Edit2, Trash2, Tag, ArrowUpDown } from 'lucide-react';

interface BrandTableProps {
  brands: Brand[];
  isLoading: boolean;
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
  onOpenReorder: () => void;
}

export const BrandTable: React.FC<BrandTableProps> = ({
  brands,
  isLoading,
  onEdit,
  onDelete,
  onOpenReorder,
}) => {
  const getCategoryBadge = (kategori: string) => {
    const k = kategori.toUpperCase();
    if (k === 'SKM FF') return <Badge variant="primary">SKM FF</Badge>;
    if (k === 'SKM LTLN') return <Badge variant="info">SKM LTLN</Badge>;
    if (k === 'SKT') return <Badge variant="warning">SKT</Badge>;
    if (k === 'SPM') return <Badge variant="success">SPM</Badge>;
    if (k === 'SPT') return <Badge variant="primary">SPT</Badge>;
    if (k === 'SKTF') return <Badge variant="warning">SKTF</Badge>;
    return <Badge variant="neutral">{kategori}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'AKTIF') return <Badge variant="success">AKTIF</Badge>;
    return <Badge variant="error">NONAKTIF</Badge>;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-body-sm text-gray-700">
          <thead className="bg-gray-50/80 border-b border-gray-200 text-caption font-semibold text-gray-500 uppercase tracking-wider select-none">
            <tr>
              <th scope="col" className="px-5 py-3.5 w-24 text-center">
                <span className="inline-flex items-center gap-1">
                  No Urut
                  <ArrowUpDown size={12} className="text-gray-400" />
                </span>
              </th>
              <th scope="col" className="px-5 py-3.5 w-48">
                Kode Brand
              </th>
              <th scope="col" className="px-5 py-3.5">
                Nama Brand
              </th>
              <th scope="col" className="px-5 py-3.5 w-36">
                Kategori
              </th>
              <th scope="col" className="px-5 py-3.5 w-32">
                Status
              </th>
              <th scope="col" className="px-5 py-3.5 w-32 text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-5 py-4 text-center">
                    <div className="h-5 w-8 bg-gray-200 rounded-md mx-auto" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-5 w-28 bg-gray-200 rounded-md" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-5 w-44 bg-gray-200 rounded-md" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-5 w-16 bg-gray-200 rounded-md" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-5 w-16 bg-gray-200 rounded-md" />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="h-8 w-16 bg-gray-200 rounded-md ml-auto" />
                  </td>
                </tr>
              ))
            ) : brands.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={6} className="px-6 py-14 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
                      <Tag size={22} />
                    </div>
                    <p className="font-semibold text-gray-900 text-body">Tidak ada data brand</p>
                    <p className="text-caption text-gray-500 mt-1">
                      Belum ada brand yang sesuai dengan filter pencarian.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              brands.map((brand) => (
                <tr
                  key={brand.id}
                  className="hover:bg-gray-50/70 transition-colors group"
                >
                  {/* Nomor Urut */}
                  <td className="px-5 py-3.5 text-center font-bold">
                    <button
                      type="button"
                      onClick={onOpenReorder}
                      title="Klik untuk membuka Update No Urut"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-800 font-mono text-xs font-semibold hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer border border-gray-200 hover:border-primary-300"
                    >
                      {brand.urutan}
                    </button>
                  </td>

                  {/* Kode Brand */}
                  <td className="px-5 py-3.5">
                    <span className="font-mono font-bold text-xs bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md border border-gray-200/80">
                      {brand.kode}
                    </span>
                  </td>

                  {/* Nama Brand */}
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-gray-900 leading-snug">
                      {brand.nama}
                    </div>
                  </td>

                  {/* Kategori */}
                  <td className="px-5 py-3.5">
                    {getCategoryBadge(brand.kategori)}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    {getStatusBadge(brand.status)}
                  </td>

                  {/* Aksi */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <PermissionButton
                        menuId={SYSTEM_MENU_IDS.BRAND}
                        minLevel={3}
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(brand)}
                        title="Edit brand"
                        aria-label={`Edit ${brand.nama}`}
                        className="px-2 py-1 h-8"
                      >
                        <Edit2 size={14} className="text-gray-600" />
                      </PermissionButton>

                      <PermissionButton
                        menuId={SYSTEM_MENU_IDS.BRAND}
                        minLevel={4}
                        variant="secondary"
                        size="sm"
                        onClick={() => onDelete(brand)}
                        title="Hapus brand"
                        aria-label={`Hapus ${brand.nama}`}
                        className="px-2 py-1 h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 size={14} />
                      </PermissionButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      {!isLoading && brands.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50/60 flex items-center justify-between text-caption text-gray-500">
          <span>
            Menampilkan <strong className="text-gray-700 font-semibold">{brands.length}</strong> brand
          </span>
          <span className="text-gray-400">
            Diurutkan berdasarkan kolom No Urut
          </span>
        </div>
      )}
    </div>
  );
};
