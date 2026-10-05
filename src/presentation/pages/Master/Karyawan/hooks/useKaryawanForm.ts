import { useState } from 'react';
import { Karyawan, KaryawanWriteData } from '../../../../../core/domain/models/Karyawan';
import { useCases } from '../../../../../core/di/container';
import { KaryawanFormValues } from '../types';

const emptyFormValues: KaryawanFormValues = {
  operationUnitId: '',
  supervisorId: '',
  employeeNumber: '',
  nik: '',
  legalName: '',
  email: '',
  phone: '',
  sex: 'Laki-laki',
  maritalStatus: 'Belum Menikah',
  religion: 'Islam',
  placeOfBirth: '',
  dateOfBirth: '',
  lastEducation: 'S1',
  address: '',
  postalCode: '',
  originalDateOfHire: '',
  permanentDate: '',
  actualTerminationDate: '',
  accountName: '',
  accountNumber: '',
  status: true
};

type NotificationType = 'success' | 'error';

interface KaryawanFormOptions {
  availableUnitId?: string;
  totalCount: number;
  currentPage: number;
  onNotify: (type: NotificationType, message: string) => void;
  onRefreshList: (page: number) => Promise<void> | void;
  onRefreshLookups: () => Promise<void> | void;
}

export const useKaryawanForm = ({
  availableUnitId,
  totalCount,
  currentPage,
  onNotify,
  onRefreshList,
  onRefreshLookups
}: KaryawanFormOptions) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedKaryawan, setSelectedKaryawan] = useState<Karyawan | null>(null);
  const [activeTab, setActiveTab] = useState<'identitas' | 'kontak' | 'penempatan' | 'bank'>('identitas');
  const [formValues, setFormValues] = useState<KaryawanFormValues>(emptyFormValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormValue = <K extends keyof KaryawanFormValues>(field: K, value: KaryawanFormValues[K]) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const openCreateModal = () => {
    setSelectedKaryawan(null);
    setModalMode('create');
    setActiveTab('identitas');
    setFormValues({
      ...emptyFormValues,
      operationUnitId: availableUnitId || '',
      employeeNumber: `EMP-${new Date().getFullYear()}-${String(totalCount + 1).padStart(3, '0')}`,
      originalDateOfHire: new Date().toISOString().substring(0, 10)
    });
    setIsDrawerOpen(true);
  };

  const openEditModal = (employee: Karyawan) => {
    setSelectedKaryawan(employee);
    setModalMode('edit');
    setActiveTab('identitas');
    setFormValues({
      operationUnitId: employee.operationUnitId,
      supervisorId: employee.supervisorId || '',
      employeeNumber: employee.employeeNumber,
      nik: employee.nik,
      legalName: employee.legalName,
      email: employee.email || '',
      phone: employee.phone || '',
      sex: employee.sex || 'Laki-laki',
      maritalStatus: employee.maritalStatus || 'Belum Menikah',
      religion: employee.religion || 'Islam',
      placeOfBirth: employee.placeOfBirth || '',
      dateOfBirth: employee.dateOfBirth?.substring(0, 10) || '',
      lastEducation: employee.lastEducation || 'S1',
      address: employee.address || '',
      postalCode: employee.postalCode || '',
      originalDateOfHire: employee.originalDateOfHire?.substring(0, 10) || '',
      permanentDate: employee.permanentDate?.substring(0, 10) || '',
      actualTerminationDate: employee.actualTerminationDate?.substring(0, 10) || '',
      accountName: employee.accountName || '',
      accountNumber: employee.accountNumber || '',
      status: employee.status
    });
    setIsDrawerOpen(true);
  };

  const openDetailModal = async (employee: Karyawan) => {
    try {
      setSelectedKaryawan(await useCases.getKaryawanById.execute(employee.id));
    } catch {
      setSelectedKaryawan(employee);
    }
    setIsDetailOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formValues.operationUnitId || !formValues.employeeNumber.trim() || !formValues.nik.trim() || !formValues.legalName.trim()) {
      onNotify('error', 'Unit Penempatan, Nomor Karyawan, NIK, dan Nama Lengkap wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    const payload: KaryawanWriteData = {
      ...formValues,
      supervisorId: formValues.supervisorId || null,
      employeeNumber: formValues.employeeNumber.trim(),
      nik: formValues.nik.trim(),
      legalName: formValues.legalName.trim(),
      email: formValues.email.trim() || null,
      phone: formValues.phone.trim() || null,
      sex: formValues.sex || null,
      maritalStatus: formValues.maritalStatus || null,
      religion: formValues.religion || null,
      placeOfBirth: formValues.placeOfBirth.trim() || null,
      dateOfBirth: formValues.dateOfBirth || null,
      lastEducation: formValues.lastEducation || null,
      address: formValues.address.trim() || null,
      postalCode: formValues.postalCode.trim() || null,
      originalDateOfHire: formValues.originalDateOfHire || null,
      permanentDate: formValues.permanentDate || null,
      actualTerminationDate: formValues.actualTerminationDate || null,
      accountName: formValues.accountName.trim() || null,
      accountNumber: formValues.accountNumber.trim() || null
    };

    try {
      if (modalMode === 'create') {
        await useCases.saveKaryawan.create(payload);
        onNotify('success', `Karyawan "${formValues.legalName}" berhasil ditambahkan.`);
      } else if (selectedKaryawan) {
        await useCases.saveKaryawan.update(selectedKaryawan.id, payload);
        onNotify('success', `Karyawan "${formValues.legalName}" berhasil diperbarui.`);
      }
      setIsDrawerOpen(false);
      onRefreshList(currentPage);
      onRefreshLookups();
    } catch (error: unknown) {
      console.error('Error saving karyawan:', error);
      onNotify('error', error instanceof Error ? error.message : 'Gagal menyimpan data karyawan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (employee: Karyawan) => {
    if (!window.confirm(`Yakin ingin menghapus data karyawan "${employee.legalName}" (${employee.employeeNumber})?`)) return;
    try {
      await useCases.deleteKaryawan.execute(employee.id);
      onNotify('success', `Karyawan "${employee.legalName}" berhasil dihapus.`);
      onRefreshList(currentPage);
    } catch (error: unknown) {
      console.error('Error deleting karyawan:', error);
      onNotify('error', error instanceof Error ? error.message : 'Gagal menghapus karyawan.');
    }
  };

  return {
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
    handleDelete
  };
};
