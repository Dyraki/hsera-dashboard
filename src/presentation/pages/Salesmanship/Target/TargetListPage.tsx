import React from 'react';
import { AdminLayout } from '@/presentation/components/layout/AdminLayout';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { PermissionButton } from '@/presentation/components/ui/PermissionButton';
import { useTarget } from './hooks/useTarget';
import { TargetTable } from './components/TargetTable';
import { TargetDrawer } from './components/TargetDrawer';
import { TargetDeleteModal } from './components/TargetDeleteModal';
import { Target, Plus, Search, Activity, Users, ShoppingBag } from 'lucide-react';

export const TargetListPage: React.FC = () => {
  const {
    targets,
    rawTargetsCount,
    districts,
    operationUnits,
    isSuperAdmin,
    isLoading,
    filterOu,
    setFilterOu,
    filterJenis,
    setFilterJenis,
    filterDistrict,
    setFilterDistrict,
    filterStatus,
    setFilterStatus,
    searchKeyword,
    setSearchKeyword,
    isDrawerOpen,
    drawerMode,
    formData,
    setFormData,
    formError,
    isSubmitting,
    isDeleteModalOpen,
    targetToDelete,
    isDeleting,
    openCreateDrawer,
    openEditDrawer,
    closeDrawer,
    handleSubmit,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  } = useTarget();

  // Summary counts
  const countKunjungan = targets.filter((t) => t.jenisTarget === 'KUNJUNGAN').length;
  const countBd = targets.filter((t) => t.jenisTarget === 'BD').length;
  const countEc = targets.filter((t) => t.jenisTarget === 'EC').length;

  const filteredDistricts = filterOu !== 'all'
    ? districts.filter((d) => d.ouKode === filterOu)
    : districts;

  const handleOuFilterChange = (val: string) => {
    setFilterOu(val);
    setFilterDistrict('all');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600 border border-primary-100 shadow-2xs">
              <Target size={24} />
            </div>
            <div>
              <h1 className="text-h3 font-bold text-gray-900 tracking-tight">
                Setup Target Salesmanship
              </h1>
              <p className="text-body-sm text-gray-500 mt-0.5">
                Konfigurasi acuan target harian salesmen: Kunjungan Toko, Brand Distribution (BD), Effective Call (EC), dan Volume Penjualan.
              </p>
            </div>
          </div>

          <PermissionButton
            menuId={SYSTEM_MENU_IDS.SETUP_TARGET}
            minLevel={2}
            variant="primary"
            size="md"
            onClick={openCreateDrawer}
            leftIcon={<Plus size={16} />}
          >
            Tambah Target
          </PermissionButton>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-caption font-semibold uppercase tracking-wider">Total Target</span>
              <Target size={18} className="text-primary-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-gray-900 mt-2">
              {rawTargetsCount}
            </div>
            <span className="text-[11px] text-gray-500 mt-0.5 block">Konfigurasi terdaftar</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-caption font-semibold uppercase tracking-wider">Target Kunjungan</span>
              <Users size={18} className="text-red-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-red-600 mt-2">
              {countKunjungan}
            </div>
            <span className="text-[11px] text-gray-500 mt-0.5 block">Target kunjungan toko</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-caption font-semibold uppercase tracking-wider">Target BD</span>
              <ShoppingBag size={18} className="text-amber-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-600 mt-2">
              {countBd}
            </div>
            <span className="text-[11px] text-gray-500 mt-0.5 block">Brand Distribution</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-caption font-semibold uppercase tracking-wider">Target EC</span>
              <Activity size={18} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-600 mt-2">
              {countEc}
            </div>
            <span className="text-[11px] text-gray-500 mt-0.5 block">Effective Call transaksi</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white border border-gray-200 p-4 rounded-xl shadow-2xs">
          <div className="sm:col-span-3 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Cari target, unit, district..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full bg-white border border-gray-300 pl-10 pr-4 py-2 rounded-lg text-body-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterOu}
              onChange={(e) => handleOuFilterChange(e.target.value)}
              disabled={!isSuperAdmin && operationUnits.length <= 1}
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded-lg text-body-sm text-gray-900 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none cursor-pointer disabled:bg-gray-100 disabled:text-gray-500"
            >
              {(isSuperAdmin || operationUnits.length > 1) && (
                <option value="all">Semua Operation Unit</option>
              )}
              {operationUnits.map((ou) => (
                <option key={ou.id} value={ou.kode}>
                  {ou.kode} - {ou.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded-lg text-body-sm text-gray-900 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none cursor-pointer"
            >
              <option value="all">Semua Jenis Target</option>
              <option value="KUNJUNGAN">KUNJUNGAN</option>
              <option value="BD">BD (Brand Distribution)</option>
              <option value="EC">EC (Effective Call)</option>
              <option value="FACEUP">FACEUP</option>
              <option value="VOLUME">VOLUME</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded-lg text-body-sm text-gray-900 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none cursor-pointer"
            >
              <option value="all">Semua Cakupan</option>
              <option value="">{filterOu !== 'all' ? `Target Unit (${filterOu})` : 'Global (Tanpa District)'}</option>
              {filteredDistricts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.kode} {d.karyawanName ? `- ${d.karyawanName}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded-lg text-body-sm text-gray-900 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="AKTIF">Aktif</option>
              <option value="NONAKTIF">Nonaktif</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <TargetTable
          targets={targets}
          isLoading={isLoading}
          onCreate={openCreateDrawer}
          onEdit={openEditDrawer}
          onDelete={openDeleteModal}
        />

        {/* Slide-over Drawer Form */}
        <TargetDrawer
          isOpen={isDrawerOpen}
          mode={drawerMode}
          formData={formData}
          formError={formError}
          districts={districts}
          operationUnits={operationUnits}
          isSuperAdmin={isSuperAdmin}
          isSubmitting={isSubmitting}
          onClose={closeDrawer}
          onChange={setFormData}
          onSubmit={handleSubmit}
        />

        {/* Modal Delete Confirmation */}
        <TargetDeleteModal
          isOpen={isDeleteModalOpen}
          target={targetToDelete}
          isDeleting={isDeleting}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
      </div>
    </AdminLayout>
  );
};

export default TargetListPage;
