import React from 'react';
import { AdminLayout } from '@/presentation/components/layout/AdminLayout';
import { SYSTEM_MENU_IDS } from '@/core/constants/MenuConstants';
import { PermissionButton } from '@/presentation/components/ui/PermissionButton';
import { Button } from '@/presentation/components/ui/Button';
import { useBrand } from './hooks/useBrand';
import { BrandTable } from './components/BrandTable';
import { BrandFormDrawer } from './components/BrandFormDrawer';
import { BrandReorderDrawer } from './components/BrandReorderDrawer';
import {
  Boxes,
  Plus,
  ListOrdered,
  Search,
  RotateCw,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';

export const BrandListPage: React.FC = () => {
  const {
    brands,
    allBrands,
    availableCategories,
    isLoading,
    isSubmitting,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
    searchKeyword,
    setSearchKeyword,
    filterKategori,
    setFilterKategori,
    filterStatus,
    setFilterStatus,
    isFormDrawerOpen,
    setIsFormDrawerOpen,
    isReorderDrawerOpen,
    setIsReorderDrawerOpen,
    modalMode,
    formValues,
    openCreateModal,
    openEditModal,
    openReorderModal,
    updateFormValue,
    handleFormSubmit,
    handleReorderSubmit,
    handleDelete,
    fetchBrands,
  } = useBrand();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-950 tracking-tight flex items-center gap-2.5">
              <Boxes className="text-primary-600" size={26} />
              Master Brand
            </h1>
            <p className="text-body-sm text-gray-600 mt-1">
              Kelola katalog produk brand rokok dan atur urutan nomor urut tampilan callsheet & monitoring.
            </p>
          </div>

          {/* Action Buttons: Khusus Tombol Update No Urut diletakkan SEBELUM Tombol Tambah Brand */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <PermissionButton
              menuId={SYSTEM_MENU_IDS.BRAND}
              minLevel={3}
              variant="secondary"
              onClick={openReorderModal}
              title="Perbarui nomor urut brand secara bersamaan"
              className="bg-white border-gray-300 text-gray-800 hover:bg-gray-50 shadow-xs font-semibold"
            >
              <ListOrdered size={16} className="mr-1.5 text-primary-600" />
              Update No Urut
            </PermissionButton>

            <PermissionButton
              menuId={SYSTEM_MENU_IDS.BRAND}
              minLevel={2}
              variant="primary"
              onClick={openCreateModal}
              title="Tambah brand baru"
            >
              <Plus size={16} className="mr-1.5" />
              Tambah Brand
            </PermissionButton>
          </div>
        </div>

        {/* Feedback Alert Banners */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-body-sm flex items-start justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-700 p-0.5 rounded cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-body-sm flex items-start justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-500 hover:text-emerald-800 p-0.5 rounded cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white border border-gray-200 p-4 rounded-xl shadow-xs">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Cari kode atau nama brand..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full bg-white border border-gray-300 pl-10 pr-10 py-2.5 rounded-lg text-body-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none"
            />
            {searchKeyword && (
              <button
                type="button"
                onClick={() => setSearchKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Kategori Filter */}
          <div className="sm:col-span-3">
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-lg text-body-sm text-gray-900 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            >
              <option value="all">Semua Kategori</option>
              {availableCategories.map((kat) => (
                <option key={kat} value={kat}>
                  Kategori: {kat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-lg text-body-sm text-gray-900 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            >
              <option value="all">Semua Status</option>
              <option value="AKTIF">Status: AKTIF</option>
              <option value="NONAKTIF">Status: NONAKTIF</option>
            </select>
          </div>

          {/* Refresh Button */}
          <div className="sm:col-span-1 flex items-center justify-end">
            <Button
              variant="secondary"
              size="md"
              type="button"
              onClick={fetchBrands}
              disabled={isLoading}
              title="Segarkan data brand"
              className="w-full h-full flex items-center justify-center p-0"
            >
              <RotateCw
                size={16}
                className={isLoading ? 'animate-spin text-primary-600' : 'text-gray-600'}
              />
            </Button>
          </div>
        </div>

        {/* Brand Table */}
        <BrandTable
          brands={brands}
          isLoading={isLoading}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onOpenReorder={openReorderModal}
        />
      </div>

      {/* Brand Form Drawer (Tambah / Edit Brand - Nomor Urut Disabled) */}
      <BrandFormDrawer
        isOpen={isFormDrawerOpen}
        mode={modalMode}
        values={formValues}
        isSubmitting={isSubmitting}
        onClose={() => setIsFormDrawerOpen(false)}
        onChange={updateFormValue}
        onSubmit={handleFormSubmit}
      />

      {/* Update No Urut Drawer (Quick Stok Opname Style Batch Update) */}
      <BrandReorderDrawer
        isOpen={isReorderDrawerOpen}
        brands={allBrands}
        isSubmitting={isSubmitting}
        onClose={() => setIsReorderDrawerOpen(false)}
        onSubmit={handleReorderSubmit}
      />
    </AdminLayout>
  );
};
