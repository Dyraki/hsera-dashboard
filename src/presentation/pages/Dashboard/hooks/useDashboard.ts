import { useState, useEffect, useCallback, useMemo } from 'react';
import { salesmanshipRepository } from '@/core/di/container';
import { DashboardDTO, DashboardOuOption } from '@/core/domain/models/Dashboard';
import { OperationUnitOption } from '@/core/domain/models/District';
import { useAuth } from '@/presentation/context/AuthContext';

export interface UseDashboardReturn {
  data: DashboardDTO | null;
  loading: boolean;
  error: string | null;
  selectedYear: number;
  selectedQuarter: number;
  selectedOu: string;
  selectedWeek: number | undefined;
  lastSyncTime: Date | null;
  isAutoSync: boolean;
  userScopeLocked: boolean;
  availableOus: DashboardOuOption[];
  setSelectedQuarter: (q: number) => void;
  setSelectedOu: (ou: string) => void;
  setSelectedWeek: (w?: number) => void;
  refresh: () => Promise<void>;
}

export const useDashboard = (): UseDashboardReturn => {
  const { user } = useAuth();

  const isSuperAdmin = user?.scope?.isSuperAdmin ?? false;
  const userUnitCode = user?.scope?.unitCode;
  const directDefaultOu = (isSuperAdmin || !userUnitCode || userUnitCode.startsWith('AREA')) ? 'ALL' : userUnitCode;

  const [selectedYear] = useState<number>(2026);
  const [selectedQuarter, setSelectedQuarter] = useState<number>(4);
  const [selectedOu, setSelectedOu] = useState<string>(directDefaultOu);
  const [selectedWeek, setSelectedWeek] = useState<number | undefined>(undefined);

  const [rawOus, setRawOus] = useState<OperationUnitOption[]>([]);
  const [hasResolvedScope, setHasResolvedScope] = useState<boolean>(() => isSuperAdmin || Boolean(userUnitCode && !userUnitCode.startsWith('AREA')));
  const [data, setData] = useState<DashboardDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isAutoSync] = useState<boolean>(true);

  // 1. Fetch Operation Units reference for hierarchical scope resolution
  useEffect(() => {
    let mounted = true;
    salesmanshipRepository.getOperationUnits()
      .then((units) => {
        if (mounted) {
          setRawOus(units);
          setHasResolvedScope(true);
        }
      })
      .catch((err) => {
        console.error('Gagal memuat referensi operation units:', err);
        if (mounted) setHasResolvedScope(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // 2. Resolve hierarchical scope & available Operation Unit filter options
  const { availableOus, userScopeLocked, initialOu } = useMemo(() => {
    const isSuperAdmin = user?.scope?.isSuperAdmin ?? false;
    const unitCode = user?.scope?.unitCode;
    const unitType = user?.scope?.unitType;
    const allowedUnitIds = user?.scope?.allowedUnitIds || [];

    // Match user's operational unit from reference list
    const userUnit = rawOus.find(
      (u) =>
        (unitCode && u.kode === unitCode) ||
        (user?.scope?.unitId && u.id === user.scope.unitId) ||
        (user?.karyawan?.operationUnitId && u.id === user.karyawan.operationUnitId)
    );

    const resolvedType = unitType || userUnit?.type;

    // Case A: Super Admin / Regional / Head Office (Top level)
    // Full access: Can view "Semua Area Cabang" and any branch
    if (isSuperAdmin || resolvedType === 'REGIONAL' || resolvedType === 'HEAD_OFFICE' || (!unitCode && allowedUnitIds.length === 0)) {
      const branches = rawOus.filter((u) => u.type === 'OPERATION_UNIT');
      const list: DashboardOuOption[] = [
        { kode: 'ALL', nama: 'Semua Area Cabang' },
        ...(branches.length > 0
          ? branches.map((b) => ({ kode: b.kode, nama: `${b.nama} (${b.kode})`, type: b.type, parentId: (b as any).parentId }))
          : [
              { kode: 'CAB-TAG', nama: 'Cabang Tulungagung (CAB-TAG)' },
              { kode: 'CAB-TGK', nama: 'Cabang Trenggalek (CAB-TGK)' },
            ]),
      ];
      return { availableOus: list, userScopeLocked: false, initialOu: 'ALL' };
    }

    // Case B: Area Office (Operation Unit di atas Cabang)
    // Can access "Semua Cabang (Area Tulungagung)" AND individual branches underneath it (CAB-TAG, CAB-TGK).
    // Not locked to single branch, but restricted from other Area Offices outside its scope.
    if (resolvedType === 'AREA_OFFICE' || unitCode?.startsWith('AREA')) {
      const childBranches = rawOus.filter(
        (u) =>
          u.type === 'OPERATION_UNIT' &&
          ((userUnit && (u as any).parentId === userUnit.id) ||
            allowedUnitIds.includes(u.kode) ||
            allowedUnitIds.includes(u.id) ||
            u.kode === 'CAB-TAG' ||
            u.kode === 'CAB-TGK')
      );

      const areaName = userUnit?.nama || 'Area Tulungagung';
      const list: DashboardOuOption[] = [
        { kode: 'ALL', nama: `Semua Cabang (${areaName})` },
        ...(childBranches.length > 0
          ? childBranches.map((b) => ({ kode: b.kode, nama: `${b.nama} (${b.kode})`, type: b.type, parentId: (b as any).parentId }))
          : [
              { kode: 'CAB-TAG', nama: 'Cabang Tulungagung (CAB-TAG)' },
              { kode: 'CAB-TGK', nama: 'Cabang Trenggalek (CAB-TGK)' },
            ]),
      ];

      return { availableOus: list, userScopeLocked: false, initialOu: 'ALL' };
    }

    // Case C: Operation Unit / Cabang Tunggal (Level Cabang ke bawah)
    // Locked strictly to their own branch; cannot view All Cabang or other branches.
    const activeBranchCode = userUnit?.kode || unitCode || 'CAB-TAG';
    const activeBranchName = userUnit?.nama || (activeBranchCode === 'CAB-TAG' ? 'Cabang Tulungagung' : `Cabang ${activeBranchCode}`);
    const list: DashboardOuOption[] = [
      { kode: activeBranchCode, nama: `${activeBranchName} (${activeBranchCode})`, type: 'OPERATION_UNIT' },
    ];

    return { availableOus: list, userScopeLocked: true, initialOu: activeBranchCode };
  }, [user, rawOus]);

  // Sync initial OU when resolved
  useEffect(() => {
    if (initialOu && selectedOu === 'ALL' && userScopeLocked) {
      setSelectedOu(initialOu);
    }
  }, [initialOu, userScopeLocked, selectedOu]);

  // 3. Fetch Dashboard data from Backend
  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await salesmanshipRepository.getDashboard({
        tahun: selectedYear,
        kuartal: selectedQuarter,
        kodeMinggu: selectedWeek,
        ouKode: selectedOu !== 'ALL' ? selectedOu : undefined,
      });
      setData(res);
      setLastSyncTime(new Date());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data dashboard.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedQuarter, selectedWeek, selectedOu]);

  useEffect(() => {
    if (hasResolvedScope) {
      fetchDashboard();
    }
  }, [fetchDashboard, hasResolvedScope]);

  // Keyboard shortcut: F6 to Refresh
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F6') {
        e.preventDefault();
        fetchDashboard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fetchDashboard]);

  const handleQuarterChange = useCallback((q: number) => {
    setSelectedQuarter(q);
    setSelectedWeek(undefined);
  }, []);

  return {
    data,
    loading,
    error,
    selectedYear,
    selectedQuarter,
    selectedOu,
    selectedWeek,
    lastSyncTime,
    isAutoSync,
    userScopeLocked,
    availableOus,
    setSelectedQuarter: handleQuarterChange,
    setSelectedOu,
    setSelectedWeek,
    refresh: fetchDashboard,
  };
};
