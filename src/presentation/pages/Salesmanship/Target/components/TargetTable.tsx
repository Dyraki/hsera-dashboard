import React from 'react';
import { Target, JenisTarget } from '@/core/domain/models/Target';
import { Badge } from '@/presentation/components/ui/Badge';
import { PermissionButton } from '@/presentation/components/ui/PermissionButton';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { Target as TargetIcon, Pencil, Trash2, Globe, Calendar, MapPin } from 'lucide-react';
import { getHariLabel } from '../types';

interface TargetTableProps {
  targets: Target[];
  isLoading: boolean;
  onCreate: () => void;
  onEdit: (target: Target) => void;
  onDelete: (target: Target) => void;
}

export const TargetTable: React.FC<TargetTableProps> = ({
  targets,
  isLoading,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const getBadgeVariant = (jenis: JenisTarget) => {
    switch (jenis) {
      case 'KUNJUNGAN':
        return 'primary';
      case 'BD':
        return 'warning';
      case 'EC':
        return 'success';
      case 'FACEUP':
        return 'info';
      case 'VOLUME':
        return 'gold';
      default:
        return 'neutral';
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-body-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600 text-caption font-semibold bg-gray-50 uppercase tracking-wider">
              <th className="py-3.5 px-5">Jenis Target</th>
              <th className="py-3.5 px-4">Cakupan Teritori</th>
              <th className="py-3.5 px-4">Hari Kunjungan</th>
              <th className="py-3.5 px-4 text-center">Nilai Target</th>
              <th className="py-3.5 px-4">Periode Berlaku</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-500">
                  <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto" />
                  <p className="text-body-sm mt-2 font-medium">Memuat data target salesmanship...</p>
                </td>
              </tr>
            ) : targets.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-500">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                    <TargetIcon size={24} />
                  </div>
                  <p className="text-body-sm font-semibold text-gray-800 mt-3">Tidak ada target ditemukan.</p>
                  <p className="text-caption text-gray-400 mt-0.5">
                    Mulai dengan menambahkan target baru untuk kunjungan, BD, atau EC.
                  </p>
                  <PermissionButton
                    menuId={SYSTEM_MENU_IDS.SETUP_TARGET}
                    minLevel={2}
                    variant="primary"
                    size="sm"
                    onClick={onCreate}
                    className="mt-3.5"
                  >
                    Tambah Target Baru
                  </PermissionButton>
                </td>
              </tr>
            ) : (
              targets.map((t) => {
                const isAktif = t.status === 'AKTIF';
                return (
                  <tr key={t.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Jenis Target */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <Badge variant={getBadgeVariant(t.jenisTarget)} size="sm">
                          {t.jenisTarget}
                        </Badge>
                      </div>
                    </td>

                    {/* Cakupan Teritori */}
                    <td className="py-4 px-4">
                      {t.districtKode ? (
                        <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                          <MapPin size={15} className="text-primary-600 shrink-0" />
                          <span className="font-mono font-semibold bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-xs">
                            {t.districtKode}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Globe size={15} className="text-gray-400 shrink-0" />
                          <span className="text-xs font-semibold text-gray-600">Global (Semua District)</span>
                        </div>
                      )}
                    </td>

                    {/* Hari Kunjungan */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400 shrink-0" />
                        <span className="text-body-sm text-gray-700">
                          {getHariLabel(t.hariKunjungan)}
                        </span>
                      </div>
                    </td>

                    {/* Nilai Target */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-baseline gap-1 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
                        <span className="font-mono font-bold text-gray-900 text-base">
                          {Number(t.nilai).toLocaleString('id-ID')}
                        </span>
                        <span className="text-[11px] font-medium text-gray-500 uppercase">
                          {t.jenisTarget === 'KUNJUNGAN' ? 'toko' : t.jenisTarget === 'VOLUME' ? 'slop' : 'outlet'}
                        </span>
                      </div>
                    </td>

                    {/* Periode Berlaku */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5 text-caption">
                        <div className="text-gray-900 font-medium">
                          Mulai: <span className="font-mono">{formatDate(t.berlakuDari)}</span>
                        </div>
                        <div className="text-gray-500">
                          Sampai: <span className="font-mono">{t.berlakuSampai ? formatDate(t.berlakuSampai) : 'Seterusnya'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <Badge variant={isAktif ? 'success' : 'neutral'} dot size="sm">
                        {isAktif ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </td>

                    {/* Aksi */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <PermissionButton
                          menuId={SYSTEM_MENU_IDS.SETUP_TARGET}
                          minLevel={3}
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(t)}
                          title="Edit Target"
                          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                          <Pencil size={15} />
                        </PermissionButton>
                        <PermissionButton
                          menuId={SYSTEM_MENU_IDS.SETUP_TARGET}
                          minLevel={4}
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(t)}
                          title="Hapus Target"
                          className="p-1.5 text-error-600 hover:text-error-700 hover:bg-error-50"
                        >
                          <Trash2 size={15} />
                        </PermissionButton>
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
  );
};
