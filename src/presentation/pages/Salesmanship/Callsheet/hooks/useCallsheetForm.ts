import { useState, useEffect, useCallback, useMemo } from "react";
import { District } from "@/core/domain/models/District";
import {
  CallsheetFormResponse,
  JenisRekap,
  StatusRekap,
  SaveCallsheetPayload
} from "@/core/domain/models/Callsheet";
import { salesmanshipRepository } from "@/core/di/container";
import { useToast } from "@/presentation/context/ToastContext";
import { RowValidationResult, ColumnTotals } from "../types";

const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useCallsheetForm = () => {
  const { showToast } = useToast();

  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  const [formSkeleton, setFormSkeleton] = useState<CallsheetFormResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [jenisRekap, setJenisRekap] = useState<JenisRekap>("NORMAL");
  const [alasan, setAlasan] = useState<string>("");
  const [jumlahKunjungan, setJumlahKunjungan] = useState<number>(0);
  const [totalEc, setTotalEc] = useState<number>(0);
  const [bdOutlet, setBdOutlet] = useState<number>(0);
  const [volumeGg, setVolumeGg] = useState<string>("");
  const [catatan, setCatatan] = useState<string>("");
  const [statusRekap, setStatusRekap] = useState<StatusRekap>("DRAFT");
  const [rekapId, setRekapId] = useState<string | undefined>(undefined);
  const [matrix, setMatrix] = useState<Record<string, Record<string, number>>>({});

  // Fetch districts on mount
  useEffect(() => {
    let isMounted = true;
    const loadDistricts = async () => {
      try {
        const list = await salesmanshipRepository.getDistricts({ status: "AKTIF" });
        if (isMounted) {
          setDistricts(list);
          if (list.length > 0 && !selectedDistrictId) {
            setSelectedDistrictId(list[0].id);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          showToast("error", err.message || "Gagal memuat daftar distrik");
        }
      }
    };
    loadDistricts();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  // Load Form Skeleton & existing rekap whenever selectedDistrictId or selectedDate changes
  const loadFormData = useCallback(async () => {
    if (!selectedDistrictId || !selectedDate) return;

    setIsLoading(true);
    setFormError(null);
    try {
      const data = await salesmanshipRepository.getCallsheetFormData(selectedDistrictId, selectedDate);
      setFormSkeleton(data);

      // Populate form state from rekap
      const r = data.rekap;
      const initialKunjungan = r?.jumlahKunjungan || 0;
      setRekapId(r?.id);
      setJenisRekap(r?.jenisRekap || "NORMAL");
      setAlasan(r?.alasan || "");
      setJumlahKunjungan(initialKunjungan);
      setTotalEc(r?.totalEc || 0);
      setBdOutlet(r?.bdOutlet || 0);
      setVolumeGg(r?.volumeGg != null ? String(r.volumeGg) : "");
      setCatatan(r?.catatan || "");
      setStatusRekap(r?.statusRekap || "DRAFT");

      // Build full initial matrix with BD and BPJ computed
      const newMatrix: Record<string, Record<string, number>> = {};
      const rawMatrix = r?.matrix || {};

      for (const brand of data.brands) {
        const row = rawMatrix[brand.id] || {};
        const oos = Number(row["OOS"]) || 0;
        const sk = Number(row["SK"]) || 0;
        const sl = Number(row["SL"]) || 0;
        const sd = Number(row["SD"]) || 0;
        const sb = Number(row["SB"]) || 0;
        const tl = Number(row["TL"]) || 0;
        const stock = Number(row["STOCK"]) || 0;
        const buy = Number(row["BUY"]) || 0;
        const fu = Number(row["FACE_UP"]) || 0;

        const bd = oos + sk + sl + sd + sb;
        const sumOthers = sk + sl + sd + oos + sb + tl;
        // Rumus: BPJ = Jumlah Kunjungan - (SK + SL + SD + OOS + SB + TL)
        const bpj = initialKunjungan > 0 ? Math.max(0, initialKunjungan - sumOthers) : (Number(row["BPJ"]) || 0);

        newMatrix[brand.id] = {
          OOS: oos,
          SK: sk,
          SL: sl,
          SD: sd,
          SB: sb,
          BD: bd,
          TL: tl,
          BPJ: bpj,
          STOCK: stock,
          BUY: buy,
          FACE_UP: fu,
        };
      }

      setMatrix(newMatrix);
    } catch (err: any) {
      setFormError(err.message || "Gagal memuat form callsheet");
      showToast("error", err.message || "Gagal memuat form callsheet");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDistrictId, selectedDate, showToast]);

  useEffect(() => {
    loadFormData();
  }, [loadFormData]);

  // Handle Jumlah Kunjungan Change & Live Recalculate BPJ for all brands
  const handleJumlahKunjunganChange = useCallback((newKunjungan: number) => {
    const val = Math.max(0, newKunjungan);
    setJumlahKunjungan(val);

    setMatrix((prev) => {
      const updated: Record<string, Record<string, number>> = {};
      for (const [brandId, row] of Object.entries(prev)) {
        const oos = row["OOS"] || 0;
        const sk = row["SK"] || 0;
        const sl = row["SL"] || 0;
        const sd = row["SD"] || 0;
        const sb = row["SB"] || 0;
        const tl = row["TL"] || 0;
        const sumOthers = sk + sl + sd + oos + sb + tl;
        const bpj = val > 0 ? Math.max(0, val - sumOthers) : 0;

        updated[brandId] = {
          ...row,
          BPJ: bpj,
        };
      }
      return updated;
    });
  }, []);

  // Handle Matrix Cell Input Change
  const handleCellChange = useCallback((brandId: string, notasiKode: string, val: number) => {
    if (formSkeleton?.isLocked) return;

    setMatrix((prev) => {
      const currentRow = { ...(prev[brandId] || {}) };
      currentRow[notasiKode] = Math.max(0, val);

      // Auto-compute BD = OOS + SK + SL + SD + SB
      const oos = currentRow["OOS"] || 0;
      const sk = currentRow["SK"] || 0;
      const sl = currentRow["SL"] || 0;
      const sd = currentRow["SD"] || 0;
      const sb = currentRow["SB"] || 0;
      currentRow["BD"] = oos + sk + sl + sd + sb;

      // Auto-compute BPJ = Jumlah Kunjungan - (SK + SL + SD + OOS + SB + TL)
      const tl = currentRow["TL"] || 0;
      const sumOthers = sk + sl + sd + oos + sb + tl;
      currentRow["BPJ"] = jumlahKunjungan > 0 ? Math.max(0, jumlahKunjungan - sumOthers) : 0;

      return {
        ...prev,
        [brandId]: currentRow,
      };
    });
  }, [formSkeleton, jumlahKunjungan]);

  // Live Row Validations
  const rowValidations = useMemo<RowValidationResult[]>(() => {
    if (!formSkeleton?.brands) return [];

    return formSkeleton.brands.map((brand) => {
      const row = matrix[brand.id] || {};
      const oos = row["OOS"] || 0;
      const sk = row["SK"] || 0;
      const sl = row["SL"] || 0;
      const sd = row["SD"] || 0;
      const sb = row["SB"] || 0;
      const tl = row["TL"] || 0;
      const bpj = row["BPJ"] || 0;
      // Rumus: SK + SL + SD + OOS + SB + TL + BPJ = Jumlah Kunjungan
      const totalStatus = sk + sl + sd + oos + sb + tl + bpj;
      const diff = totalStatus - jumlahKunjungan;

      return {
        brandId: brand.id,
        brandKode: brand.kode,
        brandNama: brand.nama,
        totalStatus,
        jumlahKunjungan,
        diff,
        isMatch: diff === 0,
        isOver: diff > 0,
        isUnder: diff < 0,
      };
    });
  }, [formSkeleton, matrix, jumlahKunjungan]);

  // Live Column Totals
  const columnTotals = useMemo<ColumnTotals>(() => {
    let oos = 0, sk = 0, sl = 0, sd = 0, sb = 0, bd = 0, tl = 0, bpj = 0;
    let stock = 0, buy = 0, faceUp = 0;
    let okCount = 0, warnCount = 0, errCount = 0;

    for (const rv of rowValidations) {
      if (rv.isMatch) okCount++;
      else if (rv.isUnder) warnCount++;
      else if (rv.isOver) errCount++;

      const row = matrix[rv.brandId] || {};
      oos += row["OOS"] || 0;
      sk += row["SK"] || 0;
      sl += row["SL"] || 0;
      sd += row["SD"] || 0;
      sb += row["SB"] || 0;
      bd += row["BD"] || 0;
      tl += row["TL"] || 0;
      bpj += row["BPJ"] || 0;
      stock += row["STOCK"] || 0;
      buy += row["BUY"] || 0;
      faceUp += row["FACE_UP"] || 0;
    }

    return {
      oos, sk, sl, sd, sb, bd, tl, bpj, stock, buy, faceUp,
      okCount, warnCount, errCount
    };
  }, [rowValidations, matrix]);

  // Save submission helper
  const submitCallsheet = async (targetStatus: StatusRekap): Promise<boolean> => {
    if (!selectedDistrictId || !selectedDate) {
      showToast("error", "Distrik dan Tanggal wajib dipilih.");
      return false;
    }

    if (formSkeleton?.isLocked) {
      showToast("error", "Minggu ini telah dikunci untuk audit. Data tidak dapat disimpan.");
      return false;
    }

    if (jenisRekap === "TIDAK_ADA_KUNJUNGAN" && (!alasan || alasan.trim().length === 0)) {
      showToast("error", "Alasan wajib diisi jika memilih opsi Tidak Ada Kunjungan.");
      return false;
    }

    setIsSubmitting(true);
    try {
      // Flatten matrix
      const matrixPayload: Array<{ brandId: string; notasiKode: string; nilai: number }> = [];

      if (jenisRekap === "NORMAL") {
        for (const [brandId, row] of Object.entries(matrix)) {
          for (const [notasiKode, val] of Object.entries(row)) {
            matrixPayload.push({
              brandId,
              notasiKode,
              nilai: Number(val) || 0,
            });
          }
        }
      }

      const payload: SaveCallsheetPayload = {
        id: rekapId,
        districtId: selectedDistrictId,
        tglKunjungan: selectedDate,
        jenisRekap,
        alasan: jenisRekap === "TIDAK_ADA_KUNJUNGAN" ? alasan : undefined,
        jumlahKunjungan: jenisRekap === "NORMAL" ? Number(jumlahKunjungan) || 0 : 0,
        totalEc: jenisRekap === "NORMAL" ? Number(totalEc) || 0 : 0,
        bdOutlet: jenisRekap === "NORMAL" ? Number(bdOutlet) || 0 : 0,
        volumeGg: jenisRekap === "NORMAL" ? Number(columnTotals.buy) : null,
        statusRekap: targetStatus,
        catatan: catatan || undefined,
        matrix: matrixPayload,
      };

      await salesmanshipRepository.saveCallsheet(payload);
      showToast(
        "success",
        targetStatus === "FINAL"
          ? "Rekap Callsheet berhasil difinalkan!"
          : "Draft Callsheet berhasil disimpan!"
      );
      await loadFormData();
      return true;
    } catch (err: any) {
      showToast("error", err.message || "Gagal menyimpan callsheet.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => submitCallsheet("DRAFT");
  const handleFinalize = () => submitCallsheet("FINAL");

  // Keyboard shortcut listener for Ctrl+S (Draft) and F8 (Finalize)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSaveDraft();
      } else if (e.key === "F8") {
        e.preventDefault();
        handleFinalize();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return {
    districts,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedDate,
    setSelectedDate,
    formSkeleton,
    isLoading,
    isSubmitting,
    formError,
    // Fields
    jenisRekap,
    setJenisRekap,
    alasan,
    setAlasan,
    jumlahKunjungan,
    setJumlahKunjungan: handleJumlahKunjunganChange,
    totalEc,
    setTotalEc,
    bdOutlet,
    setBdOutlet,
    volumeGg,
    setVolumeGg,
    catatan,
    setCatatan,
    statusRekap,
    rekapId,
    matrix,
    handleCellChange,
    rowValidations,
    columnTotals,
    handleSaveDraft,
    handleFinalize,
    refreshData: loadFormData,
  };
};
