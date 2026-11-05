import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/presentation/context/AuthContext';
import { useToast } from '@/presentation/context/ToastContext';
import { salesmanshipRepository } from '@/core/di/container';
import { KpiTrackingReportResponse } from '@/core/domain/models/ReportKpi';
import { OperationUnitOption, District } from '@/core/domain/models/District';
import { KpiReportFilterState } from '../types';

export const useKpiReport = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const isSuperAdmin = user?.scope?.isSuperAdmin === true;
  const userUnitCode = user?.scope?.unitCode || '';

  const [operationUnits, setOperationUnits] = useState<OperationUnitOption[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  const [reportData, setReportData] = useState<KpiTrackingReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const [filters, setFilters] = useState<KpiReportFilterState>({
    year: 2026,
    quarter: 4,
    cycleType: 'ALL',
    selectedWeek: 'all',
    ouKode: 'all',
    districtId: '',
  });

  // 1. Initial Load: Load Units and initial Districts
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

  // 2. Fetch KPI Report
  const fetchReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await salesmanshipRepository.getKpiReport({
        year: filters.year,
        quarter: filters.quarter,
        cycleType: filters.cycleType,
        selectedWeek: filters.selectedWeek,
        ouKode: filters.ouKode === 'all' ? undefined : filters.ouKode,
        districtId: filters.districtId || undefined,
      });

      setReportData(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal memuat laporan KPI.';
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
  const handleFilterChange = async (updates: Partial<KpiReportFilterState>) => {
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

  // 4. Export CSV
  const handleExportCsv = () => {
    if (!reportData || !reportData.weeks.length) {
      showToast('error', 'Tidak ada data untuk diekspor.');
      return;
    }

    const headers = [
      'Kode Minggu',
      'Minggu',
      'Periode Mulai',
      'Periode Selesai',
      'Target Kunjungan',
      'Real Kunjungan',
      'Gap Kunjungan',
      '% Capaian Kunjungan',
      'Target EC',
      'Real EC',
      'Gap EC',
      '% Capaian EC',
      'Target BD',
      'Real BD',
      'Gap BD',
      '% Capaian BD',
      'Target Volume (Pack)',
      'Real Volume (Pack)',
      'Gap Volume (Pack)',
      '% Capaian Volume',
    ];

    const rows = reportData.weeks.map((w) => [
      w.kodeMinggu,
      w.weekLabel,
      w.startDate,
      w.endDate,
      w.kunjungan.target,
      w.kunjungan.realisasi,
      w.kunjungan.gap,
      `${w.kunjungan.achievementPercent}%`,
      w.ec.target,
      w.ec.realisasi,
      w.ec.gap,
      `${w.ec.achievementPercent}%`,
      w.bd.target,
      w.bd.realisasi,
      w.bd.gap,
      `${w.bd.achievementPercent}%`,
      w.volume.target,
      w.volume.realisasi,
      w.volume.gap,
      `${w.volume.achievementPercent}%`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const fileName = `KPI_Report_${filters.year}_Q${filters.quarter}_${filters.ouKode}_${filters.districtId || 'All'}.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('success', 'Laporan berhasil diekspor ke CSV.');
  };

  // 5. Print
  const handlePrint = () => {
    window.print();
  };

  return {
    filters,
    handleFilterChange,
    operationUnits,
    districts,
    reportData,
    isLoading,
    isLoadingDistricts,
    error,
    isSuperAdmin,
    fetchReport,
    handleExportCsv,
    handlePrint,
  };
};
