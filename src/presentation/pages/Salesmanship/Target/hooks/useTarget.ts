import { useState, useEffect, useCallback } from 'react';
import { Target, JenisTarget } from '@/core/domain/models/Target';
import { District } from '@/core/domain/models/District';
import { salesmanshipRepository } from '@/core/di/container';
import { useToast } from '@/presentation/context/ToastContext';
import { ModalMode, TargetFormData } from '../types';

const defaultToday = new Date().toISOString().split('T')[0];

const initialFormData: TargetFormData = {
  jenisTarget: 'KUNJUNGAN',
  districtId: '',
  hariKunjungan: '',
  nilai: '',
  berlakuDari: defaultToday,
  berlakuSampai: '',
  status: 'AKTIF',
};

export const useTarget = () => {
  const { showToast } = useToast();

  const [targets, setTargets] = useState<Target[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filterJenis, setFilterJenis] = useState<string>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Drawer Create / Edit (SlideOver)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<ModalMode>('create');
  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null);
  const [formData, setFormData] = useState<TargetFormData>(initialFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal Delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [targetToDelete, setTargetToDelete] = useState<Target | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Districts lookup
  const fetchDistricts = useCallback(async () => {
    try {
      const data = await salesmanshipRepository.getDistricts();
      setDistricts(data);
    } catch (err: any) {
      console.warn('Gagal memuat daftar district:', err.message);
    }
  }, []);

  // Fetch Targets
  const fetchTargets = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await salesmanshipRepository.getTargets({
        districtId: filterDistrict !== 'all' ? filterDistrict : undefined,
        jenisTarget: filterJenis !== 'all' ? (filterJenis as JenisTarget) : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      });
      setTargets(data);
    } catch (err: any) {
      console.error('Error fetching targets:', err);
      showToast('error', err.response?.data?.message || 'Gagal memuat data target salesmanship.');
    } finally {
      setIsLoading(false);
    }
  }, [filterDistrict, filterJenis, filterStatus, showToast]);

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  // Open Create Drawer
  const openCreateDrawer = () => {
    setDrawerMode('create');
    setSelectedTarget(null);
    setFormError(null);
    setFormData({
      ...initialFormData,
      berlakuDari: new Date().toISOString().split('T')[0],
    });
    setIsDrawerOpen(true);
  };

  // Open Edit Drawer
  const openEditDrawer = (target: Target) => {
    setDrawerMode('edit');
    setSelectedTarget(target);
    setFormError(null);

    const formatTgl = (val?: string | null) => {
      if (!val) return '';
      return val.includes('T') ? val.split('T')[0] : val;
    };

    setFormData({
      id: target.id,
      jenisTarget: target.jenisTarget,
      districtId: target.districtId || '',
      hariKunjungan: target.hariKunjungan !== null && target.hariKunjungan !== undefined ? String(target.hariKunjungan) : '',
      nilai: target.nilai,
      berlakuDari: formatTgl(target.berlakuDari),
      berlakuSampai: formatTgl(target.berlakuSampai),
      status: target.status === 'NONAKTIF' ? 'NONAKTIF' : 'AKTIF',
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    if (!isSubmitting) {
      setIsDrawerOpen(false);
      setSelectedTarget(null);
      setFormError(null);
      setFormData(initialFormData);
    }
  };

  // Submit Drawer Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.jenisTarget) {
      setFormError('Jenis target wajib dipilih.');
      return;
    }

    const numNilai = Number(formData.nilai);
    if (isNaN(numNilai) || numNilai <= 0) {
      setFormError('Nilai target harus berupa angka lebih besar dari 0.');
      return;
    }

    if (!formData.berlakuDari) {
      setFormError('Tanggal berlaku dari wajib diisi.');
      return;
    }

    if (formData.berlakuSampai && formData.berlakuSampai < formData.berlakuDari) {
      setFormError('Tanggal berlaku sampai tidak boleh lebih awal dari berlaku dari.');
      return;
    }

    setIsSubmitting(true);
    try {
      await salesmanshipRepository.saveTarget({
        id: drawerMode === 'edit' && selectedTarget ? selectedTarget.id : undefined,
        jenisTarget: formData.jenisTarget,
        districtId: formData.districtId ? formData.districtId : null,
        hariKunjungan: formData.hariKunjungan ? Number(formData.hariKunjungan) : null,
        nilai: numNilai,
        berlakuDari: formData.berlakuDari,
        berlakuSampai: formData.berlakuSampai ? formData.berlakuSampai : null,
        status: formData.status,
      });

      showToast(
        'success',
        drawerMode === 'create'
          ? `Target '${formData.jenisTarget}' berhasil ditambahkan.`
          : `Target '${formData.jenisTarget}' berhasil diperbarui.`
      );
      closeDrawer();
      fetchTargets();
    } catch (err: any) {
      console.error('Error saving target:', err);
      const msg = err.response?.data?.message || err.message || 'Gagal menyimpan target.';
      setFormError(msg);
      showToast('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Action
  const openDeleteModal = (target: Target) => {
    setTargetToDelete(target);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
      setTargetToDelete(null);
    }
  };

  const handleDelete = async () => {
    if (!targetToDelete) return;
    setIsDeleting(true);
    try {
      await salesmanshipRepository.deleteTarget(targetToDelete.id);
      showToast('success', `Target '${targetToDelete.jenisTarget}' berhasil dihapus.`);
      closeDeleteModal();
      fetchTargets();
    } catch (err: any) {
      console.error('Error deleting target:', err);
      showToast('error', err.response?.data?.message || 'Gagal menghapus target.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered targets by search keyword
  const filteredTargets = targets.filter((t) => {
    if (!searchKeyword.trim()) return true;
    const q = searchKeyword.toLowerCase();
    const matchJenis = t.jenisTarget.toLowerCase().includes(q);
    const matchKode = (t.districtKode || '').toLowerCase().includes(q);
    const matchNilai = String(t.nilai).includes(q);
    return matchJenis || matchKode || matchNilai;
  });

  return {
    targets: filteredTargets,
    rawTargetsCount: targets.length,
    districts,
    isLoading,
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
    selectedTarget,
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
    refresh: fetchTargets,
  };
};
