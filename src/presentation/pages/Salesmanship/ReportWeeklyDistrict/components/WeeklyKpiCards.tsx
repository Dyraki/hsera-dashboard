import React from 'react';
import { WeeklyDistrictReportResponse } from '@/core/domain/models/ReportWeeklyDistrict';
import { Store, ShoppingCart, Network, PackageCheck, TrendingUp } from 'lucide-react';

interface WeeklyKpiCardsProps {
  kpi: WeeklyDistrictReportResponse['kpiSummary'];
}

export const WeeklyKpiCards: React.FC<WeeklyKpiCardsProps> = ({ kpi }) => {
  const { kunjungan, ec, bd, volume, territoryReachIndex } = kpi;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. KUNJUNGAN VS TARGET */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-primary-300 transition-colors">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Kunjungan vs Target
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-gray-950">
                {kunjungan.actual.toLocaleString('id-ID')}
              </span>
              <span className="text-sm font-semibold text-gray-400">
                / {kunjungan.target.toLocaleString('id-ID')} calls
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Store className="w-5 h-5" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-700">
              {kunjungan.percent}% Ritase Terpenuhi
            </span>
            <span
              className={`font-semibold ${
                kunjungan.gap >= 0 ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {kunjungan.gap >= 0 ? `+${kunjungan.gap}` : kunjungan.gap} calls
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                kunjungan.percent >= 90
                  ? 'bg-emerald-500'
                  : kunjungan.percent >= 75
                  ? 'bg-primary-600'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, kunjungan.percent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. CALLMADE / EFFECTIVE CALL */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-primary-300 transition-colors">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Callmade (EC)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-primary-700">
                {ec.actual.toLocaleString('id-ID')}
              </span>
              <span className="text-sm font-semibold text-gray-400">
                {ec.target > 0 ? `/ ${ec.target.toLocaleString('id-ID')} outlet` : 'outlet'}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

        {/* Progress bar target EC jika diset */}
        {ec.target > 0 ? (
          <div className="mt-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-primary-700">
                {ec.percentFromTarget}% dari Target EC
              </span>
              <span className="font-medium text-gray-500">
                {ec.percentFromKunjungan}% Rasio Beli
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-primary-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ec.percentFromTarget)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="mt-3.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-200">
              {ec.percentFromKunjungan}% Rasio Beli
            </span>
            <span className="text-gray-500 font-medium">
              {ec.nonTransaksi} Non-Transaksi
            </span>
          </div>
        )}
      </div>

      {/* 3. BRAND DISTRIBUTION (BD OUTLET) */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-purple-300 transition-colors">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
              BD Outlet (Distribusi)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-purple-800">
                {bd.actual.toLocaleString('id-ID')}
              </span>
              <span className="text-sm font-semibold text-gray-400">
                / {bd.target.toLocaleString('id-ID')} outlet
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Network className="w-5 h-5" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-purple-800">
              {bd.percentFromTarget}% dari Target BD
            </span>
            <span className="font-medium text-gray-500">
              {bd.percentFromKunjungan}% Call BD
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, bd.percentFromTarget)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. TOTAL VOLUME PENJUALAN */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-emerald-300 transition-colors">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Total Volume Penjualan
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-800">
                {volume.actual.toLocaleString('id-ID')}
              </span>
              <span className="text-sm font-semibold text-gray-400">
                {volume.target > 0 ? `/ ${volume.target.toLocaleString('id-ID')} Pk` : 'Pk'}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
            <PackageCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Progress bar target Volume jika diset */}
        {volume.target > 0 ? (
          <div className="mt-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-800">
                {volume.percentFromTarget}% dari Target Vol
              </span>
              <span className="font-medium text-emerald-700 inline-flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Penetrasi: {territoryReachIndex}%</span>
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  volume.percentFromTarget >= 100
                    ? 'bg-emerald-500'
                    : volume.percentFromTarget >= 75
                    ? 'bg-teal-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, volume.percentFromTarget)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="mt-3.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Penetrasi Riil: {territoryReachIndex}%</span>
            </span>
            <span className="text-gray-500 text-[11px]">Total Stok Terdistribusi</span>
          </div>
        )}
      </div>
    </div>
  );
};
