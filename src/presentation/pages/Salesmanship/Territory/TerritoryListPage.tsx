import React from 'react';
import { AdminLayout } from '@/presentation/components/layout/AdminLayout';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { Button } from '@/presentation/components/ui/Button';
import { PermissionButton } from '@/presentation/components/ui/PermissionButton';
import { useTerritory } from './hooks/useTerritory';
import { TerritoryTable } from './components/TerritoryTable';
import { TerritoryModal } from './components/TerritoryModal';
import { TerritoryDeleteModal } from './components/TerritoryDeleteModal';
import { MapPin, Plus, Search } from 'lucide-react';

export const TerritoryListPage: React.FC = () => {
  const {
    districts,
    operationUnits,
    salesmen,
    isLoading,
    searchKeyword,
    setSearchKeyword,
    filterOu,
    setFilterOu,
    filterStatus,
    setFilterStatus,
    isModalOpen,
    modalMode,
    formData,
    setFormData,
    isSubmitting,
    isDeleteModalOpen,
    districtToDelete,
    isDeleting,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleSearchSubmit,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  } = useTerritory();

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-950 tracking-tight flex items-center gap-2.5">
              <MapPin className="text-primary-600" size={26} />
              Teritori Management
            </h1>
            <p className="text-body-sm text-gray-600 mt-1">
              Kelola data wilayah (District) terhubung dengan Operation Unit dan penugasan Salesman lapangan.
            </p>
          </div>

          <PermissionButton
            menuId={SYSTEM_MENU_IDS.TERITORY_MANAGEMENT}
            minLevel={2}
            variant="primary"
            onClick={openCreateModal}
          >
            <Plus size={16} className="mr-1.5" /> Tambah Teritori
          </PermissionButton>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
          <form onSubmit={handleSearchSubmit} className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Cari Kode District, Operation Unit, Nama Salesman..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full bg-white border border-gray-300 pl-10 pr-20 py-2.5 rounded-md text-body-sm text-gray-900 placeholder:text-gray-500 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none"
            />
            <Button
              variant="secondary"
              size="sm"
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs py-1"
            >
              Cari
            </Button>
          </form>

          <div className="sm:col-span-3">
            <select
              value={filterOu}
              onChange={(e) => setFilterOu(e.target.value)}
              className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-md text-body-sm text-gray-900 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none"
            >
              <option value="">Semua Operation Unit</option>
              {operationUnits.map((u) => (
                <option key={u.id} value={u.kode}>
                  {u.nama} ({u.kode})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-md text-body-sm text-gray-900 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="AKTIF">Aktif</option>
              <option value="NONAKTIF">Nonaktif</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <TerritoryTable
          districts={districts}
          operationUnits={operationUnits}
          isLoading={isLoading}
          onCreate={openCreateModal}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />

        {/* Form Drawer (SlideOver) */}
        <TerritoryModal
          isOpen={isModalOpen}
          mode={modalMode}
          formData={formData}
          operationUnits={operationUnits}
          salesmen={salesmen}
          isSubmitting={isSubmitting}
          onClose={closeModal}
          onChange={setFormData}
          onSubmit={handleSubmit}
        />

        {/* Modal Delete Confirmation */}
        <TerritoryDeleteModal
          isOpen={isDeleteModalOpen}
          district={districtToDelete}
          isDeleting={isDeleting}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
      </div>
    </AdminLayout>
  );
};
