import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/presentation/context/AuthContext';
import { useToast } from '@/presentation/context/ToastContext';
import { salesmanshipRepository } from '@/core/di/container';
import { SkuSalesReportResponse } from '@/core/domain/models/ReportSkuSales';
import { OperationUnitOption, District } from '@/core/domain/models/District';
import { SkuReportFilterState, QUARTER_OPTIONS } from '../types';

export const useSkuSalesReport = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const isSuperAdmin = user?.scope?.isSuperAdmin === true;
  const userUnitCode = user?.scope?.unitCode || '';

  const [operationUnits, setOperationUnits] = useState<OperationUnitOption[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  const [reportData, setReportData] = useState<SkuSalesReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<string>('urutan');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [filters, setFilters] = useState<SkuReportFilterState>({
    year: 2026,
    quarter: 4,
    cycleType: 'ALL',
    ouKode: 'all',
    districtId: '',
  });

  // 1. Initial Load: Load Units and initial Districts in a single unified pass
  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        const units = await salesmanshipRepository.getOperationUnits();
        if (!active) return;
        setOperationUnits(units);

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
        showToast('error', 'Gagal menginisialisasi unit operasi.');
        setIsInitialized(true);
      }
    };

    init();

    return () => {
      active = false;
    };
  }, [isSuperAdmin, userUnitCode, showToast]);

  // 2. Fetch Sku Sales Report (Only triggered once initialized)
  const fetchReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await salesmanshipRepository.getSkuSalesReport({
        year: filters.year,
        quarter: filters.quarter,
        cycleType: filters.cycleType,
        ouKode: filters.ouKode === 'all' ? undefined : filters.ouKode,
        districtId: filters.districtId || undefined,
      });

      setReportData(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal memuat laporan penjualan SKU.';
      setError(msg);
      showToast('error', msg);
    } finally {
      setIsLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    if (!isInitialized) return;
    fetchReport();
  }, [isInitialized, fetchReport]);

  // 3. User Filter Change Handler
  const handleFilterChange = async (updates: Partial<SkuReportFilterState>) => {
    // If user changes ouKode, fetch districts for that OU and reset districtId
    if (updates.ouKode !== undefined && updates.ouKode !== filters.ouKode) {
      const newOu = updates.ouKode;
      setIsLoadingDistricts(true);
      try {
        const targetOu = newOu === 'all' ? undefined : newOu;
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
        districtId: '',
      }));
      return;
    }

    setFilters((prev) => ({ ...prev, ...updates }));
  };

  // 4. Sorted and Filtered SKU Rows
  const filteredSkuRows = useMemo(() => {
    if (!reportData?.skuRows) return [];

    let rows = [...reportData.skuRows];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      rows = rows.filter(
        (r) => r.kode.toLowerCase().includes(q) || r.nama.toLowerCase().includes(q)
      );
    }

    rows.sort((a, b) => {
      let valA: any = a[sortField as keyof typeof a];
      let valB: any = b[sortField as keyof typeof b];

      // Dynamic week volume sorting
      if (sortField.startsWith('week_')) {
        const km = Number(sortField.replace('week_', ''));
        valA = a.volumesByWeek[km] || 0;
        valB = b.volumesByWeek[km] || 0;
      }

      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });

    return rows;
  }, [reportData, searchQuery, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 5. Export Excel (CSV)
  const handleExportExcel = () => {
    if (!reportData) return;

    const weeks = reportData.weeks;
    const weekHeaders = weeks.map((w) => w.weekLabel).join(',');

    const csvRows = [
      `LAPORAN PENJUALAN SKU (KUARTAL Q${reportData.header.quarter} ${reportData.header.year})`,
      `Siklus: ${reportData.header.cycleType}, Cabang: ${filters.ouKode.toUpperCase()}, District: ${reportData.header.districtKode || 'Semua District'}`,
      `Cut-off WTD: ${reportData.header.cutOffDayName}`,
      '',
      `#,Kode SKU,Nama Brand/SKU,${weekHeaders},Total Kuartal (Pack),Rata-rata/Minggu,Rata-rata/Hari,Growth WTD %`,
    ];

    filteredSkuRows.forEach((row, idx) => {
      const weekCols = weeks.map((w) => row.volumesByWeek[w.kodeMinggu] || 0).join(',');
      const growthStr = row.growthWtdPercent !== null ? `${row.growthWtdPercent}%` : '-';
      csvRows.push(
        `${idx + 1},"${row.kode}","${row.nama}",${weekCols},${row.totalQuarter},${row.avgWeekly},${row.avgDaily},${growthStr}`
      );
    });

    const summaryWeekCols = weeks.map((w) => reportData.summaryRow.totalByWeek[w.kodeMinggu] || 0).join(',');
    const summaryGrowthStr = reportData.summaryRow.grandGrowthWtdPercent !== null ? `${reportData.summaryRow.grandGrowthWtdPercent}%` : '-';
    csvRows.push(
      `,"TOTAL","KONSOLIDASI SELURUH SKU",${summaryWeekCols},${reportData.summaryRow.grandTotalQuarter},${reportData.summaryRow.grandAvgWeekly},${reportData.summaryRow.grandAvgDaily},${summaryGrowthStr}`
    );

    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Report_SKU_Q${reportData.header.quarter}_${reportData.header.year}_${reportData.header.cycleType}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Laporan Penjualan SKU berhasil diekspor.');
  };

  const handlePrint = () => {
    window.print();
  };

  return {
    isSuperAdmin,
    operationUnits,
    districts,
    reportData,
    isLoading: !isInitialized || isLoading,
    isLoadingDistricts,
    error,
    filters,
    searchQuery,
    setSearchQuery,
    sortField,
    sortDirection,
    handleSort,
    filteredSkuRows,
    handleFilterChange,
    refetchReport: fetchReport,
    handleExportExcel,
    handlePrint,
    availableQuarters: QUARTER_OPTIONS,
  };
};
