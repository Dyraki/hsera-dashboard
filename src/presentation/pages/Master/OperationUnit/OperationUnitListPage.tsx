import React from 'react';
import { AdminLayout } from '@/presentation/components/layout/AdminLayout';
import { PermissionButton } from '@/presentation/components/ui/PermissionButton';
import { Badge } from '@/presentation/components/ui/Badge';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { OperationUnitTree } from './components/OperationUnitTree';
import { OperationUnitFormDrawer } from './components/OperationUnitFormDrawer';
import { OperationUnitDetailDrawer } from './components/OperationUnitDetailDrawer';
import { OperationUnitTable } from './components/OperationUnitTable';
import { OperationUnitOverview } from './components/OperationUnitOverview';
import { useOperationUnits } from './hooks/useOperationUnits';
import {
  Building2,
  Search
} from 'lucide-react';

export const OperationUnitListPage: React.FC = () => {
  const {
    treeData,
    flatUnits,
    filteredFlatUnits,
    isLoading,
    viewMode,
    setViewMode,
    searchKeyword,
    setSearchKeyword,
    isDrawerOpen,
    setIsDrawerOpen,
    isDetailOpen,
    setIsDetailOpen,
    modalMode,
    selectedUnit,
    formValues,
    isSubmitting,
    collapsedNodes,
    toggleCollapse,
    openCreateModal,
    openEditModal,
    openDetailModal,
    updateFormValue,
    handleSubmit,
    handleDelete
  } = useOperationUnits();

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'HEAD_OFFICE':
        return <Badge variant="primary">KANTOR PUSAT</Badge>;
      case 'REGIONAL':
        return <Badge variant="info">REGIONAL</Badge>;
      case 'AREA_OFFICE':
        return <Badge variant="warning">AREA OFFICE</Badge>;
      case 'OPERATION_UNIT':
        return <Badge variant="success">OPERATION UNIT</Badge>;
      default:
        return <Badge variant="neutral">{type}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-5 lg:p-8 space-y-6">
        {/* Page Header */}
        <OperationUnitOverview
          units={flatUnits}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onCreate={() => openCreateModal()}
        />

        {/* Search Bar for Flat View */}
        {viewMode === 'flat' && (
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Cari kode, nama unit, atau alamat..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-white border border-gray-300 pl-10 pr-4 py-2 rounded-md text-body-sm text-gray-950 placeholder:text-gray-500 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {/* Content View */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center text-gray-600 space-y-2">
              <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
              <p className="text-body-sm">Memuat struktur organisasi...</p>
            </div>
          ) : viewMode === 'tree' ? (
            treeData.length === 0 ? (
              <div className="p-12 text-center text-gray-600 space-y-2">
                <Building2 size={36} className="mx-auto text-gray-400" />
                <p className="text-body-sm font-medium">Belum ada data unit organisasi.</p>
                <PermissionButton menuId={SYSTEM_MENU_IDS.OPERATION_UNIT} minLevel={2} variant="primary" size="sm" onClick={() => openCreateModal()} className="mt-2">
                  Tambah Unit Pertama
                </PermissionButton>
              </div>
            ) : (
              <OperationUnitTree
                nodes={treeData}
                collapsedNodes={collapsedNodes}
                getTypeBadge={getTypeBadge}
                onToggleCollapse={toggleCollapse}
                onAddSubUnit={openCreateModal}
                onOpenDetail={openDetailModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            )
          ) : (
            // Flat Table View
            <OperationUnitTable
              units={filteredFlatUnits}
              getTypeBadge={getTypeBadge}
              onOpenDetail={openDetailModal}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Drawer Create / Edit */}
      <OperationUnitFormDrawer
        isOpen={isDrawerOpen}
        mode={modalMode}
        selectedUnit={selectedUnit}
        units={flatUnits}
        values={formValues}
        isSubmitting={isSubmitting}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleSubmit}
        onChange={updateFormValue}
      />

      {/* Drawer Detail */}
      <OperationUnitDetailDrawer
        isOpen={isDetailOpen}
        unit={selectedUnit}
        getTypeBadge={getTypeBadge}
        onClose={() => setIsDetailOpen(false)}
        onEdit={(unit) => {
          setIsDetailOpen(false);
          openEditModal(unit);
        }}
      />
    </AdminLayout>
  );
};
