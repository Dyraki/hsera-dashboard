import React from 'react';
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Globe,
  Home,
  Layers,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  Eye
} from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';
import { PermissionButton } from '@/presentation/components/ui/PermissionButton';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { OperationUnit } from '../../../../../core/domain/models/OperationUnit';

interface OperationUnitTreeProps {
  nodes: OperationUnit[];
  collapsedNodes: Record<string, boolean>;
  getTypeBadge: (type: string) => React.ReactNode;
  onToggleCollapse: (nodeId: string) => void;
  onAddSubUnit: (parentId: string) => void;
  onOpenDetail: (unit: OperationUnit) => void;
  onEdit: (unit: OperationUnit) => void;
  onDelete: (unit: OperationUnit) => void;
}

export const OperationUnitTree: React.FC<OperationUnitTreeProps> = ({
  nodes,
  collapsedNodes,
  getTypeBadge,
  onToggleCollapse,
  onAddSubUnit,
  onOpenDetail,
  onEdit,
  onDelete
}) => {
  const renderNode = (node: OperationUnit, level: number): React.ReactNode => {
    const isCollapsed = collapsedNodes[node.id];
    const hasChildren = Boolean(node.children?.length);

    return (
      <div key={node.id} className="relative group">
        <div
          className={`flex items-center justify-between gap-4 p-3.5 my-1.5 rounded-lg border bg-white transition-colors ${level === 0
            ? 'border-primary-200 shadow-sm hover:border-primary-400'
            : level === 1
              ? 'border-sky-200 hover:border-sky-400 ml-6'
              : level === 2
                ? 'border-amber-200 hover:border-amber-400 ml-12'
                : 'border-gray-200 hover:border-gray-400 ml-16'
            }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            {hasChildren ? (
              <button
                type="button"
                onClick={() => onToggleCollapse(node.id)}
                className="p-1 rounded-md text-gray-600 hover:text-gray-950 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label={isCollapsed ? 'Buka unit turunan' : 'Tutup unit turunan'}
              >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
              </button>
            ) : (
              <div className="w-6 flex items-center justify-center text-gray-400">•</div>
            )}

            <div className="flex items-center gap-2.5 min-w-0">
              {node.type === 'HEAD_OFFICE' && <Building2 size={18} className="text-primary-600 shrink-0" />}
              {node.type === 'REGIONAL' && <Globe size={18} className="text-info-600 shrink-0" />}
              {node.type === 'AREA_OFFICE' && <Layers size={18} className="text-warning-600 shrink-0" />}
              {node.type === 'OPERATION_UNIT' && <Home size={18} className="text-success-600 shrink-0" />}

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-950 text-body-sm truncate">{node.name}</span>
                  <span className="text-[11px] font-mono text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                    {node.code}
                  </span>
                  {getTypeBadge(node.type)}
                  {!node.status && <span className="text-xs text-error-700">NONAKTIF</span>}
                </div>
                {node.address && (
                  <p className="text-caption text-gray-600 truncate mt-0.5 flex items-center gap-1">
                    <MapPin size={11} className="text-gray-500" /> {node.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {node.type !== 'OPERATION_UNIT' && (
              <PermissionButton
                menuId={SYSTEM_MENU_IDS.OPERATION_UNIT}
                minLevel={2}
                variant="outline"
                size="sm"
                onClick={() => onAddSubUnit(node.id)}
                title="Tambah Sub-Unit di bawah unit ini"
                className="min-w-[96px] whitespace-nowrap text-xs py-1 px-2.5"
              >
                <Plus size={13} className="mr-1" /> Sub-Unit
              </PermissionButton>
            )}
            <Button variant="ghost" size="sm" onClick={() => onOpenDetail(node)} title="Lihat Detail" className="text-gray-600 hover:text-gray-950 p-1.5">
              <Eye size={15} />
            </Button>
            <PermissionButton menuId={SYSTEM_MENU_IDS.OPERATION_UNIT} minLevel={3} variant="ghost" size="sm" onClick={() => onEdit(node)} title="Edit Unit" className="text-gray-600 hover:text-primary-700 p-1.5">
              <Pencil size={15} />
            </PermissionButton>
            {node.type !== 'HEAD_OFFICE' && (
              <PermissionButton menuId={SYSTEM_MENU_IDS.OPERATION_UNIT} minLevel={4} variant="ghost" size="sm" onClick={() => onDelete(node)} title="Hapus Unit" className="text-error-600 hover:text-error-700 hover:bg-error-50 p-1.5">
                <Trash2 size={15} />
              </PermissionButton>
            )}
          </div>
        </div>

        {hasChildren && !isCollapsed && (
          <div className="space-y-1">
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return <div className="space-y-2">{nodes.map((node) => renderNode(node, 0))}</div>;
};