import { useState, useEffect, useCallback } from 'react';
import { District, OperationUnitOption, SalesmanOption } from '@/core/domain/models/District';
import { Channel } from '@/core/domain/models/Channel';
import { salesmanshipRepository } from '@/core/di/container';
import { useToast } from '@/presentation/context/ToastContext';
import { ModalMode, TerritoryFormData } from '../types';

const initialFormData: TerritoryFormData = {
  ouKode: '',
  kode: '',
  karyawanId: '',
  channelIds: [],
  status: 'AKTIF',
};

export const useTerritory = () => {
  const { showToast } = useToast();

  const [districts, setDistricts] = useState<District[]>([]);
  const [operationUnits, setOperationUnits] = useState<OperationUnitOption[]>([]);
  const [salesmen, setSalesmen] = useState<SalesmanOption[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterOu, setFilterOu] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [formData, setFormData] = useState<TerritoryFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal Delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [districtToDelete, setDistrictToDelete] = useState<District | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Lookups (OUs, Salesmen & Channels)
  const fetchLookups = useCallback(async () => {
    try {
      const [ouList, smList, chList] = await Promise.all([
        salesmanshipRepository.getOperationUnits(),
        salesmanshipRepository.getSalesmen(),
        salesmanshipRepository.getChannels(),
      ]);
      setOperationUnits(ouList);
      setSalesmen(smList);
      setChannels(chList);
    } catch (err: any) {
      console.warn('Gagal memuat data referensi:', err.message);
    }
  }, []);

  // Fetch Districts
  const fetchDistricts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await salesmanshipRepository.getDistricts({
        ouKode: filterOu || undefined,
        status: filterStatus === 'all' ? undefined : filterStatus,
        search: searchKeyword.trim() || undefined,
      });
      setDistricts(data);
    } catch (err: any) {
      console.error('Error fetching districts:', err);
      showToast('error', err.response?.data?.message || 'Gagal memuat data teritori district.');
    } finally {
      setIsLoading(false);
    }
  }, [filterOu, filterStatus, searchKeyword, showToast]);

  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  // Open Create Modal
  const openCreateModal = () => {
    setModalMode('create');
    setSelectedDistrict(null);
    const defaultOu = operationUnits[0]?.kode || '';
    const matchingSalesmen = defaultOu 
      ? salesmen.filter(sm => sm.ouKode === defaultOu)
      : salesmen;
    const defaultSalesman = matchingSalesmen[0]?.id || salesmen[0]?.id || '';

    setFormData({
      ouKode: defaultOu,
      kode: '',
      karyawanId: defaultSalesman,
      channelIds: [],
      status: 'AKTIF',
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (district: District) => {
    setModalMode('edit');
    setSelectedDistrict(district);
    setFormData({
      id: district.id,
      ouKode: district.ouKode,
      kode: district.kode,
      karyawanId: district.karyawanId,
      channelIds: district.channels ? district.channels.map((c) => c.id) : [],
      status: district.status,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDistrict(null);
    setFormData(initialFormData);
  };

  // Submit Create or Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ouKode.trim()) {
      showToast('error', 'Operation Unit wajib dipilih.');
      return;
    }
    if (!formData.kode.trim()) {
      showToast('error', 'Kode District wajib diisi.');
      return;
    }
    if (!formData.karyawanId.trim()) {
      showToast('error', 'Salesman penanggung jawab wajib dipilih.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalMode === 'create') {
        await salesmanshipRepository.createDistrict({
          ouKode: formData.ouKode.trim().toUpperCase(),
          kode: formData.kode.trim().toUpperCase(),
          karyawanId: formData.karyawanId,
          channelIds: formData.channelIds,
          status: formData.status,
        });
        showToast('success', `Teritori '${formData.kode.toUpperCase()}' berhasil ditambahkan.`);
      } else if (selectedDistrict) {
        await salesmanshipRepository.updateDistrict(selectedDistrict.id, {
          ouKode: formData.ouKode.trim().toUpperCase(),
          kode: formData.kode.trim().toUpperCase(),
          karyawanId: formData.karyawanId,
          channelIds: formData.channelIds,
          status: formData.status,
        });
        showToast('success', `Teritori '${formData.kode.toUpperCase()}' berhasil diperbarui.`);
      }
      closeModal();
      fetchDistricts();
    } catch (err: any) {
      console.error('Error saving district:', err);
      showToast('error', err.response?.data?.message || 'Gagal menyimpan data teritori.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Actions
  const openDeleteModal = (district: District) => {
    setDistrictToDelete(district);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDistrictToDelete(null);
  };

  const handleDelete = async () => {
    if (!districtToDelete) return;
    setIsDeleting(true);
    try {
      await salesmanshipRepository.deleteDistrict(districtToDelete.id);
      showToast('success', `Teritori '${districtToDelete.kode}' berhasil dihapus.`);
      closeDeleteModal();
      fetchDistricts();
    } catch (err: any) {
      console.error('Error deleting district:', err);
      showToast('error', err.response?.data?.message || 'Gagal menghapus teritori.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDistricts();
  };

  return {
    districts,
    operationUnits,
    salesmen,
    channels,
    isLoading,
    searchKeyword,
    setSearchKeyword,
    filterOu,
    setFilterOu,
    filterStatus,
    setFilterStatus,
    isModalOpen,
    modalMode,
    selectedDistrict,
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
    refresh: fetchDistricts,
  };
};
