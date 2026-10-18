import { useState, useEffect, useCallback, useMemo } from "react";
import { WeeklyMonitoringResponse } from "@/core/domain/models/Monitoring";
import { OperationUnitOption } from "@/core/domain/models/District";
import { salesmanshipRepository } from "@/core/di/container";
import { useToast } from "@/presentation/context/ToastContext";
import { useAuth } from "@/presentation/context/AuthContext";
import { ViewMode, MonitoringKpiSummary, FilterState } from "../types";

// Helper to calculate ISO Week number for a Date
export const getIsoWeekNumber = (d: Date): number => {
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7; // Monday is 0
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  const weekNumber = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  const year = target.getFullYear();
  return year * 100 + weekNumber;
};

export const useWeeklyMonitoring = () => {
  const { showToast } = useToast();
  const { user } = useAuth();

  const userOuKode = user?.scope?.unitCode;

  const [currentIsoWeek] = useState<number>(() => getIsoWeekNumber(new Date()));
  const [selectedWeek, setSelectedWeek] = useState<number>(() => getIsoWeekNumber(new Date()));

  const [data, setData] = useState<WeeklyMonitoringResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [operationUnits, setOperationUnits] = useState<OperationUnitOption[]>([]);
  const [filters, setFilters] = useState<FilterState>(() => ({
    ouKode: userOuKode || "all",
    status: "ALL",
    search: "",
  }));
  const [viewMode, setViewMode] = useState<ViewMode>("RINGKAS");

  const [isLockModalOpen, setIsLockModalOpen] = useState<boolean>(false);
  const [isSubmittingLock, setIsSubmittingLock] = useState<boolean>(false);

  // Sync initial ouKode if user context arrives after component mount
  useEffect(() => {
    if (userOuKode) {
      setFilters((prev) => {
        if (prev.ouKode === "all") {
          return { ...prev, ouKode: userOuKode };
        }
        return prev;
      });
    }
  }, [userOuKode]);

  // Load Operation Units reference on mount and match user's OU if needed
  useEffect(() => {
    let mounted = true;
    salesmanshipRepository.getOperationUnits()
      .then((ous) => {
        if (mounted) {
          setOperationUnits(ous);
          setFilters((prev) => {
            if (prev.ouKode === "all") {
              const matchedOu = user?.scope?.unitCode
                ? ous.find((ou) => ou.kode === user.scope?.unitCode)
                : ous.find((ou) => ou.id === user?.karyawan?.operationUnitId);
              if (matchedOu) {
                return { ...prev, ouKode: matchedOu.kode };
              }
            }
            return prev;
          });
        }
      })
      .catch((err) => console.error("Gagal memuat operation units:", err));
    return () => { mounted = false; };
  }, [user?.scope?.unitCode, user?.karyawan?.operationUnitId]);

  // Fetch weekly monitoring data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await salesmanshipRepository.getWeeklyMonitoring(
        selectedWeek,
        filters.ouKode !== "all" ? filters.ouKode : undefined
      );
      setData(res);
    } catch (err: any) {
      const msg = err.message || "Gagal memuat data monitoring callsheet.";
      setError(msg);
      showToast("error", msg);
    } finally {
      setIsLoading(false);
    }
  }, [selectedWeek, filters.ouKode, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Week navigation helpers
  const handlePrevWeek = () => {
    setSelectedWeek((prev) => {
      const year = Math.floor(prev / 100);
      const week = prev % 100;
      if (week <= 1) {
        return (year - 1) * 100 + 52;
      }
      return year * 100 + (week - 1);
    });
  };

  const handleNextWeek = () => {
    setSelectedWeek((prev) => {
      const year = Math.floor(prev / 100);
      const week = prev % 100;
      if (week >= 52) {
        return (year + 1) * 100 + 1;
      }
      return year * 100 + (week + 1);
    });
  };

  const handleCurrentWeek = () => {
    setSelectedWeek(currentIsoWeek);
  };

  // Filtered rows
  const filteredDistricts = useMemo(() => {
    if (!data?.districts) return [];

    return data.districts.filter((dist) => {
      // Search filter: district kode or salesman name
      if (filters.search && filters.search.trim().length > 0) {
        const q = filters.search.toLowerCase();
        const matchKode = dist.districtKode.toLowerCase().includes(q);
        const matchName = dist.karyawanName.toLowerCase().includes(q);
        if (!matchKode && !matchName) return false;
      }

      // Status filter
      if (filters.status === "LENGKAP") {
        return dist.persentaseLengkap === 100;
      }
      if (filters.status === "BELUM_LENGKAP") {
        return dist.persentaseLengkap < 100;
      }
      if (filters.status === "DRAFT") {
        return dist.days.some((d) => d.statusRekap === "DRAFT");
      }
      if (filters.status === "KOSONG") {
        return dist.days.some((d) => d.status === "KOSONG");
      }

      return true;
    });
  }, [data, filters]);

  // Live KPI Summary
  const kpiSummary = useMemo<MonitoringKpiSummary>(() => {
    const list = data?.districts || [];
    const totalSlotHari = list.length * 6;

    let totalHariFinal = 0;
    let totalHariDraft = 0;
    let totalHariKosong = 0;
    let totalCm = 0;
    let totalBd = 0;
    let totalEc = 0;
    let totalVolume = 0;

    const draftSet = new Set<string>();
    const urgentSet = new Set<string>();

    for (const dist of list) {
      for (const d of dist.days) {
        if (d.status === "TERISI") {
          if (d.statusRekap === "FINAL") {
            totalHariFinal++;
          } else {
            totalHariDraft++;
            draftSet.add(dist.districtKode);
          }
          totalCm += d.jumlahKunjungan || 0;
          totalBd += d.bdOutlet || 0;
          totalEc += d.totalEc || 0;
          totalVolume += Number(d.volumeGg) || 0;
        } else if (d.status === "TIDAK_ADA_KUNJUNGAN") {
          totalHariFinal++; // counted as complete/excused
        } else {
          totalHariKosong++;
          urgentSet.add(dist.districtKode);
        }
      }
    }

    const persentaseLengkap = totalSlotHari > 0
      ? Math.round((totalHariFinal / totalSlotHari) * 100)
      : 0;

    return {
      totalSlotHari,
      totalHariFinal,
      persentaseLengkap,
      totalHariDraft,
      totalHariKosong,
      draftDistricts: Array.from(draftSet),
      urgentDistricts: Array.from(urgentSet),
      totalCm,
      totalBd,
      totalEc,
      totalVolume,
    };
  }, [data]);

  // Toggle Week Lock Action
  const handleToggleLock = async (catatan?: string) => {
    if (!data) return;
    const targetStatus = data.isLocked ? "NONAKTIF" : "AKTIF";
    setIsSubmittingLock(true);
    try {
      await salesmanshipRepository.toggleWeekLock(data.kodeMinggu, targetStatus, catatan);
      showToast(
        "success",
        targetStatus === "AKTIF"
          ? `Minggu ${data.kodeMingguDisplay} berhasil dikunci.`
          : `Kunci minggu ${data.kodeMingguDisplay} berhasil dibuka.`
      );
      setIsLockModalOpen(false);
      await loadData();
    } catch (err: any) {
      showToast("error", err.message || "Gagal mengubah status kunci minggu.");
    } finally {
      setIsSubmittingLock(false);
    }
  };

  // Export to CSV helper
  const handleExportCsv = () => {
    if (!data || filteredDistricts.length === 0) {
      showToast("error", "Tidak ada data untuk diekspor.");
      return;
    }

    const header = [
      "No",
      "District",
      "Salesman",
      "OU / Cabang",
      "Senin (CM/BD/EC)",
      "Selasa (CM/BD/EC)",
      "Rabu (CM/BD/EC)",
      "Kamis (CM/BD/EC)",
      "Jumat (CM/BD/EC)",
      "Sabtu (CM/BD/EC)",
      "Hari Terisi",
      "Persentase (%)",
    ];

    const rows = filteredDistricts.map((d, idx) => {
      const dayValues = d.days.map((day) => {
        if (day.status === "KOSONG") return "KOSONG";
        if (day.status === "TIDAK_ADA_KUNJUNGAN") return `TIDAK ADA KUNJUNGAN (${day.alasan || "-"})`;
        return `${day.statusRekap || "DRAFT"}: ${day.jumlahKunjungan}/${day.bdOutlet}/${day.totalEc}`;
      });

      return [
        idx + 1,
        `"${d.districtKode}"`,
        `"${d.karyawanName}"`,
        `"${d.ouKode}"`,
        ...dayValues.map((v) => `"${v}"`),
        d.totalHariTerisi,
        `${d.persentaseLengkap}%`,
      ];
    });

    const csvContent = "\uFEFF" + [header.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Monitoring_Callsheet_Minggu_${data.kodeMingguDisplay}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("success", "Laporan rekap mingguan berhasil diunduh.");
  };

  return {
    data,
    isLoading,
    error,
    selectedWeek,
    currentIsoWeek,
    filters,
    setFilters,
    viewMode,
    setViewMode,
    operationUnits,
    filteredDistricts,
    kpiSummary,
    handlePrevWeek,
    handleNextWeek,
    handleCurrentWeek,
    handleRefresh: loadData,
    handleExportCsv,
    isLockModalOpen,
    setIsLockModalOpen,
    isSubmittingLock,
    handleToggleLock,
  };
};
