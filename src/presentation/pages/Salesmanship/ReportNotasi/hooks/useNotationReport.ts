import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/presentation/context/AuthContext';
import { useToast } from '@/presentation/context/ToastContext';
import { salesmanshipRepository } from '@/core/di/container';
import { NotationReportResponse } from '@/core/domain/models/ReportNotation';
import { OperationUnitOption, District } from '@/core/domain/models/District';
import { Brand } from '@/core/domain/models/Brand';
import { SkuSalesRow } from '@/core/domain/models/ReportSkuSales';
import { NotationReportFilterState } from '../types';

export const useNotationReport = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const isSuperAdmin = user?.scope?.isSuperAdmin === true;
  const userUnitCode = user?.scope?.unitCode || '';

  const [operationUnits, setOperationUnits] = useState<OperationUnitOption[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [reportData, setReportData] = useState<NotationReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Table filtering and sorting state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<string>('urutan');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filters State
  const [filters, setFilters] = useState<NotationReportFilterState>({
    year: 2026,
    quarter: 4,
    cycleType: 'ALL',
    selectedWeek: 'all',
    ouKode: 'all',
    districtId: '',
    brandId: 'all',
  });

  // 1. Initial Load: Load Units, Brands, and initial Districts
  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        const [units, brandsList] = await Promise.all([
          salesmanshipRepository.getOperationUnits(),
          salesmanshipRepository.getBrands({ status: 'AKTIF' }),
        ]);

        if (!active) return;
        setOperationUnits(units);
        setBrands(brandsList);

        let defaultOu = 'all';
        if (!isSuperAdmin) {
          if (units.length === 1) {
            defaultOu = units[0].kode;
          } else if (userUnitCode) {
            defaultOu = userUnitCode;
          }
        }

        const targetOu = defaultOu === 'all' ? undefined : defaultOu;
        const distList = await salesmanshipRepository.getDistricts({ ouKode: targetOu, status: 'AKTIF' });
        if (!active) return;
        setDistricts(distList);

        setFilters((prev) => ({
          ...prev,
          ouKode: defaultOu,
        }));

        setIsInitialized(true);
      } catch {
        if (!active) return;
        showToast('error', 'Gagal menginisialisasi filter unit dan brand.');
        setIsInitialized(true);
      }
    };

    init();

    return () => {
      active = false;
    };
  }, [isSuperAdmin, userUnitCode, showToast]);

  // 2. Fetch Notation Report
  const fetchReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await salesmanshipRepository.getNotationReport({
        year: filters.year,
        quarter: filters.quarter,
        cycleType: filters.cycleType,
        selectedWeek: filters.selectedWeek,
        ouKode: filters.ouKode === 'all' ? undefined : filters.ouKode,
        districtId: filters.districtId || undefined,
        brandId: filters.brandId === 'all' ? undefined : filters.brandId,
      });

      setReportData(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal memuat laporan analisis notasi.';
      setError(msg);
      showToast('error', msg);
    } finally {
      setIsLoading(false);
    }
  }, [filters, showToast]);

  // Fetch report whenever initialized and filters change
  useEffect(() => {
    if (isInitialized) {
      fetchReport();
    }
  }, [isInitialized, fetchReport]);

  // 3. Handle Filter Changes
  const handleFilterChange = useCallback(
    async (updates: Partial<NotationReportFilterState>) => {
      // If OU changes, update Districts list dynamically
      if (updates.ouKode !== undefined && updates.ouKode !== filters.ouKode) {
        setIsLoadingDistricts(true);
        try {
          const targetOu = updates.ouKode === 'all' ? undefined : updates.ouKode;
          const distList = await salesmanshipRepository.getDistricts({ ouKode: targetOu, status: 'AKTIF' });
          setDistricts(distList);
        } catch {
          showToast('error', 'Gagal memuat daftar district.');
        } finally {
          setIsLoadingDistricts(false);
        }

        setFilters((prev) => ({
          ...prev,
          ...updates,
          districtId: '', // Reset district when OU changes
        }));
        return;
      }

      setFilters((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    [filters.ouKode, showToast]
  );

  // 4. Handle Sorting for SKU table
  const handleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDirection(field === 'nama' || field === 'kode' ? 'asc' : 'desc');
      }
    },
    [sortField]
  );

  // 5. Filtered SKU Rows for SkuSalesMatrixTable
  const filteredSkuRows = useMemo(() => {
    if (!reportData?.skuMatrix?.skuRows) return [];
    let rows = [...reportData.skuMatrix.skuRows];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      rows = rows.filter(
        (r) => r.kode.toLowerCase().includes(q) || r.nama.toLowerCase().includes(q)
      );
    }

    rows.sort((a, b) => {
      let valA: any = a[sortField as keyof SkuSalesRow];
      let valB: any = b[sortField as keyof SkuSalesRow];

      if (sortField.startsWith('w_')) {
        const km = Number(sortField.replace('w_', ''));
        valA = a.volumesByWeek[km] || 0;
        valB = b.volumesByWeek[km] || 0;
      }

      if (typeof valA === 'string') {
        const cmp = valA.localeCompare(valB);
        return sortDirection === 'asc' ? cmp : -cmp;
      }

      const numA = Number(valA || 0);
      const numB = Number(valB || 0);
      return sortDirection === 'asc' ? numA - numB : numB - numA;
    });

    return rows;
  }, [reportData?.skuMatrix?.skuRows, searchQuery, sortField, sortDirection]);

  // 6. Export CSV Handler
  const handleExportCsv = useCallback(() => {
    if (!reportData) return;
    try {
      const headers = [
        'Periode / Minggu',
        'SK (Stok Kurang)',
        'SL (Stok Laku)',
        'OOS (Out Of Stock)',
        'SD (Stok Diam)',
        'TL (Tidak Laku)',
        'BPJ (Belum Pernah Jual)',
        'SB (Stok Baru)',
        'Avg Stock (Pack)',
        'Avg Buy (Pack)',
        'Total Kunjungan',
      ];

      const rows = reportData.notationTrend.map((d) => [
        `"${d.label}"`,
        d.sk,
        d.sl,
        d.oos,
        d.sd,
        d.tl,
        d.bpj,
        d.sb,
        d.avgStock,
        d.avgBuy,
        d.totalCalls,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,\uFEFF' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `laporan_notasi_Q${filters.quarter}_${filters.year}_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('success', 'Laporan notasi berhasil diekspor ke CSV.');
    } catch {
      showToast('error', 'Gagal mengekspor data ke CSV.');
    }
  }, [reportData, filters, showToast]);

  // 7. Print Handler
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return {
    isSuperAdmin,
    operationUnits,
    districts,
    brands,
    reportData,
    isLoading,
    isLoadingDistricts,
    error,
    filters,
    handleFilterChange,
    searchQuery,
    setSearchQuery,
    sortField,
    sortDirection,
    handleSort,
    filteredSkuRows,
    fetchReport,
    handleExportCsv,
    handlePrint,
  };
};
