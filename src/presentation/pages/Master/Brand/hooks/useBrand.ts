import { useState, useEffect, useCallback, useMemo } from 'react';
import { Brand } from '@/core/domain/models/Brand';
import { salesmanshipRepository } from '@/core/di/container';
import { BrandFormData, BrandModalMode } from '../types';
import { AppError } from '@/core/domain/errors/AppError';

const initialFormData: BrandFormData = {
  id: undefined,
  kode: '',
  nama: '',
  kategori: 'SKM FF',
  urutan: 1,
  status: 'AKTIF',
};

export const useBrand = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filterKategori, setFilterKategori] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Drawers
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState<boolean>(false);
  const [isReorderDrawerOpen, setIsReorderDrawerOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<BrandModalMode>('create');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [formValues, setFormValues] = useState<BrandFormData>(initialFormData);

  // Fetch all brands from backend
  const fetchBrands = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await salesmanshipRepository.getBrands();
      // Ensure sorted by urutan asc, then kode asc
      const sorted = [...data].sort((a, b) => a.urutan - b.urutan || a.kode.localeCompare(b.kode));
      setBrands(sorted);
    } catch (err: any) {
      console.error('Gagal mengambil data brand:', err);
      setErrorMessage(
        err instanceof AppError
          ? err.message
          : 'Gagal memuat data brand dari server salesmanship.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Distinct categories available in dataset
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    brands.forEach((b) => {
      if (b.kategori) set.add(b.kategori.toUpperCase());
    });
    return Array.from(set).sort();
  }, [brands]);

  // Client-side filtering for fast responsive typing
  const filteredBrands = useMemo(() => {
    return brands.filter((b) => {
      // Search by kode or nama
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchKode = b.kode.toLowerCase().includes(q);
        const matchNama = b.nama.toLowerCase().includes(q);
        if (!matchKode && !matchNama) return false;
      }

      // Filter kategori
      if (filterKategori !== 'all') {
        if (b.kategori.toUpperCase() !== filterKategori.toUpperCase()) {
          return false;
        }
      }

      // Filter status
      if (filterStatus !== 'all') {
        if (b.status.toUpperCase() !== filterStatus.toUpperCase()) {
          return false;
        }
      }

      return true;
    });
  }, [brands, searchKeyword, filterKategori, filterStatus]);

  // Open Create Drawer
  const openCreateModal = () => {
    // Default urutan for a new brand is the next integer after the current maximum
    const maxUrutan = brands.length > 0 ? Math.max(...brands.map((b) => b.urutan)) : 0;
    setFormValues({
      ...initialFormData,
      urutan: maxUrutan + 1,
    });
    setSelectedBrand(null);
    setModalMode('create');
    setIsFormDrawerOpen(true);
    setErrorMessage(null);
  };

  // Open Edit Drawer
  const openEditModal = (brand: Brand) => {
    setSelectedBrand(brand);
    setFormValues({
      id: brand.id,
      kode: brand.kode,
      nama: brand.nama,
      kategori: brand.kategori,
      urutan: brand.urutan,
      status: brand.status,
    });
    setModalMode('edit');
    setIsFormDrawerOpen(true);
    setErrorMessage(null);
  };

  // Open Quick Reorder Drawer
  const openReorderModal = () => {
    setIsReorderDrawerOpen(true);
    setErrorMessage(null);
  };

  // Form field update helper
  const updateFormValue = <K extends keyof BrandFormData>(key: K, value: BrandFormData[K]) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle Create / Edit Submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (!formValues.kode.trim() || !formValues.nama.trim() || !formValues.kategori.trim()) {
        throw new AppError('Kode, nama, dan kategori brand wajib diisi.', 400);
      }

      await salesmanshipRepository.saveBrand({
        id: formValues.id,
        kode: formValues.kode.trim().toUpperCase(),
        nama: formValues.nama.trim(),
        kategori: formValues.kategori.trim().toUpperCase(),
        urutan: formValues.urutan,
        status: formValues.status,
      });

      setSuccessMessage(
        modalMode === 'create'
          ? `Brand '${formValues.nama}' berhasil ditambahkan.`
          : `Brand '${formValues.nama}' berhasil diperbarui.`
      );

      setIsFormDrawerOpen(false);
      await fetchBrands();
    } catch (err: any) {
      console.error('Gagal menyimpan brand:', err);
      setErrorMessage(
        err instanceof AppError
          ? err.message
          : 'Terjadi kesalahan saat menyimpan brand.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Batch Reorder Submission
  const handleReorderSubmit = async (orders: { id: string; urutan: number }[]) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await salesmanshipRepository.reorderBrands(orders);
      setSuccessMessage('Nomor urut brand berhasil diperbarui secara bersamaan.');
      setIsReorderDrawerOpen(false);
      await fetchBrands();
    } catch (err: any) {
      console.error('Gagal memperbarui urutan brand:', err);
      setErrorMessage(
        err instanceof AppError
          ? err.message
          : 'Gagal memperbarui nomor urut brand.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Brand
  const handleDelete = async (brand: Brand) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus brand "${brand.nama}" (${brand.kode})?`
    );
    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      await salesmanshipRepository.deleteBrand(brand.id);
      setSuccessMessage(`Brand "${brand.nama}" berhasil dihapus.`);
      await fetchBrands();
    } catch (err: any) {
      console.error('Gagal menghapus brand:', err);
      setErrorMessage(
        err instanceof AppError
          ? err.message
          : 'Gagal menghapus brand. Pastikan brand tidak memiliki relasi transaksi callsheet.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    brands: filteredBrands,
    allBrands: brands,
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
    selectedBrand,
    formValues,
    openCreateModal,
    openEditModal,
    openReorderModal,
    updateFormValue,
    handleFormSubmit,
    handleReorderSubmit,
    handleDelete,
    fetchBrands,
  };
};
