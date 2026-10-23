import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/presentation/context/AuthContext';
import { useToast } from '@/presentation/context/ToastContext';
import { salesmanshipRepository } from '@/core/di/container';
import {
  WeeklyDistrictReportResponse,
  AvailableWeekOption,
} from '@/core/domain/models/ReportWeeklyDistrict';
import { OperationUnitOption, District } from '@/core/domain/models/District';
import { ReportFilterState } from '../types';

export const useWeeklyDistrictReport = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const isSuperAdmin = user?.scope?.isSuperAdmin === true;
  const userUnitCode = user?.scope?.unitCode || '';

  const [availableWeeks, setAvailableWeeks] = useState<AvailableWeekOption[]>([]);
  const [operationUnits, setOperationUnits] = useState<OperationUnitOption[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  const [reportData, setReportData] = useState<WeeklyDistrictReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ReportFilterState>({
    kodeMinggu: undefined,
    ouKode: 'all',
    districtId: '',
    kategori: 'ALL',
    statusRekap: 'FINAL',
  });

  // 1. Initial Load: Weeks & Operation Units
  useEffect(() => {
    let active = true;

    const initMetadata = async () => {
      try {
        const targetInitialOu = !isSuperAdmin && userUnitCode ? userUnitCode : undefined;
        const [weeks, units] = await Promise.all([
          salesmanshipRepository.getAvailableWeeks(targetInitialOu),
          salesmanshipRepository.getOperationUnits(),
        ]);

        if (!active) return;

        setAvailableWeeks(weeks);
        setOperationUnits(units);

        // Find current ISO week or default to first week
        const currentWeekOpt = weeks.find((w) => w.isCurrent) || weeks[0];
        const defaultWeek = currentWeekOpt ? currentWeekOpt.kodeMinggu : undefined;

        // Determine default OU:
        // Jika user memiliki banyak unit (Super Admin atau Level Management seperti Area Office / Regional),
        // gunakan 'all' agar seluruh district di cakupan cabang bawahannya langsung termuat.
        // Jika user hanya terafiliasi dengan 1 unit operasional tunggal, gunakan unit tersebut.
        let defaultOu = 'all';
        if (!isSuperAdmin) {
          if (units.length === 1) {
            defaultOu = units[0].kode;
          } else if (units.length > 1) {
            defaultOu = 'all';
          }
        }

        setFilters((prev) => ({
          ...prev,
          kodeMinggu: prev.kodeMinggu || defaultWeek,
          ouKode: prev.ouKode ? prev.ouKode : defaultOu,
        }));
      } catch (err: any) {
        if (!active) return;
        showToast('error', 'Gagal memuat daftar minggu atau unit operasi.');
      }
    };

    initMetadata();

    return () => {
      active = false;
    };
  }, [isSuperAdmin, userUnitCode, showToast]);

  // 2. Load Districts whenever ouKode changes
  useEffect(() => {
    if (!filters.ouKode) return;

    let active = true;
    setIsLoadingDistricts(true);

    const targetOu = filters.ouKode === 'all' ? undefined : filters.ouKode;

    salesmanshipRepository
      .getDistricts({ ouKode: targetOu, status: 'AKTIF' })
      .then((distList) => {
        if (!active) return;
        setDistricts(distList);

        // Auto select first district if current is empty or not in list
        const currentValid = distList.some((d) => d.id === filters.districtId);
        if (!currentValid && distList.length > 0) {
          setFilters((prev) => ({
            ...prev,
            districtId: distList[0].id,
          }));
        } else if (distList.length === 0) {
          setFilters((prev) => ({
            ...prev,
            districtId: '',
          }));
          setReportData(null);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!active) return;
        showToast('error', 'Gagal memuat daftar teritori/district.');
      })
      .finally(() => {
        if (active) setIsLoadingDistricts(false);
      });

    return () => {
      active = false;
    };
  }, [filters.ouKode, showToast]);

  // 3. Fetch Report Data
  const fetchReport = useCallback(async () => {
    if (!filters.districtId) {
      setReportData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await salesmanshipRepository.getWeeklyDistrictReport({
        districtId: filters.districtId,
        kodeMinggu: filters.kodeMinggu,
        kategori: filters.kategori,
        statusRekap: filters.statusRekap,
        ouKode: filters.ouKode === 'all' ? undefined : filters.ouKode,
      });

      setReportData(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal memuat laporan mingguan per district.';
      setError(msg);
      showToast('error', msg);
    } finally {
      setIsLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    if (filters.districtId) {
      fetchReport();
    }
  }, [filters.districtId, filters.kodeMinggu, filters.kategori, filters.statusRekap, fetchReport]);

  const handleFilterChange = (partial: Partial<ReportFilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    if (!reportData) {
      showToast('error', 'Tidak ada data laporan untuk diekspor.');
      return;
    }

    // Build CSV formatted spreadsheet
    const headerLines = [
      `LAPORAN MINGGUAN PER DISTRICT - WEEKLY RETAIL INTELLIGENCE REPORT (RIS)`,
      `District:,"${reportData.header.district.nama}"`,
      `Salesman:,"${reportData.header.district.karyawanNama} (${reportData.header.district.karyawanId})"`,
      `Minggu ISO:,"${reportData.header.kodeMingguDisplay} (${reportData.header.startDate} s/d ${reportData.header.endDate})"`,
      `Status Audit:,"${reportData.header.lockStatusText}"`,
      ``,
      `RINGKASAN KPI MINGGUAN`,
      `Kunjungan:,${reportData.kpiSummary.kunjungan.actual} / ${reportData.kpiSummary.kunjungan.target} calls (${reportData.kpiSummary.kunjungan.percent}%),Selisih: ${reportData.kpiSummary.kunjungan.gap}`,
      `Callmade (EC):,${reportData.kpiSummary.ec.actual} / ${reportData.kpiSummary.ec.target || '-'} outlet (${reportData.kpiSummary.ec.percentFromTarget || reportData.kpiSummary.ec.percentFromKunjungan}%),Rasio Beli: ${reportData.kpiSummary.ec.percentFromKunjungan}%,Non-Transaksi: ${reportData.kpiSummary.ec.nonTransaksi}`,
      `BD Outlet:,${reportData.kpiSummary.bd.actual} / ${reportData.kpiSummary.bd.target} outlet (${reportData.kpiSummary.bd.percentFromTarget}%)`,
      `Total Volume:,${reportData.kpiSummary.volume.actual} / ${reportData.kpiSummary.volume.target || '-'} Pk (${reportData.kpiSummary.volume.percentFromTarget}%)`,
      `Territory Reach Index:,${reportData.kpiSummary.territoryReachIndex}%`,
      ``,
      `RITASE HARIAN (SENIN - SABTU)`,
      `Hari,Tanggal,Target,Realisasi,% Tercapai,Status`,
      ...reportData.dailyTrend.map(
        (d) => `"${d.namaHari}","${d.date}",${d.target},${d.actual},${d.percent}%,"${d.statusRekap || '-'}"`
      ),
      ``,
      `MATRIKS DISTRIBUSI ${reportData.brandMatrix.totalSkuAktif} BRAND INTI FMCG`,
      `#,Kode Brand,Nama Brand,Kategori,SK %,SL %,SD %,OOS %,SB %,TL %,BPJ %,BD OUTLET %,AVG STOCK (pck),AVG BUY (pck),TOTAL VOL (pk)`,
      ...reportData.brandMatrix.brands.map(
        (b) =>
          `${b.urutan},"${b.kode}","${b.nama}","${b.kategori}",${b.notasi.skPercent}%,${b.notasi.slPercent}%,${b.notasi.sdPercent}%,${b.notasi.oosPercent}%,${b.notasi.sbPercent}%,${b.notasi.tlPercent}%,${b.notasi.bpjPercent}%,${b.notasi.bdPercent}%,${b.volume.avgStock},${b.volume.avgBuy},${b.volume.totalVol}`
      ),
      `,"TOTAL","${reportData.brandMatrix.summaryRow.label}","",${reportData.brandMatrix.summaryRow.skPercent}%,${reportData.brandMatrix.summaryRow.slPercent}%,${reportData.brandMatrix.summaryRow.sdPercent}%,${reportData.brandMatrix.summaryRow.oosPercent}%,${reportData.brandMatrix.summaryRow.sbPercent}%,${reportData.brandMatrix.summaryRow.tlPercent}%,${reportData.brandMatrix.summaryRow.bpjPercent}%,${reportData.brandMatrix.summaryRow.bdPercent}%,${reportData.brandMatrix.summaryRow.avgStock},${reportData.brandMatrix.summaryRow.avgBuy},${reportData.brandMatrix.summaryRow.totalVol}`,
    ];

    const csvContent = '\uFEFF' + headerLines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `RIS_Mingguan_${reportData.header.district.kode}_W${reportData.header.kodeMingguDisplay}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Laporan mingguan berhasil diekspor ke Excel (CSV).');
  };

  return {
    user,
    isSuperAdmin,
    availableWeeks,
    operationUnits,
    districts,
    reportData,
    isLoading,
    isLoadingDistricts,
    error,
    filters,
    handleFilterChange,
    refetchReport: fetchReport,
    handlePrint,
    handleExportExcel,
  };
};
