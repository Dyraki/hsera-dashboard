import React from 'react';
import { AdminLayout } from '@/presentation/components/layout/AdminLayout';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { Button } from '@/presentation/components/ui/Button';
import { PermissionButton } from '@/presentation/components/ui/PermissionButton';
import { Badge } from '@/presentation/components/ui/Badge';
import { useKaryawan } from './hooks/useKaryawan';
import {
  Users,
  UserPlus,
  Search,
} from 'lucide-react';
import { KaryawanTable } from './components/KaryawanTable';
import { KaryawanFormDrawer } from './components/KaryawanFormDrawer';
import { KaryawanDetailDrawer } from './components/KaryawanDetailDrawer';

export const KaryawanListPage: React.FC = () => {
  const {
    karyawans,
    availableUnits,
    allSupervisors,
    isLoading,
    searchKeyword,
    setSearchKeyword,
    filterUnitId,
    setFilterUnitId,
    filterStatus,
    setFilterStatus,
    page,
    totalPages,
    totalCount,
    isDrawerOpen,
    setIsDrawerOpen,
    isDetailOpen,
    setIsDetailOpen,
    modalMode,
    selectedKaryawan,
    activeTab,
    setActiveTab,
    formValues,
    updateFormValue,
    isSubmitting,
    openCreateModal,
    openEditModal,
    openDetailModal,
    handleSubmit,
    handleDelete,
    handleSearchSubmit,
    fetchKaryawan
  } = useKaryawan();
  const getUnitTypeBadge = (type?: string) => {
    switch (type) {
      case 'HEAD_OFFICE': return <Badge variant="primary">HO</Badge>;
      case 'REGIONAL': return <Badge variant="info">REG</Badge>;
      case 'AREA_OFFICE': return <Badge variant="warning">AREA</Badge>;
      case 'OPERATION_UNIT': return <Badge variant="success">OU</Badge>;
      default: return null;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-950 tracking-tight flex items-center gap-2.5">
              <Users className="text-primary-600" size={26} />
              Master Karyawan
            </h1>
            <p className="text-body-sm text-gray-600 mt-1">
              Kelola data SDM lengkap (32 kolom) terhubung dengan Operation Unit, Atasan, dan Akun Login.
            </p>
          </div>

          <PermissionButton menuId={SYSTEM_MENU_IDS.KARYAWAN} minLevel={2} variant="primary" onClick={openCreateModal}>
            <UserPlus size={16} className="mr-1.5" /> Tambah Karyawan
          </PermissionButton>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
          <form onSubmit={handleSearchSubmit} className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Cari NIK, Nomor Karyawan, Nama, Email, No HP..."
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

          <div className="sm:col-span-4">
            <select
              value={filterUnitId}
              onChange={(e) => setFilterUnitId(e.target.value)}
              className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-md text-body-sm text-gray-900 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            >
              <option value="">Semua Operation Unit</option>
              {availableUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  [{u.code}] {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-md text-body-sm text-gray-900 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
        </div>

        {/* Karyawan Table */}
        <KaryawanTable
          employees={karyawans}
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          getUnitTypeBadge={getUnitTypeBadge}
          onCreate={openCreateModal}
          onOpenDetail={openDetailModal}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onPageChange={fetchKaryawan}
        />

      </div>

      {/* Drawer Create / Edit Form (32 Kolom Terorganisir Tab) */}
      <KaryawanFormDrawer
        isOpen={isDrawerOpen}
        mode={modalMode}
        employee={selectedKaryawan}
        activeTab={activeTab}
        values={formValues}
        units={availableUnits}
        supervisors={allSupervisors}
        isSubmitting={isSubmitting}
        onClose={() => setIsDrawerOpen(false)}
        onTabChange={setActiveTab}
        onChange={updateFormValue}
        onSubmit={handleSubmit}
      />

      {/* Drawer Detail Karyawan */}
      <KaryawanDetailDrawer
        isOpen={isDetailOpen}
        employee={selectedKaryawan}
        onClose={() => setIsDetailOpen(false)}
        onEdit={(employee) => {
          setIsDetailOpen(false);
          openEditModal(employee);
        }}
      />
    </AdminLayout>
  );
};
