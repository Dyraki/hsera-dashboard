import { useEffect, useState } from 'react';
import { Karyawan, KaryawanSupervisor } from '../../../../../core/domain/models/Karyawan';
import { useCases } from '../../../../../core/di/container';
import { OperationUnitOption } from '../types';

interface KaryawanListOptions {
  onError: (message: string) => void;
}

export const useKaryawanList = ({ onError }: KaryawanListOptions) => {
  const [karyawans, setKaryawans] = useState<Karyawan[]>([]);
  const [availableUnits, setAvailableUnits] = useState<OperationUnitOption[]>([]);
  const [allSupervisors, setAllSupervisors] = useState<KaryawanSupervisor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterUnitId, setFilterUnitId] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchLookups = async () => {
    try {
      const [units, employeesPage] = await Promise.all([
        useCases.getOperationUnits.execute(),
        useCases.getKaryawanPage.execute({ page: 1, limit: 100 })
      ]);
      setAvailableUnits(units.map(({ id, code, name, type }) => ({ id, code, name, type })));
      setAllSupervisors(employeesPage.data.map(({ id, employeeNumber, legalName }) => ({ id, employeeNumber, legalName })));
    } catch (error) {
      console.error('Error fetching units or supervisors:', error);
    }
  };

  const fetchKaryawan = async (currentPage = page) => {
    setIsLoading(true);
    try {
      const result = await useCases.getKaryawanPage.execute({
        page: currentPage,
        limit: 10,
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

  useEffect(() => {
    fetchLookups();
    fetchKaryawan(1);
  }, [filterUnitId, filterStatus]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchKaryawan(1);
  };

  return {
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
    fetchKaryawan,
    fetchLookups,
    handleSearchSubmit
  };
};
