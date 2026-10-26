import React from 'react';
import { RefreshCw, MapPin, Calendar, Building2, Lock, Clock } from 'lucide-react';
import { DashboardHeaderContext, DashboardOuOption, QuarterOption } from '@/core/domain/models/Dashboard';

interface DashboardHeaderBarProps {
  headerContext?: DashboardHeaderContext;
  selectedQuarter: number;
  selectedOu: string;
  selectedWeek?: number;
  loading: boolean;
  userScopeLocked: boolean;
  availableOus?: DashboardOuOption[];
  lastSyncTime: Date | null;
  onQuarterChange: (q: number) => void;
  onOuChange: (ou: string) => void;
  onWeekChange?: (w: number) => void;
  onRefresh: () => void;
}

export const DashboardHeaderBar: React.FC<DashboardHeaderBarProps> = ({
  headerContext,
  selectedQuarter,
  selectedOu,
  selectedWeek,
  loading,
  userScopeLocked,
  availableOus = [],
  lastSyncTime,
  onQuarterChange,
  onOuChange,
  onWeekChange,
  onRefresh,
}) => {
  const scopeName = headerContext?.scopeUnitName || 'Wilayah Operasional';
  const weekLabel = headerContext?.sessionWeekDisplay || 'W-42';
  
  const quarters: QuarterOption[] = headerContext?.availableQuarters && headerContext.availableQuarters.length > 0
    ? headerContext.availableQuarters
    : [
        { quarter: 1, label: 'Kuartal Q1 2026 (W01 - W13)' },
        { quarter: 2, label: 'Kuartal Q2 2026 (W14 - W26)' },
        { quarter: 3, label: 'Kuartal Q3 2026 (W27 - W39)' },
        { quarter: 4, label: 'Kuartal Q4 2026 (W40 - W52)' },
      ];

  const formatTime = (d: Date | null) => {
    if (!d) return '--:--:--';
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="space-y-4">
      {/* Top Context & Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-50/80 border border-slate-200/90 rounded-lg text-xs text-slate-600 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-xs">
            <Building2 size={14} className="text-indigo-600 shrink-0" />
            <span>Scope: {scopeName}</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-xs">
            <Clock size={13} className="text-emerald-600 shrink-0" />
            <span>Sesi Evaluasi: <strong className="text-slate-900 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{weekLabel}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Realtime Auto-Sync</span>
            <span className="text-slate-400 font-mono text-[11px]">({formatTime(lastSyncTime)})</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            title="Muat ulang data (Shortcut: F6)"
            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 font-medium transition cursor-pointer disabled:opacity-50 text-[11px]"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin text-indigo-600' : 'text-slate-500'} />
            <span>Refresh (F6)</span>
          </button>
        </div>
      </div>

      {/* Main Header & Filter Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Dashboard Salesmanship
            </h1>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded shrink-0">
              Performance Overview
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Monitoring tren volume kuartal serta evaluasi performa callsheet, matriks 15 Brand HSERA, dan evaluasi salesman per minggu aktif.
          </p>
        </div>

        {/* Filter Dropdowns - STRICTLY SEJAJAR (Inline horizontal flex, equal h-9 height, no wrap) */}
        <div className="flex items-center gap-2.5 flex-nowrap shrink-0 overflow-x-auto">
          {/* Area / Branch Selector */}
          <div className="flex items-center gap-2 px-3 h-9 bg-white border border-slate-300 rounded-lg text-xs shadow-xs hover:border-slate-400 transition shrink-0">
            <MapPin size={14} className="text-slate-500 shrink-0" />
            <select
              value={selectedOu}
              onChange={(e) => onOuChange(e.target.value)}
              disabled={userScopeLocked || loading}
              aria-label="Filter Area Cabang"
              className="bg-transparent border-none text-slate-700 font-medium focus:outline-none cursor-pointer disabled:cursor-not-allowed pr-1 max-w-[210px]"
            >
              {availableOus.length > 0 ? (
                availableOus.map((ou) => (
                  <option key={ou.kode} value={ou.kode}>
                    {ou.nama}
                  </option>
                ))
              ) : (
                <>
                  <option value="ALL">Semua Area Cabang</option>
                  <option value="CAB-TAG">Cabang Tulungagung (CAB-TAG)</option>
                  <option value="CAB-TGK">Cabang Trenggalek (CAB-TGK)</option>
                </>
              )}
            </select>
            {userScopeLocked && (
              <span title="Scope dibatasi sesuai hak akses cabang" className="text-amber-500 shrink-0 ml-0.5">
                <Lock size={12} />
              </span>
            )}
          </div>

          {/* Quarter Selector */}
          <div className="flex items-center gap-2 px-3 h-9 bg-white border border-slate-300 rounded-lg text-xs shadow-xs hover:border-slate-400 transition shrink-0">
            <Calendar size={14} className="text-indigo-600 shrink-0" />
            <select
              value={selectedQuarter}
              onChange={(e) => onQuarterChange(Number(e.target.value))}
              disabled={loading}
              aria-label="Filter Kuartal"
              className="bg-transparent border-none text-slate-800 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {quarters.map((q) => {
                const qNum = q.quarter ?? (q as any).id;
                return (
                  <option key={qNum} value={qNum}>
                    {q.label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Week Evaluasi Selector (Dual-Scope Hierarkis) */}
          {headerContext?.availableWeeks && headerContext.availableWeeks.length > 0 && (
            <div className="flex items-center gap-2 px-3 h-9 bg-emerald-50/60 border border-emerald-300 rounded-lg text-xs shadow-xs hover:border-emerald-400 transition shrink-0">
              <Clock size={14} className="text-emerald-700 shrink-0" />
              <select
                value={selectedWeek !== undefined ? selectedWeek : (headerContext.sessionWeek ?? 0)}
                onChange={(e) => onWeekChange && onWeekChange(Number(e.target.value))}
                disabled={loading}
                aria-label="Filter Minggu Evaluasi"
                className="bg-transparent border-none text-emerald-900 font-bold focus:outline-none cursor-pointer pr-1"
              >
                <option value={0}>Semua Minggu (1 Kuartal)</option>
                {headerContext.availableWeeks.map((w) => {
                  const cleanLabel = w.label.replace(/\s*\(Terbaru\)/i, '');
                  return (
                    <option key={w.kodeMinggu} value={w.kodeMinggu}>
                      Minggu {cleanLabel}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
