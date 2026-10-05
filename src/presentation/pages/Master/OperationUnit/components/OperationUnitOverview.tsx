import React from 'react';
import { Building2, GitFork, Layers, Plus } from 'lucide-react';
import { PermissionButton } from '@/presentation/components/ui/PermissionButton';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { OperationUnit } from '../../../../../core/domain/models/OperationUnit';

type ViewMode = 'tree' | 'flat';

interface OperationUnitOverviewProps {
  units: OperationUnit[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onCreate: () => void;
}

export const OperationUnitOverview: React.FC<OperationUnitOverviewProps> = ({
  units,
  viewMode,
  onViewModeChange,
  onCreate
}) => (
  <>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-950 tracking-tight flex items-center gap-2.5">
          <Building2 className="text-primary-600" size={26} />
          Master Operation Unit
        </h1>
        <p className="text-body-sm text-gray-600 mt-1">
          Hierarki Organisasi Enterprise: Head Office ➔ Regional ➔ Area Office ➔ Cabang & Gudang.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="bg-gray-100 border border-gray-200 p-1 rounded-lg flex items-center">
          <button
            type="button"
            onClick={() => onViewModeChange('tree')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${viewMode === 'tree' ? 'bg-primary-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-950'}`}
          >
            <GitFork size={13} /> Hierarki Pohon
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('flat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${viewMode === 'flat' ? 'bg-primary-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-950'}`}
          >
            <Layers size={13} /> Tabel Datar
          </button>
        </div>

        <PermissionButton menuId={SYSTEM_MENU_IDS.OPERATION_UNIT} minLevel={2} variant="primary" onClick={onCreate} className="shrink-0 whitespace-nowrap">
          <Plus size={16} className="mr-1.5" /> Tambah Unit
        </PermissionButton>
      </div>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Metric label="Total Kantor & Unit" value={units.length} />
      <Metric label="Regional" value={units.filter((unit) => unit.type === 'REGIONAL').length} color="text-info-600" />
      <Metric label="Area Office" value={units.filter((unit) => unit.type === 'AREA_OFFICE').length} color="text-warning-600" />
      <Metric label="Cabang & Gudang" value={units.filter((unit) => unit.type === 'OPERATION_UNIT').length} color="text-success-600" />
    </div>
  </>
);

const Metric: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color = 'text-gray-600' }) => (
  <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
    <span className={`text-caption ${color}`}>{label}</span>
    <div className="text-2xl font-bold text-gray-950 mt-1">{value}</div>
  </div>
);