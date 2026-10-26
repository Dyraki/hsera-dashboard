import React from 'react';
import { Users, ShoppingBag, Store, Box, CheckCircle2, AlertCircle } from 'lucide-react';
import { DashboardKpiSummary } from '@/core/domain/models/Dashboard';

interface DashboardKpiCardsProps {
  summary?: DashboardKpiSummary;
  loading?: boolean;
}

export const DashboardKpiCards: React.FC<DashboardKpiCardsProps> = React.memo(({ summary, loading }) => {
  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const kunjungan = summary?.kunjungan;
  const ec = summary?.ec;
  const bd = summary?.bd;
  const volume = summary?.volume;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 bg-slate-200 rounded" />
              <div className="h-9 w-9 bg-slate-100 rounded-full" />
            </div>
            <div className="mt-3 h-7 w-20 bg-slate-200 rounded" />
            <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full" />
            <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between">
              <div className="h-2.5 w-24 bg-slate-100 rounded" />
              <div className="h-2.5 w-16 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. KUNJUNGAN CARD */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:shadow-md transition relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              1. Kunjungan Rute
            </span>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 leading-none">
                {loading ? '...' : formatNumber(kunjungan?.actual)}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                / {loading ? '...' : formatNumber(kunjungan?.target)} Target
              </span>
            </div>
          </div>
          <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users size={18} />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-500">Capaian Disiplin:</span>
            <span className={`font-bold ${kunjungan?.isAchieved ? 'text-blue-600' : 'text-amber-600'}`}>
              {kunjungan?.percent ?? 0}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                kunjungan?.isAchieved ? 'bg-blue-600' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, kunjungan?.percent || 0)}%` }}
            />
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Standar Disiplin: ≥90%</span>
          {kunjungan?.isAchieved ? (
            <span className="text-emerald-600 flex items-center gap-0.5 font-medium">
              <CheckCircle2 size={12} /> Memenuhi
            </span>
          ) : (
            <span className="text-amber-600 flex items-center gap-0.5 font-medium">
              <AlertCircle size={12} /> Di Bawah Target
            </span>
          )}
        </div>
      </div>

      {/* 2. EFFECTIVE CALL (EC) CARD */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:shadow-md transition relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              2. Effective Call (EC)
            </span>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 leading-none">
                {loading ? '...' : formatNumber(ec?.actual)}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                / {loading ? '...' : formatNumber(ec?.target)} Target
              </span>
            </div>
          </div>
          <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShoppingBag size={18} />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-500">Capaian Target EC:</span>
            <span className="font-bold text-emerald-600">
              {ec?.percent ?? 0}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ec?.percent || 0)}%` }}
            />
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Rasio Konversi Order:</span>
          <span className="font-semibold text-slate-800">
            {ec?.conversionRate ?? 0}% of Call
          </span>
        </div>
      </div>

      {/* 3. BRAND DISTRIBUTION (BD) CARD */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:shadow-md transition relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              3. Brand Distribution (BD)
            </span>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 leading-none">
                {loading ? '...' : formatNumber(bd?.actual)}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                / {loading ? '...' : formatNumber(bd?.target)} Target
              </span>
            </div>
          </div>
          <div className="h-9 w-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Store size={18} />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-500">Penetrasi Toko:</span>
            <span className="font-bold text-purple-600">
              {bd?.percent ?? 0}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, bd?.percent || 0)}%` }}
            />
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Toko Aktif Terdistribusi:</span>
          <span className="font-semibold text-slate-800">
            {formatNumber(bd?.totalToko)} Outlet
          </span>
        </div>
      </div>

      {/* 4. VOLUME PENJUALAN CARD (1 Karton = 800 Pack) */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:shadow-md transition relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              4. Volume Penjualan
            </span>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 leading-none">
                {loading ? '...' : formatNumber(volume?.actualPack)}
              </span>
              <span className="text-xs text-slate-400 font-medium">Pack</span>
            </div>
          </div>
          <div className="h-9 w-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Box size={18} />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-500">Target Achievement:</span>
            <span className="font-bold text-indigo-600">
              {volume?.percent ?? 0}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, volume?.percent || 0)}%` }}
            />
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Setara Karton:</span>
          <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 text-[10px]">
            {volume?.equivalentKarton ?? 0} Karton <span className="text-slate-400 font-normal">(@800)</span>
          </span>
        </div>
      </div>
    </div>
  );
});
