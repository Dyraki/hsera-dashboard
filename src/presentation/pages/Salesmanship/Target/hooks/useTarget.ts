import { useState, useEffect, useCallback } from 'react';
import { Target, JenisTarget } from '@/core/domain/models/Target';
import { District, OperationUnitOption } from '@/core/domain/models/District';
import { salesmanshipRepository } from '@/core/di/container';
import { useAuth } from '@/presentation/context/AuthContext';
import { useToast } from '@/presentation/context/ToastContext';
import { ModalMode, TargetFormData } from '../types';

const defaultToday = new Date().toISOString().split('T')[0];

const initialFormData: TargetFormData = {
  jenisTarget: 'KUNJUNGAN',
  ouKode: '',
  districtId: '',
  hariKunjungan: '',
  nilai: '',
  berlakuDari: defaultToday,
  berlakuSampai: '',
  status: 'AKTIF',
};

export const useTarget = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const isSuperAdmin = user?.scope?.isSuperAdmin === true;
  const userUnitCode = user?.scope?.unitCode || '';

  const [targets, setTargets] = useState<Target[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [operationUnits, setOperationUnits] = useState<OperationUnitOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filterOu, setFilterOu] = useState<string>('all');
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

  // Fetch Operation Units lookup
  const fetchOperationUnits = useCallback(async () => {
    try {
      const units = await salesmanshipRepository.getOperationUnits();
      setOperationUnits(units);

      // Default OU handling based on user scope:
      // If user has a single affiliated unit and is not super admin, lock to that unit
      if (!isSuperAdmin) {
        if (units.length === 1) {
          setFilterOu(units[0].kode);
        } else if (userUnitCode) {
          setFilterOu(userUnitCode);
        }
      }
    } catch (err: any) {
      console.warn('Gagal memuat daftar operation unit:', err.message);
    }
  }, [isSuperAdmin, userUnitCode]);

  // Fetch Districts lookup (load all permitted districts so drawer and filters have access)
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
        ouKode: filterOu !== 'all' ? filterOu : undefined,
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
  }, [filterOu, filterDistrict, filterJenis, filterStatus, showToast]);

  useEffect(() => {
    fetchOperationUnits();
    fetchDistricts();
  }, [fetchOperationUnits, fetchDistricts]);

  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  // Open Create Drawer
  const openCreateDrawer = () => {
    setDrawerMode('create');
    setSelectedTarget(null);
    setFormError(null);

    // Determine default OU for creation
    let defaultOu = '';
    if (!isSuperAdmin) {
      if (filterOu !== 'all') {
        defaultOu = filterOu;
      } else if (userUnitCode) {
        defaultOu = userUnitCode;
      } else if (operationUnits.length > 0) {
        defaultOu = operationUnits[0].kode;
      }
    } else {
      if (filterOu !== 'all') {
        defaultOu = filterOu;
      }
    }

    setFormData({
      ...initialFormData,
      ouKode: defaultOu,
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
      ouKode: target.ouKode || '',
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

    // Role check: non-superadmin cannot create global target (must choose an OU)
    if (!isSuperAdmin && !formData.ouKode) {
      setFormError('Operation Unit wajib dipilih untuk akun non-Super Admin.');
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
        ouKode: formData.ouKode ? formData.ouKode : null,
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
    const matchOu = (t.ouKode || '').toLowerCase().includes(q);
    const matchNilai = String(t.nilai).includes(q);
    return matchJenis || matchKode || matchOu || matchNilai;
  });

  return {
    targets: filteredTargets,
    rawTargetsCount: targets.length,
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
