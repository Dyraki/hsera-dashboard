import { useEffect, useState } from 'react';
import { OperationUnit, OperationUnitWriteData } from '../../../../../core/domain/models/OperationUnit';
import { useCases } from '../../../../../core/di/container';
import { OperationUnitFormValues } from '../types';
import { useToast } from '@/presentation/context/ToastContext';

const emptyFormValues: OperationUnitFormValues = {
  parentId: '',
  code: '',
  name: '',
  type: 'OPERATION_UNIT',
  category: '',
  distributionPoint: '',
  address: '',
  phone: '',
  latitude: '',
  longitude: '',
  buildingStatus: 'Sewa',
  leaseCategory: 'Tahunan',
  leaseStartDate: '',
  leaseEndDate: '',
  annualRent: '',
  legalDocumentType: '',
  legalDocumentNumber: '',
  status: true
};

export const useOperationUnits = () => {
  const [treeData, setTreeData] = useState<OperationUnit[]>([]);
  const [flatUnits, setFlatUnits] = useState<OperationUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'tree' | 'flat'>('tree');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUnit, setSelectedUnit] = useState<OperationUnit | null>(null);
  const [formValues, setFormValues] = useState<OperationUnitFormValues>(emptyFormValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  const { showToast } = useToast();

  const fetchUnits = async () => {
    setIsLoading(true);
    try {
      const [tree, units] = await Promise.all([
        useCases.getOperationUnitTree.execute(),
        useCases.getOperationUnits.execute()
      ]);
      setTreeData(tree || []);
      setFlatUnits(units || []);
    } catch (error: unknown) {
      console.error('Error fetching operation units:', error);
      showToast('error', error instanceof Error ? error.message : 'Gagal memuat data Operation Unit.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const toggleCollapse = (nodeId: string) => {
    setCollapsedNodes((previous) => ({ ...previous, [nodeId]: !previous[nodeId] }));
  };

  const openCreateModal = (parentId = '') => {
    setSelectedUnit(null);
    setModalMode('create');
    setFormValues({
      ...emptyFormValues,
      parentId,
      type: parentId ? 'OPERATION_UNIT' : 'REGIONAL',
      category: 'Cabang'
    });
    setIsDrawerOpen(true);
  };

  const openEditModal = (unit: OperationUnit) => {
    setSelectedUnit(unit);
    setModalMode('edit');
    setFormValues({
      parentId: unit.parentId || '',
      code: unit.code,
      name: unit.name,
      type: unit.type,
      category: unit.category || '',
      distributionPoint: unit.distributionPoint || '',
      address: unit.address || '',
      phone: unit.phone || '',
      latitude: unit.latitude !== null && unit.latitude !== undefined ? String(unit.latitude) : '',
      longitude: unit.longitude !== null && unit.longitude !== undefined ? String(unit.longitude) : '',
      buildingStatus: unit.buildingStatus || 'Sewa',
      leaseCategory: unit.leaseCategory || 'Tahunan',
      leaseStartDate: unit.leaseStartDate ? unit.leaseStartDate.substring(0, 10) : '',
      leaseEndDate: unit.leaseEndDate ? unit.leaseEndDate.substring(0, 10) : '',
      annualRent: unit.annualRent !== null && unit.annualRent !== undefined ? String(unit.annualRent) : '',
      legalDocumentType: unit.legalDocumentType || '',
      legalDocumentNumber: unit.legalDocumentNumber || '',
      status: unit.status
    });
    setIsDrawerOpen(true);
  };

  const openDetailModal = async (unit: OperationUnit) => {
    try {
      const result = await useCases.getOperationUnitById.execute(unit.id);
      setSelectedUnit(result);
    } catch {
      setSelectedUnit(unit);
    }
    setIsDetailOpen(true);
  };

  const updateFormValue = <K extends keyof OperationUnitFormValues>(field: K, value: OperationUnitFormValues[K]) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formValues.code.trim() || !formValues.name.trim()) {
      showToast('error', 'Kode dan Nama Unit wajib diisi.');
      return;
    }

    if (formValues.type !== 'HEAD_OFFICE' && !formValues.parentId) {
      showToast('error', `Tipe "${formValues.type}" wajib memiliki induk (Parent Unit).`);
      return;
    }

    setIsSubmitting(true);
    const payload: OperationUnitWriteData = {
      ...formValues,
      parentId: formValues.type === 'HEAD_OFFICE' ? null : formValues.parentId || null,
      code: formValues.code.trim().toUpperCase(),
      name: formValues.name.trim(),
      category: formValues.category || null,
      distributionPoint: formValues.distributionPoint || null,
      address: formValues.address || null,
      phone: formValues.phone || null,
      latitude: formValues.latitude ? parseFloat(formValues.latitude) : null,
      longitude: formValues.longitude ? parseFloat(formValues.longitude) : null,
      buildingStatus: formValues.buildingStatus || null,
      leaseCategory: formValues.leaseCategory || null,
      leaseStartDate: formValues.leaseStartDate || null,
      leaseEndDate: formValues.leaseEndDate || null,
      annualRent: formValues.annualRent ? parseFloat(formValues.annualRent) : null,
      legalDocumentType: formValues.legalDocumentType || null,
      legalDocumentNumber: formValues.legalDocumentNumber || null
    };

    try {
      if (modalMode === 'create') {
        await useCases.saveOperationUnit.create(payload);
        showToast('success', `Unit "${formValues.name}" berhasil ditambahkan.`);
      } else if (selectedUnit) {
        await useCases.saveOperationUnit.update(selectedUnit.id, payload);
        showToast('success', `Unit "${formValues.name}" berhasil diperbarui.`);
      }
      setIsDrawerOpen(false);
      fetchUnits();
    } catch (error: unknown) {
      console.error('Error saving unit:', error);
      showToast('error', error instanceof Error ? error.message : 'Gagal menyimpan Operation Unit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (unit: OperationUnit) => {
    if (!window.confirm(`Yakin ingin menghapus unit "${unit.name}" (${unit.code})?`)) return;
    try {
      await useCases.deleteOperationUnit.execute(unit.id);
      showToast('success', `Unit "${unit.name}" berhasil dihapus.`);
      fetchUnits();
    } catch (error: unknown) {
      console.error('Error deleting unit:', error);
      showToast('error', error instanceof Error ? error.message : 'Gagal menghapus unit.');
    }
  };

  const filteredFlatUnits = flatUnits.filter((unit) => {
    if (!searchKeyword) return true;
    const keyword = searchKeyword.toLowerCase();
    return unit.name.toLowerCase().includes(keyword)
      || unit.code.toLowerCase().includes(keyword)
      || Boolean(unit.address?.toLowerCase().includes(keyword))
      || unit.type.toLowerCase().includes(keyword);
  });

  return {
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
  };
};