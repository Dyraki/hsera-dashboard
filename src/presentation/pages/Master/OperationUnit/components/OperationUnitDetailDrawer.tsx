import React from 'react';
import { Pencil } from 'lucide-react';
import { PermissionButton } from '@/presentation/components/ui/PermissionButton';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { SlideOver } from '@/presentation/components/ui/SlideOver';
import { OperationUnit } from '../../../../../core/domain/models/OperationUnit';

interface OperationUnitDetailDrawerProps {
  isOpen: boolean;
  unit: OperationUnit | null;
  getTypeBadge: (type: string) => React.ReactNode;
  onClose: () => void;
  onEdit: (unit: OperationUnit) => void;
}

export const OperationUnitDetailDrawer: React.FC<OperationUnitDetailDrawerProps> = ({
  isOpen,
  unit,
  getTypeBadge,
  onClose,
  onEdit
}) => (
  <SlideOver
    isOpen={isOpen}
    onClose={onClose}
    title={unit ? `${unit.name} (${unit.code})` : 'Detail Unit'}
  >
    {unit && (
      <div className="p-5 sm:p-6 space-y-6">
        <div className="p-4 bg-primary-50 border border-primary-100 rounded-lg space-y-1.5">
          <span className="text-caption text-primary-700 font-semibold uppercase tracking-wider block">
            Silsilah Hierarki (Lineage)
          </span>
          <p className="text-body-sm text-gray-900 font-medium">
            {unit.lineage?.breadcrumb || unit.name}
          </p>
        </div>

        <dl className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <dt className="text-body-sm text-gray-600">Tipe Level</dt>
            <dd>{getTypeBadge(unit.type)}</dd>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <dt className="text-body-sm text-gray-600">Kode Unit</dt>
            <dd className="font-mono text-gray-900">{unit.code}</dd>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <dt className="text-body-sm text-gray-600">Kategori</dt>
            <dd className="text-gray-900">{unit.category || '-'}</dd>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <dt className="text-body-sm text-gray-600">Titik Distribusi</dt>
            <dd className="text-gray-900">{unit.distributionPoint || '-'}</dd>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <dt className="text-body-sm text-gray-600">No. Telepon</dt>
            <dd className="text-gray-900">{unit.phone || '-'}</dd>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <dt className="text-body-sm text-gray-600">Koordinat GPS</dt>
            <dd className="font-mono text-gray-900 text-xs">
              {unit.latitude !== null && unit.latitude !== undefined
                ? `${unit.latitude}, ${unit.longitude ?? '-'}`
                : '-'}
            </dd>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <dt className="text-body-sm text-gray-600">Status Bangunan</dt>
            <dd className="text-gray-900">{unit.buildingStatus || '-'}</dd>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <dt className="text-body-sm text-gray-600">Sewa Tahunan</dt>
            <dd className="text-gray-900">
              {unit.annualRent ? `Rp ${unit.annualRent.toLocaleString('id-ID')}` : '-'}
            </dd>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <dt className="text-body-sm text-gray-600">Status Operasional</dt>
            <dd>{unit.status ? <span className="text-success-600">Aktif Beroperasi</span> : <span className="text-gray-600">Nonaktif</span>}</dd>
          </div>
        </dl>

        <div className="pt-4 border-t border-gray-200 flex justify-end">
          <PermissionButton menuId={SYSTEM_MENU_IDS.OPERATION_UNIT} minLevel={3} variant="secondary" onClick={() => onEdit(unit)}>
            <Pencil size={15} className="mr-1.5" /> Edit Unit Ini
          </PermissionButton>
        </div>
      </div>
    )}
  </SlideOver>
);