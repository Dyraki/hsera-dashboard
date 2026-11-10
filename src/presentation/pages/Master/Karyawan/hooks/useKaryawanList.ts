import { useEffect, useState } from 'react';
import { Karyawan, KaryawanSupervisor } from '../../../../../core/domain/models/Karyawan';
import { useCases } from '../../../../../core/di/container';
import { OperationUnitOption } from '../types';

interface KaryawanListOptions {
  onError: (message: string) => void;
  onSuccess?: (message: string) => void;
}

export const useKaryawanList = ({ onError, onSuccess }: KaryawanListOptions) => {
  const [karyawans, setKaryawans] = useState<Karyawan[]>([]);
  const [availableUnits, setAvailableUnits] = useState<OperationUnitOption[]>([]);
  const [allSupervisors, setAllSupervisors] = useState<KaryawanSupervisor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterUnitId, setFilterUnitId] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchLookups = async () => {
    try {
      const [units, employeesPage] = await Promise.all([
        useCases.getOperationUnits.execute({ scope: true }),
        useCases.getKaryawanPage.execute({ page: 1, limit: 100 })
      ]);
      setAvailableUnits(units.map(({ id, code, name, type }) => ({ id, code, name, type })));
      setAllSupervisors(employeesPage.data.map(({ id, employeeNumber, legalName }) => ({ id, employeeNumber, legalName })));
    } catch (error) {
      console.error('Error fetching units or supervisors:', error);
    }
  };

  const fetchKaryawan = async (currentPage = page, currentLimit = pageSize) => {
    setIsLoading(true);
    try {
      const result = await useCases.getKaryawanPage.execute({
        page: currentPage,
        limit: currentLimit,
        search: searchKeyword.trim() || undefined,
        operationUnitId: filterUnitId || undefined,
        status: filterStatus === 'all' ? undefined : filterStatus === 'active'
      });
      setKaryawans(result.data);
      setTotalPages(result.totalPages || 1);
      setTotalCount(result.total || 0);
      setPage(result.page || 1);
    } catch (error: unknown) {
      console.error('Error fetching karyawan:', error);
      onError(error instanceof Error ? error.message : 'Gagal memuat data karyawan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    fetchKaryawan(1, newSize);
  };

  useEffect(() => {
    fetchLookups();
    fetchKaryawan(1);
  }, [filterUnitId, filterStatus]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchKaryawan(1);
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const exportLimit = Math.max(1000, totalCount || 1000);
      const result = await useCases.getKaryawanPage.execute({
        page: 1,
        limit: exportLimit,
        search: searchKeyword.trim() || undefined,
        operationUnitId: filterUnitId || undefined,
        status: filterStatus === 'all' ? undefined : filterStatus === 'active',
      });

      if (!result.data || result.data.length === 0) {
        onError('Tidak ada data karyawan yang cocok untuk diekspor.');
        return;
      }

      const activeUnit = availableUnits.find((u) => u.id === filterUnitId);
      const { exportKaryawanToExcel } = await import('../utils/exportKaryawanExcel');
      await exportKaryawanToExcel(result.data, {
        unitName: activeUnit ? `[${activeUnit.code}] ${activeUnit.name}` : undefined,
        searchKeyword: searchKeyword.trim() || undefined,
        statusLabel: filterStatus === 'active' ? 'Aktif' : filterStatus === 'inactive' ? 'Nonaktif' : 'Semua',
      });

      if (onSuccess) {
        onSuccess(`Berhasil mengekspor ${result.data.length} data karyawan ke Excel.`);
      }
    } catch (error: unknown) {
      console.error('Error exporting karyawan:', error);
      onError(error instanceof Error ? error.message : 'Gagal mengekspor data karyawan.');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    karyawans,
    availableUnits,
    allSupervisors,
    isLoading,
    isExporting,
    searchKeyword,
    setSearchKeyword,
    filterUnitId,
    setFilterUnitId,
    filterStatus,
    setFilterStatus,
    page,
    totalPages,
    totalCount,
    pageSize,
    setPageSize,
    handlePageSizeChange,
    fetchKaryawan,
    fetchLookups,
    handleSearchSubmit,
    handleExportExcel
  };
};
