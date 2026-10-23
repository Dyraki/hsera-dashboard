import React from 'react';
import { District, OperationUnitOption } from '@/core/domain/models/District';
import { Badge } from '@/presentation/components/ui/Badge';
import { PermissionButton } from '@/presentation/components/ui/PermissionButton';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { MapPin, Pencil, Trash2 } from 'lucide-react';

interface TerritoryTableProps {
  districts: District[];
  operationUnits: OperationUnitOption[];
  isLoading: boolean;
  onCreate: () => void;
  onEdit: (district: District) => void;
  onDelete: (district: District) => void;
}

export const TerritoryTable: React.FC<TerritoryTableProps> = ({
  districts,
  operationUnits,
  isLoading,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const getOuName = (ouKode: string) => {
    const found = operationUnits.find((u) => u.kode === ouKode);
    return found ? found.nama : ouKode;
  };

  const formatDate = (dateString?: string) => {
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

  const getChannelBadgeClass = (channelKode: string) => {
    switch (channelKode.toUpperCase()) {
      case 'AGEN':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'WHOLESALE':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'RETAIL':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'MTI':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-body-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600 text-caption font-semibold bg-gray-50">
              <th className="py-3.5 px-4">KODE TERITORI</th>
              <th className="py-3.5 px-4">OPERATION UNIT</th>
              <th className="py-3.5 px-4">SALESMAN LAPANGAN</th>
              <th className="py-3.5 px-4">CHANNEL</th>
              <th className="py-3.5 px-4">TERAKHIR DIUBAH</th>
              <th className="py-3.5 px-4">STATUS</th>
              <th className="py-3.5 px-4 text-right">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-600">
                  <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
                  <p className="text-body-sm mt-2">Memuat data teritori...</p>
                </td>
              </tr>
            ) : districts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-600">
                  <MapPin size={36} className="mx-auto text-gray-400" />
                  <p className="text-body-sm font-medium mt-2">Tidak ada data teritori ditemukan.</p>
                  <PermissionButton
                    menuId={SYSTEM_MENU_IDS.TERITORY_MANAGEMENT}
                    minLevel={2}
                    variant="primary"
                    size="sm"
                    onClick={onCreate}
                    className="mt-2"
                  >
                    Tambah Teritori Baru
                  </PermissionButton>
                </td>
              </tr>
            ) : (
              districts.map((d) => {
                const isAktif = d.status === 'AKTIF';
                return (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-red-700 flex items-center justify-center text-white font-bold text-xs uppercase shrink-0 shadow-xs">
                          {d.kode.substring(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-950 font-mono">{d.kode}</div>
                          <div className="text-caption text-gray-600">Teritori District</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="font-medium text-gray-900">{getOuName(d.ouKode)}</div>
                        <span className="font-mono text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-100 px-1.5 py-0.5 rounded">
                          {d.ouKode}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="font-medium text-gray-900">{d.karyawanName || d.karyawanId}</div>
                        <div className="text-caption text-gray-600 font-mono">ID: {d.karyawanId}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {d.channels && d.channels.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                          {d.channels.map((ch) => (
                            <span
                              key={ch.id}
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getChannelBadgeClass(
                                ch.kode
                              )}`}
                            >
                              {ch.nama}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">- Belum diatur -</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">
                      <span className="text-body-sm">{formatDate(d.updatedAt || d.createdAt)}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {isAktif ? <Badge variant="success">Aktif</Badge> : <Badge variant="neutral">Nonaktif</Badge>}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <PermissionButton
                        menuId={SYSTEM_MENU_IDS.TERITORY_MANAGEMENT}
                        minLevel={3}
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(d)}
                        title="Edit Teritori"
                        className="p-1.5"
                      >
                        <Pencil size={15} />
                      </PermissionButton>
                      <PermissionButton
                        menuId={SYSTEM_MENU_IDS.TERITORY_MANAGEMENT}
                        minLevel={4}
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(d)}
                        title="Hapus Teritori"
                        className="p-1.5 text-error-600 hover:text-error-700 hover:bg-error-50"
                      >
                        <Trash2 size={15} />
                      </PermissionButton>
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
