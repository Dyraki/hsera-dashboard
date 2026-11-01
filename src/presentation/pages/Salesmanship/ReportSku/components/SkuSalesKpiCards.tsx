import React from 'react';
import { Target, ShoppingBag, TrendingUp, TrendingDown, Award, Clock } from 'lucide-react';
import { SkuSalesKpiSummary } from '@/core/domain/models/ReportSkuSales';

interface SkuSalesKpiCardsProps {
  kpi: SkuSalesKpiSummary;
}

export const SkuSalesKpiCards: React.FC<SkuSalesKpiCardsProps> = ({ kpi }) => {
  const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);

  const callAchieve = kpi.kunjungan.achievementPercent;
  const isCallGood = callAchieve >= 85;
  const isCallWarning = callAchieve < 70;

  const isGrowthPositive = kpi.growthWtd.isPositive;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Kunjungan vs Target (Effort) */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-primary-300 transition-colors">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <Target className="w-3.5 h-3.5 text-primary-600" />
              <span>Kunjungan vs Target</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-gray-900 tracking-tight">
                {formatNumber(kpi.kunjungan.actual)}
              </span>
              <span className="text-xs font-semibold font-mono text-gray-400">
                / {formatNumber(kpi.kunjungan.target)} Call
              </span>
            </div>
          </div>
          <span
            className={`text-xs font-black font-mono px-2 py-0.5 rounded-full border ${
              isCallGood
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isCallWarning
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {callAchieve}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isCallGood ? 'bg-emerald-500' : isCallWarning ? 'bg-rose-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, callAchieve)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span>Pencapaian ritase s/d {kpi.penjualanWtd.cutOffDayName}</span>
          </p>
        </div>
      </div>

      {/* 2. Penjualan SKU Minggu Berjalan (WTD) */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-primary-300 transition-colors">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <ShoppingBag className="w-3.5 h-3.5 text-primary-600" />
              <span>Penjualan W{kpi.penjualanWtd.currentWeekNumber} (WTD)</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-gray-900 tracking-tight">
                {formatNumber(kpi.penjualanWtd.currentVolume)}
              </span>
              <span className="text-xs font-medium text-gray-500">Pack</span>
            </div>
          </div>
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-primary-50 text-primary-700 border border-primary-200">
            W{kpi.penjualanWtd.currentWeekNumber} Aktif
          </span>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Cut-off hari:</span>
          <span className="font-semibold text-gray-700">{kpi.penjualanWtd.cutOffDayName}</span>
        </div>
      </div>

      {/* 3. Like-for-Like WTD Growth vs Previous Cycle */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-primary-300 transition-colors">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {isGrowthPositive ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
              )}
              <span>Growth Like-for-Like</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={`text-2xl font-black font-mono tracking-tight ${
                  kpi.growthWtd.percent === null
                    ? 'text-gray-700'
                    : isGrowthPositive
                    ? 'text-emerald-700'
                    : 'text-rose-700'
                }`}
              >
                {kpi.growthWtd.percent !== null ? (
                  <>
                    {isGrowthPositive ? '+' : ''}
                    {kpi.growthWtd.percent}%
                  </>
                ) : (
                  <span className="text-gray-400 font-sans text-xl font-medium">-</span>
                )}
              </span>
              <span className="text-xs font-semibold font-mono text-gray-500">
                ({isGrowthPositive ? '+' : ''}
                {formatNumber(kpi.growthWtd.deltaPack)} pk)
              </span>
            </div>
          </div>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full border flex items-center gap-0.5 ${
              kpi.growthWtd.percent === null
                ? 'bg-gray-50 text-gray-600 border-gray-200'
                : isGrowthPositive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {kpi.growthWtd.percent === null ? 'Siklus Awal' : isGrowthPositive ? '▲ Naik' : '▼ Turun'}
          </span>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Pembanding Siklus Lalu:</span>
          <span className="font-semibold text-gray-700 font-mono">
            W{kpi.growthWtd.prevWeekNumber} ({kpi.growthWtd.prevVolume > 0 ? `${formatNumber(kpi.growthWtd.prevVolume)} pk` : 'Kosong / 0 pk'})
          </span>
        </div>
      </div>

      {/* 4. Productivity / Drop Size */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-primary-300 transition-colors">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-primary-600" />
              <span>Drop Size (Pack / Call)</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-gray-900 tracking-tight">
                {formatNumber(kpi.productivity.dropSize)}
              </span>
              <span className="text-xs font-medium text-gray-500">Pack / Toko</span>
            </div>
          </div>
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700">
            {formatNumber(kpi.productivity.totalCalls)} Call
          </span>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Total Vol Kuartal:</span>
          <span className="font-bold text-indigo-900 font-mono">
            {formatNumber(kpi.quarterOverview.totalQuarterVolume)} pk ({kpi.quarterOverview.activeSkuCount} SKU)
          </span>
        </div>
      </div>
    </div>
  );
};
