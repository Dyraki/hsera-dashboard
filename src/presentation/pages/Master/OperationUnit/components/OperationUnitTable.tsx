import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';
import { PermissionButton } from '@/presentation/components/ui/PermissionButton';
import { Badge } from '@/presentation/components/ui/Badge';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { OperationUnit } from '../../../../../core/domain/models/OperationUnit';

interface OperationUnitTableProps {
  units: OperationUnit[];
  getTypeBadge: (type: string) => React.ReactNode;
  onOpenDetail: (unit: OperationUnit) => void;
  onEdit: (unit: OperationUnit) => void;
  onDelete: (unit: OperationUnit) => void;
}

export const OperationUnitTable: React.FC<OperationUnitTableProps> = ({
  units,
  getTypeBadge,
  onOpenDetail,
  onEdit,
  onDelete
}) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left text-body-sm">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 text-caption font-semibold">
          <th className="py-3 px-4">KODE</th>
          <th className="py-3 px-4">NAMA UNIT</th>
          <th className="py-3 px-4">TIPE LEVEL</th>
          <th className="py-3 px-4">INDUK (PARENT)</th>
          <th className="py-3 px-4">KATEGORI</th>
          <th className="py-3 px-4">STATUS</th>
          <th className="py-3 px-4 text-right">AKSI</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {units.length === 0 ? (
          <tr>
            <td colSpan={7} className="py-8 text-center text-gray-600">
              Tidak ada unit yang cocok dengan pencarian.
            </td>
          </tr>
        ) : (
          units.map((unit) => (
            <tr key={unit.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 font-mono font-medium text-gray-700">{unit.code}</td>
              <td className="py-3 px-4 font-semibold text-gray-950">{unit.name}</td>
              <td className="py-3 px-4">{getTypeBadge(unit.type)}</td>
              <td className="py-3 px-4 text-gray-600">
                {unit.parentName ? (
                  <span className="flex items-center gap-1 text-xs">
                    <span className="font-mono text-gray-700">{unit.parentCode}</span> - {unit.parentName}
                  </span>
                ) : (
                  <span className="text-gray-500 italic">Pusat / Root</span>
                )}
              </td>
              <td className="py-3 px-4 text-gray-600">{unit.category || '-'}</td>
              <td className="py-3 px-4">
                {unit.status ? <Badge variant="success">Aktif</Badge> : <Badge variant="neutral">Nonaktif</Badge>}
              </td>
              <td className="py-3 px-4 text-right space-x-1">
                <Button variant="ghost" size="sm" onClick={() => onOpenDetail(unit)} title="Lihat Detail" className="p-1.5">
                  <Eye size={15} />
                </Button>
                <PermissionButton menuId={SYSTEM_MENU_IDS.OPERATION_UNIT} minLevel={3} variant="ghost" size="sm" onClick={() => onEdit(unit)} title="Edit Unit" className="p-1.5">
                  <Pencil size={15} />
                </PermissionButton>
                {unit.type !== 'HEAD_OFFICE' && (
                  <PermissionButton menuId={SYSTEM_MENU_IDS.OPERATION_UNIT} minLevel={4} variant="ghost" size="sm" onClick={() => onDelete(unit)} title="Hapus Unit" className="p-1.5 text-error-600 hover:text-error-700 hover:bg-error-50">
                    <Trash2 size={15} />
                  </PermissionButton>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);